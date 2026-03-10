import React from 'react';
import PropTypes from 'prop-types';
import { Screen } from '../types.js';

const HomeIcon = ({isActive}) => (
    <img src="/home-icon.svg" alt="" />
);
HomeIcon.propTypes = { isActive: PropTypes.bool.isRequired };

const CoursesIcon = ({isActive}) => (
    <img src="/navCourse-icon.svg" alt="" />
);
CoursesIcon.propTypes = { isActive: PropTypes.bool.isRequired };

const QuestsIcon = ({isActive}) => (
    <img src="/navQuests-icon.svg" alt="" />
);
QuestsIcon.propTypes = { isActive: PropTypes.bool.isRequired };


const BottomNav = ({ activeScreen, navigate }) => {
    const navItems = [
        { screen: Screen.Dashboard, icon: HomeIcon, label: 'Главная' },
        { screen: Screen.MyCourses, icon: CoursesIcon, label: 'Мои курсы' },
        { screen: Screen.Quests, icon: QuestsIcon, label: 'Квесты' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
            <div className="flex justify-around items-center h-20">
                {navItems.map((item) => {
                    const isActive = activeScreen === item.screen;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.screen)}
                            className="flex flex-col items-center justify-center gap-1 text-xs font-medium"
                        >
                            <item.icon isActive={isActive} />
                            <span className={isActive ? 'text-[#02fa1b]' : 'text-gray-500'}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

BottomNav.propTypes = {
    activeScreen: PropTypes.oneOf(Object.values(Screen)).isRequired,
    navigate: PropTypes.func.isRequired
};

export default BottomNav;
