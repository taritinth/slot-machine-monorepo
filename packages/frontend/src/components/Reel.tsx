import React, { useState, useCallback } from "react";
import { ReelColumn } from "./ReelColumn";

export const SYMBOLS = ["chog", "molago", "molandak", "mouch", "moyaki", "ss-kahve-motato", "vikinghat"];
export const SYMBOL_SPACING = 18; // Changed to relative units
export const TIME_PER_SYMBOL = 0.075;

const generateReelSymbols = (
  baseSymbols: string[],
  duplicateCount: number,
  targetSymbol: string,
  startSymbol = "empty"
): string[] => {
  return [targetSymbol, ...Array(duplicateCount).fill(baseSymbols).flat(), startSymbol];
};

const calculateDuplicateCount = (duration: number): number =>
  Math.floor(duration / TIME_PER_SYMBOL / SYMBOLS.length);

export const Reel: React.FC = () => {
  const [symbolHeight, setSymbolHeight] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const reels = [
    generateReelSymbols(SYMBOLS, calculateDuplicateCount(1), "molago"),
    generateReelSymbols(SYMBOLS, calculateDuplicateCount(1.75), "molago"),
    generateReelSymbols(SYMBOLS, calculateDuplicateCount(2.5), "mouch"),
  ];

  const handleSpin = useCallback(() => setSpinning(!spinning), [spinning]);

  console.log("symbolHeight", symbolHeight);

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-purple-900 to-purple-700 min-h-screen">
      <div className="w-full min-w-[300px] max-w-[600px]">
        <div
          className="mt-6 relative w-full aspect-[600/339] bg-cover"
          style={{ backgroundImage: "url('src/assets/slot-main-bg.png')" }}
        >
          <img
            src="src/assets/slot-props-top-left.png"
            className="absolute top-[-5%] left-[-0.5%] w-[40%] aspect-[250/43.64]"
          />
          <img
            src="src/assets/slot-props-top-right.png"
            className="absolute top-[-2.5%] right-[-0.5%] w-[15%] aspect-[90/34.41]"
          />
          <div className="flex justify-center items-center h-full p-[6%]">
            <div className="relative flex justify-center items-center h-full w-full py-[3%] bg-[#513569] overflow-hidden" style={{
              paddingInline: "5%",
              gap: "5%",
            }}>
              <div className="absolute top-0 w-full h-[25%] bg-gradient-to-b from-[#513569] to-transparent z-10"></div>
              <div className="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-[#513569] to-transparent z-10"></div>

              {reels.map((reelSymbols, index) => {
                const totalDistance = ((reelSymbols.length - 1) * symbolHeight) + (SYMBOL_SPACING * (reelSymbols.length - 1));
                const times = [0, 0.95, 1];
                const keyframes = spinning ? [-totalDistance, 5, 0] : [0, -totalDistance];
                const duration = reelSymbols.length * TIME_PER_SYMBOL;

                return (
                  <ReelColumn
                    key={index}
                    reelSymbols={reelSymbols}
                    animationKeyframes={keyframes}
                    times={times}
                    duration={duration}
                    symbolHeight={symbolHeight}
                    onSymbolHeightChange={setSymbolHeight}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSpin}
        className="mt-4 px-8 py-3 text-lg font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-400 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95"
      >
        {spinning ? "Reset" : "Spin"}
      </button>
    </div>
  );
};
