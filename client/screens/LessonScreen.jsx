import React from 'react';
import PropTypes from 'prop-types';
import { QuizPropType } from '../types.js';
import Button from '../components/Button.jsx';

const LessonScreen = ({ course, module, onStartTest, onBack }) => {
    return (
        <div className="flex flex-col h-screen p-6 bg-gray-50">
            <header className="py-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-[#02fa1b]">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="text-center flex-grow">
                        <h1 className="text-lg font-bold text-gray-800">{course.title}</h1>
                        <p className="text-sm text-gray-500">{module.title}</p>
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="flex-grow pt-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Урок: Теория</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
                        {module.theory}
                    </div>
                </div>
            </main>

            <footer className="py-4 mt-auto flex-shrink-0">
                <Button onClick={onStartTest}>Начать тест</Button>
            </footer>
        </div>
    );
};

LessonScreen.propTypes = {
    course: QuizPropType.isRequired,
    module: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        theory: PropTypes.string.isRequired,
    }).isRequired,
    onStartTest: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default LessonScreen;
