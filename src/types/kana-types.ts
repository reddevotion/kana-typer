export type KanaType = "hiragana" | "katakana";

export interface KanaItem {
  kana: string;
  romaji: string;
  type: string;
  row?: string;
}