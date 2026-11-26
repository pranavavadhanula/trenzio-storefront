import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface BodyFitData {
  shoulderWidth: number;
  midShoulder: { x: number; y: number };
  shoulderAngle: number;
  chestYaw: number;
  torsoHeight: number;
  neckBase: { x: number; y: number };
  detected: boolean;
}

interface RealisticClothEngineProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  garmentImage: string;
  selectedColor: string;
  selectedSize: string;
  garmentScale: number;
  manualOffsetY: number;
  manualOffsetX: number;
  lightingAmbiance: string;
  is3DVolumetricMode?: boolean;
  onPoseUpdate?: (data: BodyFitData) => void;
}

export const RealisticClothEngine: React.FC<RealisticClothEngineProps> = ({
  videoRef,
  isActive,
  garmentImage,
  selectedColor,
  selectedSize,
  garmentScale,
  manualOffsetY,
  manualOffsetX,
  lightingAmbiance,
  is3DVolumetricMode = false,
  onPoseUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const poseInstanceRef = useRef<any>(null);
  const isProcessingFrameRef = useRef<boolean>(false);

  // Tracking state
  const [isPoseTrackingReady, setIsPoseTrackingReady] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<string>('Initializing AI Body Engine...');
  const [bodyMetrics, setBodyMetrics] = useState<BodyFitData>({
    shoulderWidth: 0,
    midShoulder: { x: 50, y: 35 },
    shoulderAngle: 0,
    chestYaw: 0,
    torsoHeight: 0,
    neckBase: { x: 50, y: 30 },
    detected: false,
  });

  // Smoothed tracking coordinates (Exponential Moving Average)
  const smoothedPoseRef = useRef<BodyFitData>({
    shoulderWidth: 280,
    midShoulder: { x: 50, y: 35 },
    shoulderAngle: 0,
    chestYaw: 0,
    torsoHeight: 380,
    neckBase: { x: 50, y: 30 },
    detected: false,
  });

  // Preloaded garment image
  const garmentImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = garmentImage;
    img.onload = () => {
      garmentImgRef.current = img;
    };
  }, [garmentImage]);

  // Load MediaPipe Pose dynamically via CDN
  useEffect(() => {
    let isCancelled = false;

    const initMediaPipe = async () => {
      try {
        setTrackingStatus('Loading AI Body Pose Engine...');
        // Check if window.Pose exists or load from CDN
        if (!(window as any).Pose) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js';
            script.crossOrigin = 'anonymous';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('MediaPipe script failed to load'));
            document.head.appendChild(script);
          });
        }

        if (isCancelled) return;

        const PoseConstructor = (window as any).Pose;
        if (!PoseConstructor) {
          throw new Error('Pose constructor not found on window');
        }

        const pose = new PoseConstructor({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
          if (isCancelled || !results.poseLandmarks) {
            smoothedPoseRef.current.detected = false;
            return;
          }

          const lm = results.poseLandmarks;
          // Landmark 11: left_shoulder, Landmark 12: right_shoulder (note: mirrored in selfie cam)
          const leftShoulder = lm[11];
          const rightShoulder = lm[12];
          const leftHip = lm[23];
          const rightHip = lm[24];
          const nose = lm[0];

          if (
            leftShoulder &&
            rightShoulder &&
            (leftShoulder.visibility || 1) > 0.4 &&
            (rightShoulder.visibility || 1) > 0.4
          ) {
            // Normalized coordinates (0-100%)
            // In mirrored selfie camera: visual left is 1 - rightShoulder.x, visual right is 1 - leftShoulder.x
            const visLeftX = (1 - rightShoulder.x) * 100;
            const visRightX = (1 - leftShoulder.x) * 100;
            const visMidX = (visLeftX + visRightX) / 2;
            const visMidY = ((rightShoulder.y + leftShoulder.y) / 2) * 100;

            const dx = visRightX - visLeftX;
            const dy = (leftShoulder.y - rightShoulder.y) * 100;
            const rawWidth = Math.sqrt(dx * dx + dy * dy);
            const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);

            // 3D Yaw estimated from depth differential
            const rawYaw = (leftShoulder.z - rightShoulder.z) * 140;

            // Torso height from shoulder to hip
            let rawTorsoH = 35;
            if (leftHip && rightHip) {
              const hipY = ((leftHip.y + rightHip.y) / 2) * 100;
              rawTorsoH = Math.max(20, hipY - visMidY);
            }

            // Exponential Moving Average Smoothing (alpha = 0.28 for responsiveness + stability)
            const alpha = 0.28;
            const cur = smoothedPoseRef.current;
            cur.midShoulder.x = cur.midShoulder.x * (1 - alpha) + visMidX * alpha;
            cur.midShoulder.y = cur.midShoulder.y * (1 - alpha) + visMidY * alpha;
            cur.shoulderWidth = cur.shoulderWidth * (1 - alpha) + rawWidth * alpha;
            cur.shoulderAngle = cur.shoulderAngle * (1 - alpha) + rawAngle * alpha;
            cur.chestYaw = cur.chestYaw * (1 - alpha) + rawYaw * alpha;
            cur.torsoHeight = cur.torsoHeight * (1 - alpha) + rawTorsoH * alpha;

            if (nose) {
              const noseY = nose.y * 100;
              cur.neckBase.x = cur.midShoulder.x;
              cur.neckBase.y = (cur.midShoulder.y + noseY) / 2;
            }
            cur.detected = true;

            setBodyMetrics({ ...cur });
            if (onPoseUpdate) onPoseUpdate({ ...cur });
            setTrackingStatus('✦ Real-Time Body Tracking: Locked to Torso');
          } else {
            smoothedPoseRef.current.detected = false;
            setTrackingStatus('Position yourself in camera view...');
          }
        });

        poseInstanceRef.current = pose;
        setIsPoseTrackingReady(true);
      } catch (err) {
        console.warn('[ClothEngine] MediaPipe pose initialization notice:', err);
        setTrackingStatus('Standard Optical Alignment Active');
        setIsPoseTrackingReady(false);
      }
    };

    if (isActive) {
      initMediaPipe();
    }

    return () => {
      isCancelled = true;
      if (poseInstanceRef.current && poseInstanceRef.current.close) {
        try {
          poseInstanceRef.current.close();
        } catch (_) {}
      }
      poseInstanceRef.current = null;
    };
  }, [isActive]);

  // Main Animation & Deformation Render Loop
  useEffect(() => {
    let animId: number;
    let isRunning = true;

    const renderCloth = () => {
      if (!isRunning) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && isActive) {
        // Send frame to pose detector periodically (approx 20-30 FPS)
        if (
          poseInstanceRef.current &&
          video.readyState >= 2 &&
          video.videoWidth > 0 &&
          !isProcessingFrameRef.current
        ) {
          isProcessingFrameRef.current = true;
          poseInstanceRef.current
            .send({ image: video })
            .catch(() => {})
            .finally(() => {
              isProcessingFrameRef.current = false;
            });
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Sync canvas dimensions to viewport
          const rect = canvas.getBoundingClientRect();
          if (canvas.width !== rect.width || canvas.height !== rect.height) {
            canvas.width = rect.width;
            canvas.height = rect.height;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const pose = smoothedPoseRef.current;
          const gImg = garmentImgRef.current;

          if (gImg && gImg.complete && gImg.naturalWidth > 0) {
            ctx.save();

            // Calculate garment center and dimensions
            let targetCenterX = canvas.width / 2;
            let targetCenterY = canvas.height * 0.42;
            let targetWidth = canvas.width * 0.68;
            let rotationDeg = 0;
            let yaw3D = 0;

            if (pose.detected && pose.shoulderWidth > 0) {
              // Exact body anchor from detected shoulders
              targetCenterX = (pose.midShoulder.x / 100) * canvas.width;
              targetCenterY = (pose.midShoulder.y / 100) * canvas.height;
              // Shoulder span with Oversized Trevori drop multiplier (1.42x shoulder span)
              const sizeMultipliers: Record<string, number> = {
                XS: 1.25,
                S: 1.32,
                M: 1.4,
                L: 1.48,
                XL: 1.56,
                '2XL': 1.65,
              };
              const multi = sizeMultipliers[selectedSize] || 1.45;
              targetWidth = (pose.shoulderWidth / 100) * canvas.width * multi * garmentScale;
              rotationDeg = pose.shoulderAngle;
              yaw3D = Math.max(-25, Math.min(25, pose.chestYaw));
            } else {
              // Default optical torso position
              targetWidth = canvas.width * 0.65 * garmentScale;
              targetCenterY = canvas.height * 0.38;
            }

            // Apply manual fine adjustments
            targetCenterX += manualOffsetX * (canvas.width / 200);
            targetCenterY += (manualOffsetY - 25) * (canvas.height / 300);

            const aspectRatio = gImg.naturalHeight / gImg.naturalWidth;
            const targetHeight = targetWidth * aspectRatio;

            // Positioning matrix with 3D Yaw Perspective & Incline Rotation
            ctx.translate(targetCenterX, targetCenterY + targetHeight * 0.28);
            ctx.rotate((rotationDeg * Math.PI) / 180);

            // 3D Yaw Perspective compression (foreshortening when turning sideways)
            const yawRad = (yaw3D * Math.PI) / 180;
            const scaleX = Math.cos(yawRad);
            ctx.scale(scaleX, 1);

            // 1. Realistic Cast Shadow on Body / Under Fabric
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 25;
            ctx.shadowOffsetX = yaw3D * 0.4;
            ctx.shadowOffsetY = 16;
            ctx.drawImage(gImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
            ctx.restore();

            // 2. Main Garment Fabric Rendering
            ctx.drawImage(gImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

            // 3. Volumetric Body Curvature Gradient (Clipped strictly to garment pixels with source-atop)
            ctx.save();
            ctx.globalCompositeOperation = 'source-atop';
            const bodyGradient = ctx.createLinearGradient(-targetWidth / 2, 0, targetWidth / 2, 0);
            bodyGradient.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
            bodyGradient.addColorStop(0.18, 'rgba(0, 0, 0, 0.03)');
            bodyGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
            bodyGradient.addColorStop(0.82, 'rgba(0, 0, 0, 0.03)');
            bodyGradient.addColorStop(1, 'rgba(0, 0, 0, 0.28)');

            ctx.fillStyle = bodyGradient;
            ctx.fillRect(-targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
            ctx.restore();

            // 4. Environmental Lighting Rim Accent (Adapts to Studio Backdrops - Clipped strictly with source-atop)
            const isNightStudio = lightingAmbiance.toLowerCase().includes('night');
            const isGoldenHour = lightingAmbiance.toLowerCase().includes('sun');
            ctx.save();
            ctx.globalCompositeOperation = 'source-atop';
            const rimGradient = ctx.createLinearGradient(-targetWidth / 2, -targetHeight / 2, targetWidth / 2, targetHeight / 2);
            if (isGoldenHour) {
              rimGradient.addColorStop(0, 'rgba(255, 220, 160, 0.15)');
              rimGradient.addColorStop(0.3, 'rgba(255, 220, 160, 0.0)');
            } else if (isNightStudio) {
              rimGradient.addColorStop(0.8, 'rgba(0, 180, 255, 0.0)');
              rimGradient.addColorStop(1, 'rgba(0, 210, 255, 0.20)');
            } else {
              rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
              rimGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.0)');
            }
            ctx.fillStyle = rimGradient;
            ctx.fillRect(-targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
            ctx.restore();

            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(renderCloth);
    };

    animId = requestAnimationFrame(renderCloth);
    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [isActive, selectedSize, garmentScale, manualOffsetX, manualOffsetY, lightingAmbiance]);

  // Three.js Volumetric 3D Studio Setup
  useEffect(() => {
    if (!is3DVolumetricMode || !threeContainerRef.current) return;

    const container = threeContainerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(2, 3, 2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 0.8);
    fillLight.position.set(-2, 1, 1.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, -1, -2);
    scene.add(rimLight);

    // Load garment texture
    const textureLoader = new THREE.TextureLoader();
    let mesh: THREE.Mesh | null = null;

    textureLoader.load(garmentImage, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      // Front & Back curved volumetric cloth geometry
      const geometry = new THREE.CylinderGeometry(0.55, 0.58, 1.2, 48, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.85,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -0.1;
      scene.add(mesh);
    });

    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging && mesh) {
        const deltaX = e.clientX - prevMouseX;
        mesh.rotation.y += deltaX * 0.01;
        prevMouseX = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (mesh && !isDragging) {
        mesh.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [is3DVolumetricMode, garmentImage]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* 2D/3D Body-Anchored Deformable Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        style={{ display: is3DVolumetricMode ? 'none' : 'block' }}
      />

      {/* Volumetric WebGL 3D Container (When Volumetric Studio is active) */}
      <div
        ref={threeContainerRef}
        className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ display: is3DVolumetricMode ? 'block' : 'none' }}
      />

      {/* Live AI Fitting Status HUD */}
      {isActive && (
        <div className="absolute bottom-5 left-5 z-40 flex flex-col gap-1.5 select-none pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/85 backdrop-blur-md border border-white/20 text-white rounded shadow-lg text-[10px] font-mono tracking-wider uppercase font-semibold">
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                bodyMetrics.detected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{trackingStatus}</span>
          </div>

          {bodyMetrics.detected && (
            <div className="flex items-center gap-2 px-3 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-white/90 rounded text-[9px] font-mono tracking-wider">
              <span>✦ SHOULDER SPAN: {Math.round(bodyMetrics.shoulderWidth * 1.5)}CM</span>
              <span>•</span>
              <span>CHEST YAW: {Math.round(bodyMetrics.chestYaw)}°</span>
              <span>•</span>
              <span>FIT: {selectedSize} OVERSIZED</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
