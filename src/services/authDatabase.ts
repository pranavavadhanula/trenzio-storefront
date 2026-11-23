/**
 * TREVORI ATELIER SECURE USER DATABASE
 * Persistent client-side user database stored in localStorage under 'trevori_registered_users'.
 * Enforces strict authentication: only verified registered accounts with matching credentials
 * are granted access to the Atelier Vault.
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  tier: string;
  creditsINR: number;
  points: number;
  joinedDate: string;
  createdAt: string;
  authProvider: 'email' | 'google' | 'phone';
  picture?: string;
}

const STORAGE_KEY = 'trevori_registered_users';

/**
 * Pre-seeded VIP Atelier members so test credentials work out-of-the-box,
 * while strictly barring any un-registered or wrong-password attempts.
 */
const SEED_USERS: UserAccount[] = [
  {
    id: 'trevori-vip-001',
    name: 'TREVORI VIP ATELIER',
    email: 'vip@trevori.com',
    phone: '+91 98765 43210',
    password: 'trevori2026!',
    tier: 'Noir Member',
    creditsINR: 2500,
    points: 5400,
    joinedDate: 'October 2026',
    createdAt: '2026-10-01T00:00:00.000Z',
    authProvider: 'email',
  },
  {
    id: 'trevori-patron-002',
    name: 'PRANAV AVADHANULA',
    email: 'pranav@trevori.com',
    phone: '+91 98850 12345',
    password: 'trevori2026!',
    tier: 'Founding Patron',
    creditsINR: 5000,
    points: 12000,
    joinedDate: 'September 2026',
    createdAt: '2026-09-01T00:00:00.000Z',
    authProvider: 'email',
  },
];

/**
 * Retrieve all registered users from localStorage.
 * Initializes default accounts if empty.
 */
export function getRegisteredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return SEED_USERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let users: UserAccount[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          users = parsed;
        }
      } catch {}
    }

    // Ensure SEED_USERS are always registered in the database
    let changed = false;
    for (const seed of SEED_USERS) {
      if (!users.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
        users.push(seed);
        changed = true;
      }
    }

    if (changed || !raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    return users;
  } catch (err) {
    console.error('Failed to read Trevori user database:', err);
    return SEED_USERS;
  }
}

/**
 * Save users back to localStorage
 */
export function saveRegisteredUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save Trevori user database:', err);
  }
}

/**
 * Find user by email (case-insensitive)
 */
export function findUserByEmail(email: string): UserAccount | undefined {
  const cleanEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find((u) => u.email.toLowerCase() === cleanEmail);
}

/**
 * Register a new user account with strict field validation
 */
export function registerUser(details: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): { success: boolean; error?: string; user?: UserAccount } {
  const cleanName = details.name.trim();
  const cleanEmail = details.email.trim().toLowerCase();
  const cleanPhone = details.phone.trim();
  const cleanPassword = details.password.trim();

  // Strict Field Validations
  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Please enter your full legal name.' };
  }
  if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 7) {
    return { success: false, error: 'Please provide a valid phone number (at least 7 digits).' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const users = getRegisteredUsers();

  // Check if email already registered
  const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    return {
      success: false,
      error: 'An account with this email address is already registered. Please sign in.',
    };
  }

  // Create new user profile in database
  const newUser: UserAccount = {
    id: `trevori-usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: cleanName.toUpperCase(),
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPassword,
    tier: 'Noir Member',
    creditsINR: 1500,
    points: 4800,
    joinedDate: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    createdAt: new Date().toISOString(),
    authProvider: 'email',
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  return { success: true, user: newUser };
}

/**
 * Strict authentication against registered database.
 * Blocks any unknown email or mismatched password.
 */
export function authenticateUser(
  identifier: string,
  password: string
): { success: boolean; error?: string; user?: UserAccount } {
  const cleanInput = identifier.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanInput) {
    return { success: false, error: 'Please provide your email address.' };
  }

  if (!cleanPassword) {
    return { success: false, error: 'Please enter your account password.' };
  }

  const users = getRegisteredUsers();

  // Look up user by exact email or phone number
  const matched = users.find(
    (u) =>
      u.email.toLowerCase() === cleanInput ||
      u.phone.replace(/\D/g, '') === cleanInput.replace(/\D/g, '')
  );

  // If NOT in database: Strictly reject
  if (!matched) {
    return {
      success: false,
      error: 'Access Denied: No Trevori account found with this email. Please check your credentials or create an account via Sign Up.',
    };
  }

  // If user registered with Google OAuth and has no local password
  if (matched.authProvider === 'google' && !matched.password) {
    return {
      success: false,
      error: 'This account was created using Google. Please log in using "Login with Google".',
    };
  }

  // Strict password verification
  if (matched.password !== cleanPassword) {
    return {
      success: false,
      error: 'Access Denied: Incorrect password. Please verify your credentials and try again.',
    };
  }

  // Access Granted!
  return { success: true, user: matched };
}

/**
 * Google OAuth account registration or login in database
 */
export function registerOrLoginGoogleUser(profile: {
  email: string;
  name?: string;
  picture?: string;
}): { success: boolean; user: UserAccount } {
  const cleanEmail = profile.email.trim().toLowerCase();
  const users = getRegisteredUsers();
  let existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    // Update picture or provider if needed
    if (profile.picture) existing.picture = profile.picture;
    saveRegisteredUsers(users);
    return { success: true, user: existing };
  }

  // Create new user in database
  const newUser: UserAccount = {
    id: `trevori-google-${Date.now()}`,
    name: (profile.name || cleanEmail.split('@')[0]).toUpperCase(),
    email: cleanEmail,
    phone: '+91 98765 43210',
    tier: 'Noir Member',
    creditsINR: 1500,
    points: 4800,
    joinedDate: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    createdAt: new Date().toISOString(),
    authProvider: 'google',
    picture: profile.picture,
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  return { success: true, user: newUser };
}
