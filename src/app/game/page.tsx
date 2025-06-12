"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import StatsModal from "@/app/game/_components/stats-modal";
import { useKanaTyper } from "./_hooks/use-kana-game";
import KanaSelector from "./_components/kana-selector";
import GameScreen from "./_components/game-screen";



const correctSoundSrc = "/sounds/correct.mp3";

const KanaTyper = () => {
    const {
        kanaType,
        setKanaType, 
        kanaGroupedByRow, 
        kanaQueue,
        isCorrect,
        audioRef, 
        statsModalVisible, 
        setStatsModalVisible, 
        stats,
        handleReset,
        isPlaying,
        showGameOver,
        chosenRows,
        toggleRow,
        checkAll,
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
    } = useKanaTyper()

    const inputRef = useRef<HTMLInputElement>(null);    
    
    
    
    // Autofocus on input
    useEffect(() => {
        if (isPlaying && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isPlaying, currentIndex]);


    return (
        <main
        className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative"
        style={{ backgroundImage: "url(/images/bg.jpg)" }}
        >
            {isPlaying  && (
                // Reset button
                <div className="w-full mt-4 mb-6 flex justify-start max-w-lg">
                    <Button
                    onClick={handleReset}
                    >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            )}

        {!isPlaying && !showGameOver ? (
            // Game Configuration
            <KanaSelector 
                kanaType={kanaType} 
                setKanaType={setKanaType} 
                kanaGroupedByRow={kanaGroupedByRow} 
                chosenRows={chosenRows} 
                toggleRow={toggleRow} 
                checkAll={checkAll} 
                startGame={startGame}
            />
        ) : isPlaying ? (
            // Display game when isPlaying
            <GameScreen 
                setSoundOn={setSoundOn} 
                soundOn={soundOn} 
                showAnswer={showAnswer} 
                kanaQueue={kanaQueue} 
                currentIndex={currentIndex}
                userInput={userInput}
                handleInput={handleInput}
                handleKeyDown={handleKeyDown}
                inputRef={inputRef}
                isCorrect={isCorrect}
                revealedAnswer={revealedAnswer}
                score={score}
            />
            ) : (
            // Endgame screen
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/20 backdrop-blur shadow-lg rounded-xl p-8 max-w-lg w-full text-center text-white"
            >
                <h2 className="text-2xl font-bold mb-4">Game Over</h2>
                <p className="text-lg mb-2">Score: {score} / {kanaQueue.length}</p>
                <p className="mb-2">Time taken: {elapsedTime} seconds</p>
                <p className="text-white mb-2">Selected Rows: {selectedRowLabels.join(", ")}</p>
                <Button
                onClick={handleReset}
                >
                Try Again
                </Button>
            </motion.div>
            )}
            {!isPlaying && stats.length > 0 && (
                <div className="mt-6">
                <Button onClick={() => setStatsModalVisible(true)}>
                    Show Previous Sessions
                </Button>
                </div>
            )}
            <StatsModal
                stats={stats}
                visible={statsModalVisible}
                onClose={() => setStatsModalVisible(false)}
            />

            {/* Hidden audio element for correct sound */}
            <audio ref={audioRef} src={correctSoundSrc} preload="auto" />
        </main>
    );
};

export default KanaTyper;