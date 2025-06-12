import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { KanaItem, KanaType } from "@/types/kana-types";

// Types


interface KanaSelectorProps {
  kanaType: KanaType;
  setKanaType: (type: KanaType) => void;
  kanaGroupedByRow: Record<string, KanaItem[]>;
  chosenRows: Record<string, boolean>;
  toggleRow: (row: string) => void;
  checkAll: () => void;
  startGame: () => void;
}

const KanaSelector: React.FC<KanaSelectorProps> = ({
  kanaType,
  setKanaType,
  kanaGroupedByRow,
  chosenRows,
  toggleRow,
  checkAll,
  startGame,
}) => {
  return (
    <>
      {/* Choose kana type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center mb-4"
      >
        <h1 className="text-white text-center text-2xl font-semibold mb-2">
          Choose Kana to Study
        </h1>
        <div className="flex gap-10">
          <Button
            onClick={() => setKanaType("hiragana")}
            variant={kanaType === "hiragana" ? "default" : "secondary"}
          >
            Hiragana
          </Button>
          <Button
            onClick={() => setKanaType("katakana")}
            variant={kanaType === "katakana" ? "default" : "secondary"}
          >
            Katakana
          </Button>
        </div>
      </motion.div>

      {/* Kana Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/20 backdrop-blur shadow-lg rounded-xl p-8 max-w-lg w-full text-center"
      >
        <div className="w-full space-y-6 grid grid-cols-5 gap-x-4">
          {Object.entries(kanaGroupedByRow).map(([row, kanaInRow]) => {
            const numCols = Math.ceil(kanaInRow.length / 5);
            const isActive = chosenRows[row] ?? false;

            return (
              <div key={row} className="flex flex-col items-center">
                <Button
                  className="mb-2 w-full"
                  variant={isActive ? "default" : "secondary"}
                  onClick={() => toggleRow(row)}
                >
                  {row.toUpperCase()}
                </Button>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateRows: "repeat(5, minmax(0, 1fr))",
                    gridTemplateColumns: `repeat(${numCols}, auto)`,
                  }}
                >
                  {kanaInRow.map((kana) => (
                    <div key={kana.kana} className="text-center">
                      {kana.kana}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button onClick={checkAll} variant="secondary">
            Check All
          </Button>
          <Button onClick={startGame} variant="secondary">
            Study
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default KanaSelector;