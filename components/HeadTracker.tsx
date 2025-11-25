import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { HeadPosition, TrackerStatus } from '../types';

interface HeadTrackerProps {
  onUpdate: (pos: HeadPosition) => void;
}

export const HeadTracker: React.FC<HeadTrackerProps> = ({ onUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<TrackerStatus>({
    isReady: false,
    isDetecting: false,
    error: null,
  });

  const lastVideoTime = useRef<number>(-1);
  const requestRef = useRef<number>(0);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    const initTracker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        setStatus(s => ({ ...s, isReady: true }));
        startWebcam();
      } catch (err: any) {
        setStatus(s => ({ ...s, error: `Failed to load AI model: ${err.message}` }));
      }
    };

    initTracker();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      }
    } catch (err: any) {
      setStatus(s => ({ ...s, error: `Camera access denied: ${err.message}` }));
    }
  };

  const predictWebcam = () => {
    if (!faceLandmarkerRef.current || !videoRef.current) return;
    
    // Process frames
    const nowInMs = Date.now();
    if (videoRef.current.currentTime !== lastVideoTime.current) {
      lastVideoTime.current = videoRef.current.currentTime;
      const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        // Landmark 1 is usually the nose tip
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        // Calculate rough center
        const centerX = (leftEye.x + rightEye.x) / 2;
        const centerY = (leftEye.y + rightEye.y) / 2;

        // Transform to -1 to 1 range
        // Note: Webcam x is mirrored usually, so we flip X.
        // MediaPipe x: 0 (left) -> 1 (right). 
        // We want -1 (left) -> 1 (right).
        const x = (centerX - 0.5) * 2 * -1; // Flip X for mirror effect
        const y = (centerY - 0.5) * 2 * -1; // Flip Y because 3D Y is up, screen Y is down

        // Z estimation (scale/distance)
        const eyeDist = Math.sqrt(
          Math.pow(rightEye.x - leftEye.x, 2) + 
          Math.pow(rightEye.y - leftEye.y, 2)
        );
        // Base distance factor
        const z = Math.min(Math.max((0.15 / eyeDist) - 1, 0), 2);

        setStatus(s => ({...s, isDetecting: true}));
        onUpdate({ x, y, z });
      } else {
        setStatus(s => ({...s, isDetecting: false}));
        // Optional: Reset to center if lost face? Or keep last known.
        // Keeping last known is usually better for glitches.
      }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-xs w-64 shadow-2xl transition-all hover:bg-black/70">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-emerald-400 uppercase tracking-wider">Tracker Debug</h3>
        <div className={`w-2 h-2 rounded-full ${status.isDetecting ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      </div>
      
      {status.error ? (
        <div className="text-red-400 mb-2">{status.error}</div>
      ) : (
        <div className="space-y-1 text-gray-300">
           <p>1. Allow Camera Access</p>
           <p>2. Center your head</p>
           <p>3. Move head to look around</p>
        </div>
      )}

      {/* Hidden Video for processing */}
      <div className="relative mt-2 w-full aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/5 opacity-50">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100" // Mirror for visual feedback
          />
           {!status.isReady && (
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs text-gray-400">Loading AI...</span>
             </div>
           )}
      </div>
    </div>
  );
};
