import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserAnswersPropType } from '../types.js';
import Button from '../components/Button.jsx';
import { validateTopic, generateAchievements } from '../services/geminiService.js';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ProgressBar = ({step, totalSteps}) => {
    const progress = (step / totalSteps) * 100;
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

const achievementImages = [
    '/result-1.svg',
    '/result-2.svg',
    '/result-3.svg'
];

const OnboardingFlow = ({ onComplete, initialAnswers = {} }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState(initialAnswers);
    const [otherTopic, setOtherTopic] = useState('');
    const [showTransitionMessage, setShowTransitionMessage] = useState(false);
    const [transitionMessage, setTransitionMessage] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [isLoadingAchievements, setIsLoadingAchievements] = useState(false);

    useEffect(() => {
        if (initialAnswers.topic) {
            setAnswers(initialAnswers);
        }
    }, [initialAnswers]);

    useEffect(() => {
        if (step === questions.length) {
            const fetchAchievements = async () => {
                setIsLoadingAchievements(true);
                const finalAnswers = { ...answers };
                if (answers.topic === 'Другое') {
                    finalAnswers.topic = otherTopic;
                }
                const generatedAchievements = await generateAchievements(finalAnswers);
                setAchievements(generatedAchievements);
                setIsLoadingAchievements(false);
            };
            fetchAchievements();
        }
    }, [step]);
    
    const handleTopicValidation = async () => {
        if (answers.topic !== 'Другое' || !otherTopic) {
            setValidationError(null);
            return;
        }

        setIsValidating(true);
        setValidationError(null);
        const isValid = await validateTopic(otherTopic);
        setIsValidating(false);

        if (!isValid) {
            setValidationError('Тема не распознана. Пожалуйста, введите известный язык программирования или разговорный язык.');
        } else {
            setValidationError(null);
        }
    };


    const questions = [
        {
            id: 'topic',
            text: 'Чему вы хотите научиться?',
            options: ['Python', 'Kali Linux', 'Английский язык', 'Казахский язык', 'SQL', 'Другое'],
        },
        {
            id: 'level',
            text: `Как хорошо вы знаете тему «${answers.topic === 'Другое' ? otherTopic : answers.topic || ''}»?`,
            options: ['Новичок', 'Ученик', 'Знаток', 'Профи', 'Мастер'],
        },
        {
            id: 'goal',
            text: `Для чего вы изучаете курс «${answers.topic === 'Другое' ? otherTopic : answers.topic || ''}»?`,
            options: ['Учеба/Карьера/Проект', 'Полезные знания', 'Хобби', 'Коммуникация'],
        },
        {
            id: 'timeCommitment',
            text: 'Сколько времени вы готовы учиться?',
            options: ['5 минут в день', '10 минут в день', '15 минут в день', '20 минут в день'],
        },
    ];

    const handleSelect = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });

        if (questionId === 'level') {
            let msg = '';
            if (['Новичок', 'Ученик'].includes(value)) msg = 'Тогда начнем всё с нуля!';
            else if (['Знаток'].includes(value)) msg = 'Окей, тогда будем развивать твои навыки 😉';
            else if (['Профи', 'Мастер'].includes(value)) msg = 'Ого, крутой! 😎';
            setTransitionMessage(msg);
            setShowTransitionMessage(true);
            setTimeout(() => {
                setShowTransitionMessage(false);
                setStep(s => s + 1);
            }, 2000);
        }
    };
    
    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else if (step === questions.length - 1) {
             setStep(step + 1);
        } else {
             const finalAnswers = {...answers};
             if (answers.topic === 'Другое') {
                 finalAnswers.topic = otherTopic;
             }
             onComplete(finalAnswers);
        }
    };
    
    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const currentQuestion = questions[step];
    const selectedValue = answers[currentQuestion?.id];

    const renderOption = (option, questionId) => {
        const isSelected = selectedValue === option;
        return (
            <div key={option} className="w-full">
                <button
                    onClick={() => handleSelect(questionId, option)}
                    className={`w-full text-left p-4 mb-3 border-2 rounded-2xl transition-all duration-200 flex justify-between items-center ${isSelected ? 'bg-[#02fa1b]/10 border-[#02fa1b]' : 'bg-white border-gray-200 hover:border-[#02fa1b]/60'}`}
                >
                    <span className={`font-medium ${isSelected ? 'text-[#02fa1b]' : 'text-gray-700'}`}>{option}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#02fa1b]' : 'border-2 border-gray-300'}`}>
                        {isSelected && <CheckIcon />}
                    </div>
                </button>
                {questionId === 'topic' && option === 'Другое' && isSelected && (
                    <div className="mt-2">
                        <input
                            type="text"
                            value={otherTopic}
                            onChange={(e) => {
                                setOtherTopic(e.target.value);
                                if (validationError) setValidationError(null);
                            }}
                            onBlur={handleTopicValidation}
                            placeholder="Название курса"
                            className="w-full p-4 border-2 border-[#02fa1b]/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#02fa1b]"
                        />
                        {isValidating && <p className="text-sm text-gray-500 mt-1 pl-1">Проверяем тему...</p>}
                        {validationError && <p className="text-sm text-red-500 mt-1 pl-1">{validationError}</p>}
                    </div>
                )}
            </div>
        );
    };
    
    if (showTransitionMessage) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-8 bg-white animate-fadeIn">
                <img src="/avatar.jpg" alt="Avatar" className="w-24 h-24 rounded-full mb-6"/>
                <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg">
                    <p className="text-lg font-semibold">{transitionMessage}</p>
                </div>
            </div>
        )
    }
    
    const isQuestionStep = step < questions.length;
    const isAchievementsStep = step === questions.length;
    const isTopicStepWithOther = isQuestionStep && currentQuestion.id === 'topic' && selectedValue === 'Другое';
    const isNextDisabled = (isQuestionStep && (!selectedValue || (isTopicStepWithOther && (!otherTopic || isValidating || !!validationError)))) || (isAchievementsStep && isLoadingAchievements);

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
            <header className="py-4">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="text-[#02fa1b] disabled:opacity-50" disabled={step === 0}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <ProgressBar step={step + 1} totalSteps={questions.length + 1} />
                </div>
            </header>
            
            <main className="flex-grow flex flex-col pt-6">
                <div className="flex items-start gap-4 mb-6">
                    <img className='w-[90px] h-[90px] rounded-xl' src="/avatar.jpg" alt="Avatar"/>
                    <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg min-h-[72px] flex items-center">
                        <p className="text-lg font-semibold">
                            {isQuestionStep ? currentQuestion.text : `Занимаясь ${answers.timeCommitment || 'регулярно'}, вот чего вы сможете достичь:`}
                        </p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {isQuestionStep ? (
                        questions[step].options.map(opt => renderOption(opt, questions[step].id))
                    ) : (
                        isLoadingAchievements ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#02fa1b] rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fadeIn">
                                 {achievements.map((ach, index) => (
                                     <div key={index} className="flex items-center gap-4">
                                        <img 
                                            src={achievementImages[index]} 
                                            className="w-16 h-16 flex-shrink-0 object-contain" 
                                            alt={ach.title}
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg">{ach.title}</h3>
                                            <p className="text-gray-600">{ach.description}</p>
                                        </div>
                                     </div>
                                 ))}
                            </div>
                        )
                    )}
                </div>
            </main>
            
            <footer className="py-4">
                <Button onClick={handleNext} disabled={isNextDisabled}>Продолжить</Button>
            </footer>
        </div>
    );
};

OnboardingFlow.propTypes = {
    onComplete: PropTypes.func.isRequired,
    initialAnswers: UserAnswersPropType
};

export default OnboardingFlow;