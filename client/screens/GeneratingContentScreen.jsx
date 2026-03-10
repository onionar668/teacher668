import React from 'react';
import PropTypes from 'prop-types';

const GeneratingContentScreen = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white p-8 text-center">
            <div className="w-full max-w-xs h-2.5 rounded-full bg-gray-200 mb-6 overflow-hidden">
                <div className="h-2.5 w-full progress-bar-shimmer"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Минуточку...</h1>
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

GeneratingContentScreen.propTypes = {
    message: PropTypes.string.isRequired
};

export default GeneratingContentScreen;