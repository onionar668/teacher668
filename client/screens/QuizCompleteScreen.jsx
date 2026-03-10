import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.jsx';


const QuizCompleteScreen = ({ onFinish, isCourseComplete }) => {
    return (
        <div className="flex flex-col items-center justify-between h-screen p-8 bg-white text-center">
            <div/>
            <div className="flex flex-col items-center">
                <img src="/success-icon.svg" alt="" />
                <h1 className="text-4xl font-extrabold text-gray-800 mt-6 mb-2">Отлично</h1>
                {isCourseComplete ? (
                    <>
                        <p className="text-gray-600 text-lg mb-2">Вы успешно завершили курс!</p>
                        <p className="text-gray-500">Поздравляем! Вы проделали отличную работу. Так держать! 🔥</p>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 text-lg mb-2">Задание выполнено!</p>
                        <p className="text-gray-500">Вы на шаг ближе к цели. Продолжайте в том же духе! 👍</p>
                    </>
                )}
            </div>
            <div className="w-full space-y-3">
                <Button onClick={onFinish}>Завершить</Button>
                {isCourseComplete && (
                    <button 
                        className="w-full bg-white text-[#02fa1b] font-semibold py-4 px-6 rounded-2xl text-lg border-2 border-[#02fa1b] hover:bg-[#02fa1b]/10 transition-colors duration-300"
                    >
                        Получить сертификат
                    </button>
                )}
            </div>
        </div>
    );
};

QuizCompleteScreen.propTypes = {
    onFinish: PropTypes.func.isRequired,
    isCourseComplete: PropTypes.bool.isRequired,
};

export default QuizCompleteScreen;