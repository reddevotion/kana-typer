import hiragana from "@/data/hiragana.json";
import katakana from "@/data/katakana.json";

type KanaType = "hiragana" | "katakana";

interface KanaEntry {
  kana: string;
  romaji: string;
  type: string;
  row: string;
  audio: string;
  example: string;
}

export function getKanaFromSelection(
  type: KanaType,
  selectedRows: string[]
): KanaEntry[] {
  const data = type === "hiragana" ? hiragana : katakana;

  return data.filter((entry) => selectedRows.includes(entry.row));
}