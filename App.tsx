/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Download, Share2, Info, CheckCircle2, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface ArtisanBranding {
  name: string;
  woodType: string;
  price: string;
}

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

// --- Components ---

export default function App() {
  const [step, setStep] = useState<'home' | 'camera' | 'review' | 'gallery'>('home');
  const [branding, setBranding] = useState<ArtisanBranding>({ name: '', woodType: '', price: '' });
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [gallery, setGallery] = useState<CapturedPhoto[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when not in camera step
  useEffect(() => {
    if (step !== 'camera') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraReady(false);
    }
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', aspectRatio: { ideal: 3/4 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraReady(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the camera frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // --- Apply Brand Overlay (The "Shilpa-Kala" Logic) ---
    
    // 1. Heritage Label Background
    const labelPad = 20;
    const labelWidth = canvas.width * 0.4;
    const labelHeight = 80;
    const labelX = 30;
    const labelY = 30;

    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.roundRect?.(labelX, labelY, labelWidth, labelHeight, 8);
    context.fill();

    // 2. Logos/Text (Simulation of "Handmade in Karnataka")
    context.fillStyle = '#3d2616'; // Sandalwood
    context.font = 'bold 24px "Cormorant Garamond", serif';
    context.fillText('Handmade in Karnataka', labelX + 15, labelY + 35);
    context.font = '16px "Montserrat", sans-serif';
    context.fillText('Heritage Artisan Guild', labelX + 15, labelY + 60);

    // 3. Price Tag (Bottom Right)
    const tagWidth = 250;
    const tagHeight = 100;
    const tagX = canvas.width - tagWidth - 30;
    const tagY = canvas.height - tagHeight - 30;

    context.fillStyle = 'rgba(61, 38, 22, 0.95)'; // Deep Sandalwood
    context.roundRect?.(tagX, tagY, tagWidth, tagHeight, 12);
    context.fill();

    context.fillStyle = '#c5a059'; // Gold
    context.font = '300 20px "Montserrat", sans-serif';
    context.fillText(branding.name || 'Artisan Work', tagX + 20, tagY + 35);
    context.fillStyle = '#FFFFFF';
    context.font = '14px "Montserrat", sans-serif';
    context.fillText(branding.woodType || 'Natural Wood', tagX + 20, tagY + 60);
    context.fillStyle = '#c5a059'; // Gold
    context.font = 'bold 24px "Montserrat", sans-serif';
    context.fillText(`₹${branding.price || '0'}`, tagX + 20, tagY + 85);

    setCapturedPhoto(canvas.toDataURL('image/jpeg'));
    setStep('review');
  }, [branding]);

  const saveToGallery = () => {
    if (capturedPhoto) {
      setGallery(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        dataUrl: capturedPhoto,
        timestamp: Date.now()
      }, ...prev]);
    }
    setStep('gallery');
  };

  return (
    <div className="min-h-screen bg-parchment text-sandalwood font-sans selection:bg-gold selection:text-white overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* --- STEP: HOME --- */}
        {step === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center relative"
          >
            {/* Background Decorative Element */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border-[1px] border-sandalwood rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square border-[1px] border-sandalwood rounded-full" />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-32 bg-sandalwood rounded-full flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay" />
              <Camera className="text-gold w-10 h-10" />
            </motion.div>
            
            <h1 className="text-5xl font-light mb-2 tracking-tighter font-serif">Shilpa-Kala</h1>
            <div className="w-12 h-[1px] bg-gold mb-6" />
            <p className="text-sm uppercase tracking-[0.3em] text-gold font-medium mb-12 max-w-xs">
              Digital Portfolio Assistant
            </p>
            
            <div className="w-full max-w-md space-y-4">
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-gold/20 shadow-sm space-y-4 mb-8 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sandalwood/40 mb-2">Artisan Specifications</p>
                <div className="space-y-4">
                  <div className="group">
                    <input 
                      type="text" 
                      placeholder="Name"
                      className="w-full py-3 bg-transparent border-b border-sandalwood/10 focus:border-gold outline-none transition-all placeholder:text-sandalwood/20"
                      value={branding.name}
                      onChange={e => setBranding({...branding, name: e.target.value})}
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Material"
                    className="w-full py-3 bg-transparent border-b border-sandalwood/10 focus:border-gold outline-none transition-all placeholder:text-sandalwood/20"
                    value={branding.woodType}
                    onChange={e => setBranding({...branding, woodType: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Price"
                    className="w-full py-3 bg-transparent border-b border-sandalwood/10 focus:border-gold outline-none transition-all placeholder:text-sandalwood/20"
                    value={branding.price}
                    onChange={e => setBranding({...branding, price: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={() => { setStep('camera'); startCamera(); }}
                className="w-full bg-sandalwood py-5 rounded-full text-gold font-semibold text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[#2d1b10] active:scale-95 transition-all flex items-center justify-center gap-3 border border-gold/20"
              >
                Begin Capture
                <ChevronRight size={16} />
              </button>
              
              <button 
                onClick={() => setStep('gallery')}
                className="w-full py-5 rounded-full text-sandalwood font-semibold text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <ImageIcon size={16} className="text-gold" />
                Gallery
              </button>
            </div>
          </motion.div>
        )}

        {/* --- STEP: CAMERA --- */}
        {step === 'camera' && (
          <motion.div 
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col"
          >
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
              <button onClick={() => setStep('home')} className="text-white/50 hover:text-white p-2">
                <X size={24} />
              </button>
              <div className="flex items-center gap-2 text-gold/80 bg-sandalwood/80 px-5 py-2 rounded-full border border-gold/20 backdrop-blur-xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Guided Perspective</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Camera Viewport */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-90 shadow-inner"
              />
              
              {/* Guided Overlay Shell */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="w-full aspect-[3/4] border border-gold/20 relative">
                  {/* Decorative High-End Guides */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gold/10" />
                  <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gold/10" />
                  
                  {/* Golden Corners */}
                  <div className="absolute -top-[2px] -left-[2px] w-12 h-12 border-t-2 border-l-2 border-gold" />
                  <div className="absolute -top-[2px] -right-[2px] w-12 h-12 border-t-2 border-r-2 border-gold" />
                  <div className="absolute -bottom-[2px] -left-[2px] w-12 h-12 border-b-2 border-l-2 border-gold" />
                  <div className="absolute -bottom-[2px] -right-[2px] w-12 h-12 border-b-2 border-r-2 border-gold" />

                  {/* Aesthetic Label */}
                  <div className="absolute -bottom-8 left-0 right-0 text-center">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-gold/60 font-bold">Center Subject in Frame</span>
                  </div>
                </div>
              </div>

              {cameraError && (
                <div className="p-10 text-center text-gold bg-sandalwood/90 backdrop-blur-2xl rounded-[3rem] mx-8 border border-gold/30">
                  <p className="text-sm font-medium">{cameraError}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-[#0a0a0a] p-12 flex items-center justify-around z-20 border-t border-white/5">
              <div className="w-14" />
              <button 
                onClick={capturePhoto}
                disabled={!isCameraReady}
                className={`group relative flex items-center justify-center transition-all ${isCameraReady ? 'opacity-100 active:scale-95' : 'opacity-20'}`}
              >
                <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center p-2 group-hover:border-gold transition-colors">
                  <div className="w-full h-full bg-gold rounded-full" />
                </div>
              </button>
              <button 
                onClick={() => setStep('home')}
                className="text-gold/40 hover:text-gold p-4 transition-colors"
                title="Restart"
              >
                <RefreshCw size={24} />
              </button>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}

        {/* --- STEP: REVIEW --- */}
        {step === 'review' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-[#0a0a0a]"
          >
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="max-w-md w-full relative">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 25 }}
                  src={capturedPhoto || ''} 
                  alt="Captured" 
                  className="w-full rounded-[2.5rem] shadow-[0_0_100px_rgba(197,160,89,0.1)] border border-gold/20"
                />
                <div className="absolute top-6 left-6 bg-sandalwood/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-gold/30">
                  <span className="text-[9px] text-gold uppercase font-bold tracking-[0.2em]">Master Quality</span>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="bg-parchment p-10 pb-12 rounded-t-[3.5rem] shadow-2xl border-t border-gold/30"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light font-serif mb-1 italic">Heritage Branding Applied</h3>
                <div className="w-8 h-[1px] bg-gold mx-auto opacity-50" />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('camera')}
                  className="flex-1 py-5 rounded-full border border-sandalwood/10 text-[10px] uppercase tracking-[0.2em] font-bold text-sandalwood/60 hover:border-gold/50 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  onClick={saveToGallery}
                  className="flex-[2] bg-sandalwood py-5 rounded-full text-gold font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:shadow-gold/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Finalize & Save
                  <Download size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- STEP: GALLERY --- */}
        {step === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-light font-serif tracking-tight">Portfolio</h2>
                <div className="w-8 h-[1px] bg-gold mt-2" />
              </div>
              <button 
                onClick={() => setStep('home')}
                className="p-3 bg-white border border-gold/10 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <X size={20} className="text-sandalwood/50" />
              </button>
            </div>

            {gallery.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-[-10vh]">
                <div className="w-20 h-20 border border-gold/30 rounded-full flex items-center justify-center mb-6">
                  <ImageIcon size={32} className="text-sandalwood" />
                </div>
                <p className="text-sm uppercase tracking-widest font-medium">Your collection is empty</p>
                <button onClick={() => setStep('camera')} className="mt-4 text-gold border-b border-gold/30 pb-1 text-xs font-bold transition-all hover:tracking-normal tracking-[0.1em]">Begin your legacy</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-32">
                <AnimatePresence>
                  {gallery.map((photo) => (
                    <motion.div 
                      key={photo.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm border border-white"
                    >
                      <img 
                        src={photo.dataUrl} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="Product"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-sandalwood/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button className="w-full py-2 bg-gold text-sandalwood rounded-full text-[8px] font-bold uppercase tracking-widest shadow-xl">
                          View Asset
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="fixed bottom-10 left-10 right-10 flex justify-center">
              <button 
                onClick={() => setStep('camera')}
                className="px-10 py-5 bg-sandalwood rounded-full text-gold font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 transition-all active:scale-95"
              >
                <Camera size={14} />
                New Collection Piece
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <style>{`
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}
