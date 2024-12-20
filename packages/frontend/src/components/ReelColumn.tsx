import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { SYMBOL_SPACING } from "./Reel";

interface ReelColumnProps {
  reelSymbols: string[];
  animationKeyframes: number[];
  times: number[];
  duration: number;
  symbolHeight: number;
  onSymbolHeightChange: (height: number) => void;
}

export const ReelColumn: React.FC<ReelColumnProps> = ({
  reelSymbols,
  animationKeyframes,
  times,
  duration,
  symbolHeight,
  onSymbolHeightChange,
}) => {
  const symbolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      if (symbolRef.current) {
        const symbolHeight = symbolRef.current.getBoundingClientRect().height;
        onSymbolHeightChange(symbolHeight);
      }
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <div ref={symbolRef} className="w-full h-full">
      <motion.div
        animate={{ y: animationKeyframes }}
        transition={{
          type: "linear",
          times,
          duration,
        }}
      >
        {reelSymbols.map((symbol, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center rounded-[16px] bg-[#bd90dc] bg-cover"
            style={{
              width: "100%",
              height: symbolHeight,
              marginBottom: SYMBOL_SPACING,
              backgroundImage: "url('src/assets/slot-reel-bg.png')",
            }}
          >
            <img src={`src/assets/reel/${symbol}.png`} className="w-[75%] aspect-square" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
