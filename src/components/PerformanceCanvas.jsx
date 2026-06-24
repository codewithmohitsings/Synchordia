import { Camera } from 'lucide-react';

export default function PerformanceCanvas({ hasPermission, videoRef, canvasRef }) {
  return (
    <div className="relative w-full aspect-video max-w-5xl rounded-3xl border border-neutral-800/60 bg-black/40 shadow-2xl overflow-hidden backdrop-blur-sm">
      {hasPermission === false ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-neutral-500">
          <Camera className="w-8 h-8 opacity-50" />
          <p className="font-display text-xs uppercase tracking-[0.3em]">Camera Access Required</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover sepia-[0.15] contrast-[1.1] saturate-[0.6] opacity-70 -scale-x-100"
          />
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 h-full w-full object-cover z-10 pointer-events-none"
          />
        </>
      )}

      <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-neutral-500/30 z-20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-neutral-500/30 z-20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-neutral-500/30 z-20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-neutral-500/30 z-20 pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-20">
        <div className="w-12 h-px bg-amber-500" />
        <div className="absolute h-12 w-px bg-amber-500" />
      </div>
    </div>
  );
}
