import React, { useState } from 'react';

const EcoQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const questions = [
        {
            question: '¿Cuánto tiempo tarda en degradarse una botella de plástico?',
            options: ['1 año', '10 años', '100 años', '450 años'],
            correct: 3,
            explanation: 'Una botella de plástico puede tardar hasta 450 años en degradarse completamente.'
        },
        {
            question: '¿Qué porcentaje de oxígeno producen los océanos?',
            options: ['20%', '50%', '70%', '90%'],
            correct: 2,
            explanation: 'Los océanos producen aproximadamente el 70% del oxígeno que respiramos.'
        },
        {
            question: '¿Cuál es la principal causa del cambio climático?',
            options: ['Volcanes', 'Emisiones de CO2', 'El Sol', 'Los animales'],
            correct: 1,
            explanation: 'Las emisiones de CO2 por actividades humanas son la principal causa del cambio climático.'
        },
        {
            question: '¿Cuánta agua se ahorra al cerrar el grifo mientras te cepillas los dientes?',
            options: ['1 litro', '5 litros', '12 litros', '20 litros'],
            correct: 2,
            explanation: 'Puedes ahorrar hasta 12 litros de agua cada vez que te cepillas los dientes.'
        },
        {
            question: '¿Qué porcentaje de la energía mundial proviene de fuentes renovables?',
            options: ['10%', '30%', '50%', '70%'],
            correct: 1,
            explanation: 'Aproximadamente el 30% de la energía mundial proviene de fuentes renovables.'
        }
    ];

    const handleAnswerClick = (answerIndex) => {
        setSelectedAnswer(answerIndex);

        setTimeout(() => {
            if (answerIndex === questions[currentQuestion].correct) {
                setScore(score + 1);
            }

            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
            } else {
                setShowScore(true);
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
    };

    const getButtonClass = (index) => {
        if (selectedAnswer === null) {
            return 'bg-white/50 dark:bg-black/30 hover:bg-primary/20 dark:hover:bg-primary/20';
        }
        if (index === questions[currentQuestion].correct) {
            return 'bg-green-500 text-white';
        }
        if (index === selectedAnswer) {
            return 'bg-red-500 text-white';
        }
        return 'bg-white/50 dark:bg-black/30 opacity-50';
    };

    return (
        <div className="glass-card">
            <h3 className="text-2xl font-bold text-primary mb-4">🧠 Quiz Ambiental</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                ¡Pon a prueba tus conocimientos sobre el medio ambiente!
            </p>

            {showScore ? (
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        {score >= 4 ? '🌟' : score >= 3 ? '👍' : '📚'}
                    </div>
                    <h4 className="text-2xl font-bold mb-2">¡Quiz Completado!</h4>
                    <p className="text-xl mb-4">
                        Obtuviste <span className="text-primary font-bold">{score}</span> de {questions.length} respuestas correctas
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {score >= 4 ? '¡Excelente! Eres un experto ambiental.' :
                            score >= 3 ? '¡Bien hecho! Tienes buenos conocimientos.' :
                                '¡Sigue aprendiendo sobre el medio ambiente!'}
                    </p>
                    <button onClick={resetQuiz} className="btn-primary">
                        Intentar de Nuevo
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Pregunta {currentQuestion + 1} de {questions.length}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                                Puntos: {score}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            {questions[currentQuestion].question}
                        </h4>
                    </div>

                    <div className="space-y-3 mb-4">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(index)}
                                disabled={selectedAnswer !== null}
                                className={`w-full p-4 rounded-xl font-semibold text-left transition-all duration-200 
                  ${getButtonClass(index)} ${selectedAnswer === null ? 'hover:scale-102' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {selectedAnswer !== null && (
                        <div className={`p-4 rounded-xl ${selectedAnswer === questions[currentQuestion].correct
                                ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
                                : 'bg-red-100 dark:bg-red-900/30 border border-red-500'
                            }`}>
                            <p className="font-semibold mb-2">
                                {selectedAnswer === questions[currentQuestion].correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {questions[currentQuestion].explanation}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default EcoQuiz;
