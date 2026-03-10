import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.jsx';

const OnboardingIntroScreen = ({ onNext }) => {
    return (
        <div className="flex flex-col items-center justify-between h-screen p-8 bg-white">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="bg-[#02fa1b] text-white p-6 rounded-3xl shadow-lg mb-8 max-w-sm">
                    <p className="text-2xl ">Ответьте на следующие 5 вопросов и мы начнем наше обучение 😉</p>
                </div>
                <img className='w-[400px] h-[400px]'
                    src="/teacher.png" 
                    alt="Teacher illustration"
                />
            </div>
            <div className="w-full">
                <Button onClick={onNext}>Далее</Button>
            </div>
        </div>
    );
};

OnboardingIntroScreen.propTypes = {
    onNext: PropTypes.func.isRequired
};

export default OnboardingIntroScreen;
