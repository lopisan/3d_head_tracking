import React, { useRef, useCallback, useState } from 'react';
import { HeadTracker } from './components/HeadTracker';
import { Scene3D } from './components/Scene3D';
import { HeadPosition } from './types';

function App() {
  // We use a Ref for head position to avoid re-rendering the entire Scene tree
  // on every frame update from the webcam. The Scene reads this ref in its animation loop.
  const headPosRef = useRef<HeadPosition>({ x: 0, y: 0, z: 0 });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [enableDepth, setEnableDepth] = useState(true); // Enabled by default now

  const handleHeadUpdate = useCallback((pos: HeadPosition) => {
    headPosRef.current = pos;
  }, []);

  const startExperience = () => {
    setPermissionGranted(true);
    setShowInstructions(false);
  };

  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden text-white font-sans">
      
      {/* Intro Overlay */}
      {!permissionGranted && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-8 text-center">
          <div className="max-w-2xl animate-[fadeInUp_0.8s_ease-out_forwards]">
            <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              Cozy Cottage 3D
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Step into a snowy winter cottage.
              <br />
              This experiment uses your webcam to track your head movement, creating a realistic window hologram.
            </p>
            
            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 mb-8 text-left inline-block">
              <h3 className="font-bold text-lg mb-2 text-emerald-400">Privacy Notice</h3>
              <p className="text-sm text-gray-400">
                • Camera data is processed locally on your device.<br/>
                • No video is sent to any server.<br/>
                • Camera access is required for the 3D effect.
              </p>
            </div>

            <br />

            <button 
              onClick={startExperience}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/50"
            >
              Enable Camera & Enter
            </button>
          </div>
        </div>
      )}

      {/* Main Experience */}
      {permissionGranted && (
        <>
          <HeadTracker onUpdate={handleHeadUpdate} />
          <Scene3D headPosRef={headPosRef} enableDepth={enableDepth} />
          
          {/* Controls UI */}
          <div className="absolute bottom-6 right-6 z-50 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col gap-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={enableDepth}
                  onChange={(e) => setEnableDepth(e.target.checked)}
                />
                <div className="w-10 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Enable Depth Tracking (Zoom)
              </span>
            </label>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
              Move your head closer to look inside.
            </p>
          </div>
          
          {/* Overlay Instructions (Fades out) */}
          {showInstructions && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 text-center opacity-0 animate-[fadeInOut_4s_ease-in-out_forwards]">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">Welcome Home</h2>
              <p className="text-xl text-white/80 mt-2">Look around...</p>
            </div>
          )}
          
          {/* Footer branding/controls */}
          <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
            <p className="text-white/30 text-xs tracking-widest">REAL-TIME HEAD TRACKING POWERED BY MEDIAPIPE & THREE.JS</p>
          </div>
        </>
      )}
      
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -40%); }
          20% { opacity: 1; transform: translate(-50%, -50%); }
          80% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -60%); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;