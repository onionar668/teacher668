import React from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button.jsx';



const WelcomeScreen = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-between h-screen p-8 bg-white">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div style={{boxShadow: '0px 4px 4px 0px #00000040'}} className="w-[128px] h-[128px] rounded-full mb-6 bg-white flex items-center justify-center">
                    <img src="/logo-welcome.svg" alt="" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">ProgramLingo</h1>
                <p className="text-gray-500 text-lg">Ваш наставник рядом. Учитесь в любое время.</p>
            </div>
            <div className="w-full">
                <Button onClick={onStart}>Начать учиться</Button>
            </div>
        </div>
    );
};

WelcomeScreen.propTypes = {
    onStart: PropTypes.func.isRequired
};

export default WelcomeScreen;
