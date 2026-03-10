import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.jsx';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const QuickOnboardingScreen = ({ topic, onComplete, onBack }) => {
    const [level, setLevel] = useState(null);
    const [timeCommitment, setTimeCommitment] = useState(null);
    const [step, setStep] = useState(0);

    const questions = [
        {
            id: 'level',
            text: `Как хорошо вы знаете тему «${topic}»?`,
            options: ['Новичок', 'Ученик', 'Знаток', 'Профи', 'Мастер'],
            setter: setLevel,
            value: level,
        },
        {
            id: 'timeCommitment',
            text: 'Сколько времени вы готовы учиться?',
            options: ['5 минут в день', '10 минут в день', '15 минут в день', '20 минут в день'],
            setter: setTimeCommitment,
            value: timeCommitment,
        },
    ];

    const currentQuestion = questions[step];

    const handleSelect = (value) => {
        currentQuestion.setter(value);
        setTimeout(() => {
             if (step < questions.length - 1) {
                setStep(s => s + 1);
            }
        }, 300);
    };

    const handleContinue = () => {
        if (level && timeCommitment) {
            onComplete({ level, timeCommitment });
        }
    };
    
    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            onBack();
        }
    }

    const isNextDisabled = !level || !timeCommitment;

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
             <header className="py-4">
                <div className="flex items-center gap-4">
                    <button onClick={handleBack} className="text-[#02fa1b]">
                        <img src="/back-button.svg" alt="" />
                    </button>
                </div>
            </header>
            <main className="flex-grow flex flex-col pt-6">
                <div className="flex items-start gap-4 mb-6">
                    <img src="/avatar.jpg" alt="Avatar" className="w-16 h-16 rounded-full"/>
                    <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg mt-2 min-h-[72px] flex items-center">
                        <p className="text-lg font-semibold">{currentQuestion.text}</p>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left p-4 mb-3 border-2 rounded-2xl transition-all duration-200 flex justify-between items-center ${currentQuestion.value === option ? 'bg-[#02fa1b]/10 border-[#02fa1b]' : 'bg-white border-gray-200 hover:border-[#02fa1b]/60'}`}
                        >
                            <span className={`font-medium ${currentQuestion.value === option ? 'text-[#02fa1b]' : 'text-gray-700'}`}>{option}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentQuestion.value === option ? 'bg-[#02fa1b]' : 'border-2 border-gray-300'}`}>
                                {currentQuestion.value === option && <CheckIcon />}
                            </div>
                        </button>
                    ))}
                </div>
            </main>
            
            <footer className="py-4">
                 <Button onClick={handleContinue} disabled={isNextDisabled}>Создать курс</Button>
            </footer>
        </div>
    );
};

QuickOnboardingScreen.propTypes = {
    topic: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default QuickOnboardingScreen;
