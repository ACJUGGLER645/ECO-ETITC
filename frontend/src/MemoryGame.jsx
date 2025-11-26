import React, { useState, useEffect } from 'react';

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);

    const emojis = ['🌍', '🌱', '☀️', '💧', '♻️', '🐼', '🌳', '🌊'];

    const shuffleCards = () => {
        const shuffled = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setDisabled(false);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([...flipped, id]);
            setMoves(moves + 1);

            const firstCard = cards.find(card => card.id === flipped[0]);
            const secondCard = cards.find(card => card.id === id);

            if (firstCard.emoji === secondCard.emoji) {
                setSolved([...solved, flipped[0], id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    return (
        <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Memoria Ecológica</h3>
                <button
                    onClick={shuffleCards}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                    Reiniciar
                </button>
            </div>

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Movimientos: <span className="font-bold">{moves}</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map(card => (
                    <div
                        key={card.id}
                        onClick={() => handleClick(card.id)}
                        className={`aspect-square flex items-center justify-center text-4xl cursor-pointer rounded-xl transition-all duration-300 transform ${flipped.includes(card.id) || solved.includes(card.id)
                                ? 'bg-white dark:bg-gray-700 rotate-0 text-gray-900 dark:text-white'
                                : 'bg-primary rotate-180 text-transparent'
                            }`}
                    >
                        {(flipped.includes(card.id) || solved.includes(card.id)) ? card.emoji : ''}
                    </div>
                ))}
            </div>

            {solved.length === cards.length && cards.length > 0 && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl text-center font-bold">
                    ¡Felicidades! Completaste el juego en {moves} movimientos.
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
