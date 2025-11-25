import React, { useState, useEffect } from 'react';

const RecyclingGame = () => {
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [timeLeft, setTimeLeft] = useState(30);

    const items = [
        { name: '🥤 Botella de Plástico', bin: 'plastic', emoji: '🥤' },
        { name: '📰 Periódico', bin: 'paper', emoji: '📰' },
        { name: '🥫 Lata de Aluminio', bin: 'metal', emoji: '🥫' },
        { name: '🍎 Restos de Comida', bin: 'organic', emoji: '🍎' },
        { name: '📦 Caja de Cartón', bin: 'paper', emoji: '📦' },
        { name: '🍾 Botella de Vidrio', bin: 'glass', emoji: '🍾' },
    ];

    const bins = [
        { type: 'plastic', name: 'Plástico', color: 'bg-yellow-500', emoji: '♻️' },
        { type: 'paper', name: 'Papel', color: 'bg-blue-500', emoji: '📄' },
        { type: 'metal', name: 'Metal', color: 'bg-gray-500', emoji: '🔩' },
        { type: 'glass', name: 'Vidrio', color: 'bg-green-500', emoji: '🍾' },
        { type: 'organic', name: 'Orgánico', color: 'bg-orange-500', emoji: '🌱' },
    ];

    useEffect(() => {
        if (gameActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameActive(false);
        }
    }, [gameActive, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameActive(true);
        nextItem();
    };

    const nextItem = () => {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        setCurrentItem(randomItem);
    };

    const handleBinClick = (binType) => {
        if (!gameActive || !currentItem) return;

        if (binType === currentItem.bin) {
            setScore(score + 10);
            nextItem();
        } else {
            setScore(Math.max(0, score - 5));
        }
    };

    return (
        <div className="glass-card">
            <h3 className="text-2xl font-bold text-primary mb-4">🎮 Juego de Reciclaje</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                ¡Clasifica los residuos en el contenedor correcto!
            </p>

            <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-bold">Puntos: <span className="text-primary">{score}</span></div>
                <div className="text-lg font-bold">Tiempo: <span className="text-red-500">{timeLeft}s</span></div>
            </div>

            {!gameActive ? (
                <button onClick={startGame} className="btn-primary w-full mb-4">
                    {timeLeft === 30 ? 'Iniciar Juego' : 'Jugar de Nuevo'}
                </button>
            ) : (
                <div className="mb-6 p-6 bg-white/50 dark:bg-black/30 rounded-2xl text-center">
                    <div className="text-6xl mb-2">{currentItem?.emoji}</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-white">{currentItem?.name}</div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {bins.map((bin) => (
                    <button
                        key={bin.type}
                        onClick={() => handleBinClick(bin.type)}
                        disabled={!gameActive}
                        className={`${bin.color} ${!gameActive ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
              text-white font-bold py-4 px-3 rounded-xl transition-all duration-200 shadow-lg`}
                    >
                        <div className="text-3xl mb-1">{bin.emoji}</div>
                        <div className="text-sm">{bin.name}</div>
                    </button>
                ))}
            </div>

            {timeLeft === 0 && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary rounded-xl text-center">
                    <p className="font-bold text-lg">¡Juego Terminado!</p>
                    <p className="text-gray-600 dark:text-gray-300">Puntuación final: {score} puntos</p>
                </div>
            )}
        </div>
    );
};

export default RecyclingGame;
