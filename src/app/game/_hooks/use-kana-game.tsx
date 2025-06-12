"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import hiragana from "@/data/hiragana.json";
import katakana from "@/data/katakana.json";

type KanaType = "hiragana" | "katakana";

type GameStat = {
  timestamp: number;
  score: number;
  total: number;
  time: number;
  kanaType: KanaType;
  selectedRows: string[];
};

export function useKanaTyper() {
    const [kanaType, setKanaType] = useState<KanaType>("hiragana");
    const kanaList = kanaType === "hiragana" ? hiragana : katakana;
    const [kanaQueue, setKanaQueue] = useState<typeof kanaList>([]);
    const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [stats, setStats] = useState<GameStat[]>([]);
    const [chosenRows, setChosenRows] = useState<Record<string, boolean>>({});
    const [revealedAnswer, setRevealedAnswer] = useState("");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState(0);
    const [soundOn, setSoundOn] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const kanaGroupedByRow = useMemo(() => {
        return kanaList.reduce((acc, kana) => {
            if (kana.type === "yoon" || kana.type === "extended" || !kana.row) return acc;
            if (!acc[kana.row]) acc[kana.row] = [];
            acc[kana.row].push(kana);
            return acc;
        }, {} as Record<string, typeof kanaList>);
    }, [kanaList]);

    const selectedRowLabels = Object.entries(chosenRows)
        .filter(([_, selected]) => selected)
        .map(([row]) => row.toUpperCase());


    const updateStats = (finalScore: number, total: number, time: number) => {
        const newStat: GameStat = {
            timestamp: Date.now(),
            score: finalScore,
            total,
            time,
            kanaType,
            selectedRows: selectedRowLabels,
        };
        const existingStats = JSON.parse(localStorage.getItem("kanaStats") || "[]");
        const updatedStats = [...existingStats, newStat];
        localStorage.setItem("kanaStats", JSON.stringify(updatedStats));
        setStats(updatedStats);
    };

    const toggleRow = (row: string) => {
        setChosenRows((prev) => ({
        ...prev,
        [row]: !prev[row],
        }));
    };

    const checkAll = () => {
        const allChecked: Record<string, boolean> = {};
        Object.keys(kanaGroupedByRow).forEach((row) => {
        allChecked[row] = true;
        });
        setChosenRows(allChecked);
    };

    const startGame = () => {
        const selectedKana = Object.entries(chosenRows)
            .filter(([_, isChecked]) => isChecked)
            .flatMap(([row]) => kanaGroupedByRow[row] || []);

        if (selectedKana.length === 0) {
        alert("Please select at least one row.");
        return;
        }

        // Shuffle
        const shuffled = [...selectedKana].sort(() => Math.random() - 0.5);
        setKanaQueue(shuffled);
        setElapsedTime(0);
        setTimerActive(true);
        setShowGameOver(false);
        setCurrentIndex(0);
        setUserInput("");
        setScore(0);
        setIsPlaying(true);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase();
        setUserInput(value);

        const current = kanaQueue[currentIndex];
        const correctAnswer = current.romaji.toLowerCase();

        // Easier to type aliases
        const acceptedAnswers = [correctAnswer];
        if (correctAnswer === "tsu") {
            acceptedAnswers.push("tu");
        } else if (correctAnswer === "shi") {
            acceptedAnswers.push("si");
        } else if (correctAnswer === "chi") {
            acceptedAnswers.push("ti");
        } else if (correctAnswer === "fu") {
            acceptedAnswers.push("hu");
        }

        if (acceptedAnswers.includes(value) || current.kana === value) {
            setIsCorrect(true);
            if (!hasFailed) {
                setScore((s) => s + 1);
            }
            setUserInput("");

            if (soundOn && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }

            if (currentIndex + 1 < kanaQueue.length) {
                setCurrentIndex((i) => i + 1);
                setIsCorrect(null);
                setHasFailed(false);
            } else {
                setIsPlaying(false);
                setShowGameOver(true);
                setIsPlaying(false);
                setTimerActive(false);
                setShowGameOver(true);
                updateStats(score + 1, kanaQueue.length, elapsedTime);
                }
        } else if (value.length >= correctAnswer.length) {
            setIsCorrect(false);
            setHasFailed(true);
            setUserInput("");
        } else {
            setIsCorrect(null);
        }
    };

    // Handle Answer Reveal
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (showAnswer) {
            // If answer already shown, do nothing on Enter
            return;
            }

            const current = kanaQueue[currentIndex];
            const correctAnswer = current.romaji.toLowerCase();

            setRevealedAnswer(correctAnswer);
            setHasFailed(true)
            setShowAnswer(true);

            if (soundOn && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            }
        }
    };

    const handleReset = () => {
        // Reset game
        setIsPlaying(false);
        setShowGameOver(false);
        setKanaQueue([]);
        setCurrentIndex(0);
        setUserInput("");
        setScore(0);
        setIsCorrect(null);
        setElapsedTime(0);
        setTimerActive(false);
        setRevealedAnswer("");
        setShowAnswer(false);

        // Refresh stats from localStorage
        const saved = JSON.parse(localStorage.getItem("kanaStats") || "[]");
        setStats(saved);
    };

    // Reset on kana change
    useEffect(() => {
        setShowAnswer(false);
        setRevealedAnswer("");
        setUserInput("");
        setIsCorrect(null);
        setHasFailed(false);
    }, [currentIndex]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("kanaStats") || "[]");
        setStats(saved);
    }, []);

    useEffect(() => {
        const initialState: Record<string, boolean> = {};
        Object.keys(kanaGroupedByRow).forEach((row) => {
            initialState[row] = false;
        });
        setChosenRows(initialState);
    }, [kanaGroupedByRow]);

    // Timer
    useEffect(() => {
        if (!timerActive || !isPlaying) return;

        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive, isPlaying]);

    return {
        kanaType,
        setKanaType,
        kanaGroupedByRow,
        kanaQueue,
        isCorrect,
        audioRef,
        statsModalVisible,
        setStatsModalVisible,
        stats,
        updateStats,
        toggleRow,
        checkAll,
        handleReset,
        isPlaying,
        showGameOver,
        chosenRows,
        startGame,
        soundOn,
        setSoundOn,
        handleInput,
        handleKeyDown,
        showAnswer,
        revealedAnswer,
        score,
        elapsedTime,
        selectedRowLabels,
        currentIndex,
        userInput
    };

}