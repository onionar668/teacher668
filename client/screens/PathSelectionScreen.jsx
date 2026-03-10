import React from 'react';
import PropTypes from 'prop-types';

const PathSelectionScreen = ({ onSelect }) => {
    return (
         <div className="flex flex-col h-screen p-6 bg-gray-50">
            <header className="py-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => {}} className="text-[#02fa1b]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="w-full bg-[#02fa1b] rounded-full h-2.5"></div>
                </div>
            </header>
            
            <main className="flex-grow flex flex-col pt-6">
                <div className="flex items-start gap-4 mb-8">
                    <img src="/avatar.svg" alt="Avatar" className="w-16 h-16 rounded-full"/>
                    <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg mt-2">
                        <p className="text-lg font-semibold">С чего начнем наш путь?</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <button onClick={() => onSelect('learn')} className="w-full text-left p-6 border-2 border-gray-200 hover:border-[#02fa1b] bg-white rounded-2xl flex items-center gap-6 transition-all">
                        <img src="https://picsum.photos/seed/learn-icon/60/60" alt="Learn basics" className="w-16 h-16 rounded-lg" />
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Изучить основы</h3>
                            <p className="text-gray-500">Освойте базовые и ключевые понятия, чтобы заложить прочный фундамент.</p>
                        </div>
                    </button>
                    <button onClick={() => onSelect('test')} className="w-full text-left p-6 border-2 border-[#02fa1b] bg-[#02fa1b]/10 rounded-2xl flex items-center gap-6 transition-all">
                        <img src="https://picsum.photos/seed/test-icon/60/60" alt="Check level" className="w-16 h-16 rounded-lg" />
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Узнать свой уровень</h3>
                            <p className="text-gray-500">Определите свой текущий уровень знаний или навыков, чтобы понять, с чего начать обучение.</p>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
};

PathSelectionScreen.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default PathSelectionScreen;
