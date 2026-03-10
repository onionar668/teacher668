import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { QuizPropType } from '../types.js';
import Button from '../components/Button.jsx';

const ProgressBar = ({step, totalSteps}) => {
    const progress = totalSteps > 0 ? (step / totalSteps) * 100 : 0;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#02fa1b] h-2.5 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
    )
}

ProgressBar.propTypes = {
    step: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
};

/**
 * Shuffles an array in place and returns it.
 * @param {Array} array 
 */
const shuffleArray = (array) => {
  const newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const QuizScreen = ({ quiz, onComplete, onExit }) => {
    const [questionsToAsk, setQuestionsToAsk] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [incorrectQueue, setIncorrectQueue] = useState([]);
    const [isReviewing, setIsReviewing] = useState(false);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        setQuestionsToAsk(quiz.questions);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setIncorrectQueue([]);
        setIsReviewing(false);
        setExplanation('');
    }, [quiz.id, quiz.moduleId]);

    const currentQuestion = questionsToAsk[currentQuestionIndex];

    const handleAnswerSelect = (option) => {
        if (showResult) return;
        setSelectedAnswer(option);
    };

    const handleCheckAnswer = () => {
        if (!selectedAnswer) return;
        
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        if (isCorrect) {
            if (!isReviewing) {
                setScore(prev => prev + 1);
            }
        } else {
            const questionToReask = {
              ...currentQuestion,
              options: shuffleArray(currentQuestion.options),
            };
            setIncorrectQueue(prev => [...prev, questionToReask]);
            setExplanation(currentQuestion.explanation || '');
        }
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        setExplanation('');
        if (currentQuestionIndex < questionsToAsk.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            if (incorrectQueue.length > 0) {
                setIsReviewing(true);
                setQuestionsToAsk(incorrectQueue);
                setIncorrectQueue([]);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                onComplete(score);
            }
        }
    };
    
    const getOptionClass = (option) => {
        if (!showResult) {
            return selectedAnswer === option 
                ? 'bg-[#02fa1b] text-white border-[#02fa1b]' 
                : 'bg-white border-gray-200 hover:border-[#02fa1b]';
        }

        if (option === currentQuestion.correctAnswer) {
            return 'bg-green-500 text-white border-green-500';
        }
        if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
            return 'bg-red-500 text-white border-red-500';
        }
        return 'bg-white border-gray-200';
    };

    if (!currentQuestion) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
            <header className="py-4">
                <div className="flex items-center gap-4">
                    <button onClick={onExit} className="text-[#02fa1b]">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <ProgressBar step={currentQuestionIndex + 1} totalSteps={questionsToAsk.length} />
                </div>
            </header>

            <main className="flex-grow flex flex-col pt-6 overflow-y-auto">
                {isReviewing && (
                    <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center animate-fadeIn">
                        <p className="font-semibold">Давайте повторим вопросы, в которых вы ошиблись.</p>
                    </div>
                )}
                <div className="flex items-start gap-4 mb-6">
                    <img className="w-[90px] h-[90px] rounded-xl" src="/avatar.jpg" alt="Avatar"/>
                    <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg mt-2">
                        <p className="text-lg font-semibold">{currentQuestion.question}</p>
                        {currentQuestion.codeSnippet && (
                            <pre className="bg-gray-800 text-white rounded-lg p-3 mt-2 text-sm whitespace-pre-wrap break-words">
                                <code>{currentQuestion.codeSnippet}</code>
                            </pre>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-4 rounded-2xl border-2 text-center font-semibold transition-colors duration-300 min-h-28 flex items-center justify-center break-words ${getOptionClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {explanation && showResult && (
                    <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-2xl animate-fadeIn">
                        <h4 className="font-bold text-blue-800 mb-2">Объяснение:</h4>
                        <p className="text-blue-700">{explanation}</p>
                    </div>
                )}
            </main>

            <footer className="py-4 mt-auto flex-shrink-0">
                {showResult ? (
                    <Button onClick={handleNextQuestion}>Далее</Button>
                ) : (
                    <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>Проверить</Button>
                )}
            </footer>
        </div>
    );
};

QuizScreen.propTypes = {
    quiz: QuizPropType.isRequired,
    onComplete: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
};

export default QuizScreen;