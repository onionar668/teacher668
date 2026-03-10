import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Screen } from '../types.js';
import BottomNav from '../components/BottomNav.jsx';
import { loadQuests } from '../services/questsService.js';

const StatusBadge = ({ status }) => {
    let label = '';
    let classes = '';
    switch (status) {
        case 'completed':
            label = 'Выполнен';
            classes = 'bg-green-100 text-green-700';
            break;
        case 'in_progress':
            label = 'В процессе';
            classes = 'bg-blue-100 text-blue-700';
            break;
        default:
            label = 'Закрыт';
            classes = 'bg-gray-100 text-gray-500';
    }
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes}`}>
            {label}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['locked', 'in_progress', 'completed']).isRequired,
};

const PER_PAGE = 8;

const QuestsScreen = ({ navigate }) => {
    const [quests, setQuests] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await loadQuests();
                const questList = data.quests || [];
                setQuests(questList);
                setAchievements(data.achievements || []);
                setCurrentPage(1);
            } catch (err) {
                console.error('Failed to load quests', err);
                setError(err?.message || 'Не удалось загрузить квесты');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getAchievementById = (id) =>
        achievements.find((a) => a.id === id);

    const totalPages = quests.length > 0 ? Math.ceil(quests.length / PER_PAGE) : 1;
    const safePage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (safePage - 1) * PER_PAGE;
    const visibleQuests = quests.slice(startIndex, startIndex + PER_PAGE);

    return (
        <div className="flex flex-col h-screen bg-gray-50 pb-20">
            <header className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-start gap-4 mb-6">
                        <img className="w-[90px] h-[90px] rounded-xl" src="/avatar.jpg" alt="Avatar" />
                        <div className="bg-[#02fa1b] text-white p-4 rounded-2xl shadow-lg  min-h-[72px] flex items-center">
                            <p className="text-lg ">
                                Выполняйте квесты, чтобы открывать достижения и мотивировать себя.
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow px-6 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#02fa1b] rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 mt-10">
                        {error}
                    </div>
                ) : (
                    <>
                        <section>
                            <div className="flex items-baseline justify-between mb-3">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Квесты</h2>
                                    <p className="text-xs text-gray-500">
                                        Всего квестов: {quests.length}
                                    </p>
                                </div>
                                {quests.length > 0 && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={safePage === 1}
                                            className={`px-2 py-1 rounded-full border text-xs ${
                                                safePage === 1
                                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                    : 'border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            Назад
                                        </button>
                                        <span>
                                            Стр. {safePage} из {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(totalPages, p + 1),
                                                )
                                            }
                                            disabled={safePage === totalPages}
                                            className={`px-2 py-1 rounded-full border text-xs ${
                                                safePage === totalPages
                                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                    : 'border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            Вперёд
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {visibleQuests.map((quest) => {
                                    const achievement = getAchievementById(quest.rewardAchievementId);
                                    const progress = Math.min(
                                        100,
                                        quest.requirementValue
                                            ? Math.round(
                                                (quest.progressValue / quest.requirementValue) * 100,
                                            )
                                            : 0,
                                    );
                                    return (
                                        <div
                                            key={quest.id}
                                            className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {quest.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {quest.description}
                                                    </p>
                                                </div>
                                                <StatusBadge status={quest.status} />
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>
                                                        Прогресс: {quest.progressValue}/{quest.requirementValue}
                                                    </span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="h-1.5 rounded-full bg-[#02fa1b]"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {achievement && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-[10px] uppercase tracking-wide text-gray-400">
                                                        Награда:
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {achievement.title}
                                                    </span>
                                                    {achievement.unlocked && (
                                                        <span className="ml-auto text-xs text-green-600 font-semibold">
                                                            Получено
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        <section className="mt-6 mb-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">Достижения</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {achievements.map((a) => (
                                    <div
                                        key={a.id}
                                        className={`p-3 rounded-2xl border text-xs ${
                                            a.unlocked
                                                ? 'border-[#02fa1b] bg-[#02fa1b]/5'
                                                : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        <p className="font-semibold text-gray-800 mb-1">
                                            {a.title}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            {a.description}
                                        </p>
                                        {a.unlocked && (
                                            <p className="mt-1 text-[10px] text-green-600 font-semibold">
                                                Открыто
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </main>
            <BottomNav activeScreen={Screen.Quests} navigate={navigate} />
        </div>
    );
};

QuestsScreen.propTypes = {
    navigate: PropTypes.func.isRequired,
};

export default QuestsScreen;
