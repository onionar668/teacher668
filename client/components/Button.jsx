import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, children, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-white font-semibold py-4 px-6 rounded-2xl text-lg transition-colors duration-300 ${disabled ? 'bg-[#02fa1b]/60 cursor-not-allowed' : 'bg-[#02fa1b] hover:bg-[#02fa1b]'} ${className}`}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

export default Button;
