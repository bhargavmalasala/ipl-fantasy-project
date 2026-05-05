import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-black flex items-center justify-center z-40">
      <div className="relative w-64 h-40 flex items-center justify-center">
        {/* Pitch line */}
        <div className="absolute bottom-10 w-full h-0.5 bg-cyan-500/20" />

        {/* Ball */}
        <div className="absolute w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee] animate-ball">
  
  {/* Highlight (ADD HERE) */}
  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/40 rounded-full blur-[1px]" />

  {/* Seam */}
  <div className="absolute inset-0 flex items-center justify-center animate-spinFast">
    <div className="w-0.5 h-4 bg-cyan-100 rounded-full" />
  </div>

</div>

        {/* Impact ripple */}
        <div className="absolute bottom-10 w-6 h-6 border border-cyan-400/40 rounded-full animate-ripple" />

        {/* Text */}
        <p className="absolute bottom-0 text-cyan-300 text-xs tracking-widest animate-fade">
          LOADING ...
        </p>
      </div>

      <style>{`
        @keyframes ball {
  /* Fast incoming */
  0% {
    transform: translateX(-120px) translateY(-20px);
  }

  /* Still fast */
  40% {
    transform: translateX(-20px) translateY(0px);
  }

  /* Impact (bounce point) */
  50% {
    transform: translateX(0px) translateY(2px) scale(0.8, 1.2);
  }

  /* Post-bounce (slower + lower height) */
  65% {
    transform: translateX(40px) translateY(-8px) scale(1);
  }

  /* Flatten path (no second bounce) */
  85% {
    transform: translateX(80px) translateY(-4px);
  }

  100% {
    transform: translateX(120px) translateY(-4px);
  }
}
        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ripple {
          0%, 45% {
            opacity: 0;
            transform: scale(0.5);
          }

          /* Trigger exactly at bounce */
          50% {
            opacity: 0.7;
            transform: scale(0.8);
          }

          100% {
            opacity: 0;
            transform: scale(2.5);
          }
        }

        @keyframes fade {
          0%,100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .animate-ball {
          animation: ball 1.8s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
        }

        .animate-spinFast {
          animation: spinFast 0.4s linear infinite;
        }

        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }

        .animate-fade {
          animation: fade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
