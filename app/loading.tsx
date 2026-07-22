'use client';

export default function Loading() {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-ivory/80 backdrop-blur-sm z-50"
      aria-hidden="true"
      suppressHydrationWarning={true}
    >
      <div className="flex flex-col items-center gap-4" suppressHydrationWarning={true}>
        {/* Golden Circular Spinner */}
        <div 
          className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" 
          suppressHydrationWarning={true}
        />
        {/* Pulsing Studio Label */}
        <span 
          className="font-hindi text-[10px] tracking-wide text-charcoal/50 animate-pulse mt-1"
          suppressHydrationWarning={true}
        >
          सुरम्या
        </span>
      </div>
    </div>
  );
}
