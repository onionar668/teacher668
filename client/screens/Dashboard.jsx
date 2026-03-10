import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Screen, StatsPropType } from "../types.js";
import BottomNav from "../components/BottomNav.jsx";
import { allTopics } from "../services/topics.js";

const Dashboard = ({ navigate, stats, startOnboardingWithTopic, currentUser, onLogout }) => {
  const [courseSuggestions, setCourseSuggestions] = useState([]);

  useEffect(() => {
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    setCourseSuggestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-20">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#02fa1b] text-white rounded-lg flex items-center justify-center">
            <img src="/myCourse-icon.svg" alt="Home-icon" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Главная</h2>
            {currentUser && (
              <p className="text-sm text-gray-500">
                Привет, <span className="font-semibold">{currentUser.name}</span>
              </p>
            )}
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Выйти
          </button>
        )}
      </header>

      <main className="flex-grow px-6 overflow-y-auto">
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-400 text-center text-white p-4 rounded-2xl shadow-lg">
              <h4 className="text-4xl font-extrabold">{stats.totalCourses}</h4>
              <p className="font-medium">Всего курсов</p>
            </div>
            <div className="bg-blue-500 text-center text-white p-4 rounded-2xl shadow-lg">
              <h4 className="text-4xl font-extrabold">
                {stats.completedCourses}
              </h4>
              <p className="font-medium">Пройдено курсов</p>
            </div>
            <div className="bg-pink-500 text-center text-white p-4 rounded-2xl shadow-lg">
              <h4 className="text-4xl font-extrabold">{stats.lessonStreak}</h4>
              <p className="font-medium">Серия уроков</p>
            </div>
            <div className="bg-orange-500 text-center text-white p-4 rounded-2xl shadow-lg">
              <h4 className="text-4xl font-extrabold">{stats.questsCompleted}</h4>
              <p className="font-medium">Выполнено квестов</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Предложения по курсам
          </h3>
          <div className="space-y-3 mb-10">
            {courseSuggestions.map((topic, index) => (
              <button
                onClick={() => startOnboardingWithTopic(topic)}
                key={index}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-[#02fa1b] transition-colors"
              >
                <span className="font-semibold text-gray-700 text-left">{`Курс по «${topic}»`}</span>
                <div className="w-10 h-10  bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <img src="/play-icon.svg" alt="Play-icon" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav activeScreen={Screen.Dashboard} navigate={navigate} />
    </div>
  );
};

Dashboard.propTypes = {
  navigate: PropTypes.func.isRequired,
  stats: StatsPropType.isRequired,
  startOnboardingWithTopic: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

export default Dashboard;
