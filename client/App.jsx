import React, { useState, useEffect, useCallback } from 'react';
import { Screen } from './types.js';
import SplashScreen from './screens/SplashScreen.jsx';
import WelcomeScreen from './screens/WelcomeScreen.jsx';
import OnboardingIntroScreen from './screens/OnboardingIntroScreen.jsx';
import OnboardingFlow from './screens/OnboardingFlow.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import QuizCompleteScreen from './screens/QuizCompleteScreen.jsx';
import Dashboard from './screens/Dashboard.jsx';
import MyCoursesScreen from './screens/MyCoursesScreen.jsx';
import PathSelectionScreen from './screens/PathSelectionScreen.jsx';
import { generatePlacementTest, generateQuizCourse } from './services/geminiService.js';
import { saveGeneratedCourse, loadUserCourses } from './services/coursesService.js';
import { syncQuests } from './services/questsService.js';
import GeneratingContentScreen from './screens/GeneratingContentScreen.jsx';
import QuickOnboardingScreen from './screens/QuickOnboardingScreen.jsx';
import QuestsScreen from './screens/QuestsScreen.jsx';
import CreateCourseScreen from './screens/CreateCourseScreen.jsx';
import LessonScreen from './screens/LessonScreen.jsx';
import AuthScreen from './screens/AuthScreen.jsx';
import { fetchCurrentUser, clearToken } from './services/authService.js';

const App = () => {
    const [screen, setScreen] = useState(Screen.Splash);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [userAnswers, setUserAnswers] = useState({});
    
    const [quizzes, setQuizzes] = useState([]);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [completionStatus, setCompletionStatus] = useState({ isCourseComplete: false });

    const [stats, setStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        lessonStreak: 0,
        questsCompleted: 0,
    });


    const [loadingMessage, setLoadingMessage] = useState('');
    const [initialOnboardingAnswers, setInitialOnboardingAnswers] = useState({});
    const [quickOnboardingTopic, setQuickOnboardingTopic] = useState(null);

    const loadUserStats = useCallback((userId) => {
        try {
            const raw = localStorage.getItem(`oqu-stats-${userId}`);
            if (!raw) {
                return {
                    totalCourses: 0,
                    completedCourses: 0,
                    lessonStreak: 0,
                    questsCompleted: 0,
                };
            }
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                return {
                    totalCourses: parsed.totalCourses || 0,
                    completedCourses: parsed.completedCourses || 0,
                    lessonStreak: parsed.lessonStreak || 0,
                    questsCompleted: parsed.questsCompleted || 0,
                };
            }
        } catch (error) {
            console.error('Error loading user stats from localStorage', error);
        }
        return {
            totalCourses: 0,
            completedCourses: 0,
            lessonStreak: 0,
            questsCompleted: 0,
        };
    }, []);

    const initializeUserData = useCallback(async (user) => {
        setCurrentUser(user);
        setQuizzes([]);
        setStats(loadUserStats(user.id));

        try {
            const serverCourses = await loadUserCourses();
            const mapped = serverCourses.map((c) => {
                let progress = {};
                if (Array.isArray(c.program) && c.program.length > 0) {
                    progress = {};
                    c.program.forEach((module, index) => {
                        if (module && module.id) {
                            progress[module.id] = index === 0 ? 'unlocked' : 'locked';
                        }
                    });
                }
                return {
                    ...c,
                    id: c.id,
                    completed: false,
                    progress,
                };
            });
            setQuizzes(mapped);
        } catch (coursesError) {
            console.error('Failed to load user courses', coursesError);
        }
    }, [loadUserStats]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await fetchCurrentUser();
                if (user) {
                    await initializeUserData(user);
                }
            } catch (error) {
                console.error('Failed to check auth', error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        initAuth();
    }, [initializeUserData]);

    useEffect(() => {
        if (screen === Screen.Splash && !isCheckingAuth) {
            try {
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0]; 

                const lastVisitDateStr = localStorage.getItem('oqu-last-visit-date');

                if (lastVisitDateStr) {
                    const lastVisitDate = new Date(lastVisitDateStr);
                    const diffTime = today.setHours(0,0,0,0) - lastVisitDate.setHours(0,0,0,0);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        setStats(prev => ({ ...prev, lessonStreak: prev.lessonStreak + 1 }));
                    } else if (diffDays > 1) {
                        setStats(prev => ({ ...prev, lessonStreak: 1 }));
                    }
                } else {
                     if(stats.totalCourses > 0 || stats.completedCourses > 0){
                          setStats(prev => ({ ...prev, lessonStreak: 1 }));
                     } else {
                          setStats(prev => ({...prev, lessonStreak: 0}));
                     }
                }
                
                localStorage.setItem('oqu-last-visit-date', todayStr);

            } catch (error) {
                console.error("Error updating lesson streak", error);
            }
            
            const timer = setTimeout(() => {
                try {
                    if (!currentUser) {
                        setScreen(Screen.Auth);
                    } else {
                        const onboardingComplete = localStorage.getItem('oqu-onboarding-complete');
                        if (onboardingComplete === 'true') {
                            setScreen(Screen.Dashboard);
                        } else {
                            setScreen(Screen.Welcome);
                        }
                    }
                } catch (error) {
                    console.error("Error reading from localStorage", error);
                    if (!currentUser) {
                        setScreen(Screen.Auth);
                    } else {
                        setScreen(Screen.Welcome); 
                    }
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [screen, isCheckingAuth, currentUser, stats]);

    const navigateToScreen = useCallback((targetScreen) => {
        setScreen(targetScreen);
    }, []);

    const handleAuthSuccess = async (user) => {
        await initializeUserData(user);
        const onboardingComplete = localStorage.getItem('oqu-onboarding-complete');
        if (onboardingComplete === 'true') {
            setScreen(Screen.Dashboard);
        } else {
            setScreen(Screen.Welcome);
        }
    };

    const handleLogout = () => {
        clearToken();
        setCurrentUser(null);
        setQuizzes([]);
        setStats({
            totalCourses: 0,
            completedCourses: 0,
            lessonStreak: 0,
            questsCompleted: 0,
        });
        setScreen(Screen.Auth);
    };

    const handleStartOnboarding = () => {
        setInitialOnboardingAnswers({});
        setScreen(Screen.OnboardingIntro);
    };
    
    const handleStartOnboardingWithTopic = (topic) => {
        setQuickOnboardingTopic(topic);
        navigateToScreen(Screen.QuickOnboarding);
    };
    
    const handleStartQuestionnaire = () => setScreen(Screen.OnboardingFlow);

    const handleOnboardingComplete = async (answers) => {
        const finalAnswers = {
            ...answers,
            goal: answers.goal || 'Полезные знания'
        };
        setUserAnswers(finalAnswers);

        try {
            if (answers.goal) {
                localStorage.setItem('oqu-onboarding-complete', 'true');
            }
        } catch (error) {
            console.error("Failed to save onboarding status", error);
        }

        setLoadingMessage('Создаем ваш персональный курс...');
        setScreen(Screen.GeneratingContent);
        try {
            const generatedCourse = await generateQuizCourse(finalAnswers);
            
            let newCourse = { ...generatedCourse, id: Date.now(), completed: false };

            // If it's a structured course, initialize progress
            if (generatedCourse.program && generatedCourse.program.length > 0) {
                const initialProgress = {};
                generatedCourse.program.forEach((module, index) => {
                    initialProgress[module.id] = index === 0 ? 'unlocked' : 'locked';
                });
                newCourse.progress = initialProgress;
            }

            try {
                const saved = await saveGeneratedCourse({
                    ...generatedCourse,
                    topic: finalAnswers.topic,
                    isAiGenerated: true,
                });
                if (saved?.id) {
                    newCourse = { ...newCourse, id: saved.id };
                }
            } catch (saveError) {
                console.error('Failed to save course on server', saveError);
            }

            const newQuizzes = [...quizzes, newCourse];
            setQuizzes(newQuizzes);
            setStats(prevStats => ({ 
                ...prevStats, 
                totalCourses: newQuizzes.length,
                lessonStreak: prevStats.lessonStreak === 0 ? 1 : prevStats.lessonStreak // Start streak on first course
            }));
            setScreen(Screen.MyCourses);
        } catch (error) {
            console.error("Failed to generate quiz course:", error);
            alert(`Не удалось создать курс: ${error.message}. Пожалуйста, попробуйте еще раз.`);
            setScreen(Screen.Dashboard);
        }
    };

    const handleQuickOnboardingComplete = async ({ level, timeCommitment }) => {
        if (!quickOnboardingTopic) return;

        const answers = {
            topic: quickOnboardingTopic,
            level,
            timeCommitment,
        };
        
        await handleOnboardingComplete(answers);
        setQuickOnboardingTopic(null); 
    };
    
     const handlePathSelection = async (path) => {
        if (path === 'test') {
            setLoadingMessage('Создаем тест для определения вашего уровня...');
            setScreen(Screen.GeneratingContent);
            try {
                const generatedQuiz = await generatePlacementTest(userAnswers.topic || 'General Knowledge', userAnswers.level || 'Beginner');
                const placementTest = { ...generatedQuiz, id: Date.now(), completed: false, questions: generatedQuiz.questions.slice(0, 5) };
                setActiveQuiz(placementTest);
                setScreen(Screen.Quiz);
            } catch (error) {
                console.error("Failed to generate placement test:", error);
                alert(`Не удалось создать тест: ${error.message}. Пожалуйста, попробуйте еще раз.`);
                setScreen(Screen.Dashboard); 
            }
        } else {
             handleOnboardingComplete(userAnswers);
        }
    };
    
    const handleQuizComplete = (quizId, score, moduleId) => {
        const targetQuiz = quizzes.find(q => q.id === quizId);
        
        if (!targetQuiz || !targetQuiz.program) {
             const newQuizzes = quizzes.map(q => q.id === quizId ? { ...q, completed: true } : q);
             if (quizzes.some(q => q.id === quizId)) {
                setQuizzes(newQuizzes);
                setStats(prevStats => ({
                    ...prevStats,
                    completedCourses: newQuizzes.filter(q => q.completed).length,
                    questsCompleted: prevStats.questsCompleted + 1,
                }));
            } else {
                 setStats(prevStats => ({ ...prevStats, questsCompleted: prevStats.questsCompleted + 1 }));
            }
            setActiveQuiz(null);
            setCompletionStatus({ isCourseComplete: true });
            setScreen(Screen.QuizComplete);
            return;
        }

        const module = targetQuiz.program.find(m => m.id === moduleId);
        if (!module) return;

        const passThreshold = module.questions.length * 0.6;
        const passed = score >= passThreshold;

        const newProgress = { ...(targetQuiz.progress || {}) };
        newProgress[moduleId] = passed ? 'completed' : 'failed';

        // Unlock next module if passed
        if (passed) {
            const allModules = targetQuiz.program;
            const currentModuleIndex = allModules.findIndex(m => m.id === moduleId);
            if (currentModuleIndex < allModules.length - 1) {
                const nextModule = allModules[currentModuleIndex + 1];
                if (nextModule && nextModule.id) {
                    const currentStatus = newProgress[nextModule.id];
                    if (!currentStatus || currentStatus === 'locked') {
                        newProgress[nextModule.id] = 'unlocked';
                    }
                }
            }
        }

        let updatedQuiz = { ...targetQuiz, progress: newProgress };
        
        const allModulesCompleted = Object.values(newProgress).every(status => status === 'completed');
        if(allModulesCompleted) {
            updatedQuiz.completed = true;
            setStats(prevStats => ({
                ...prevStats,
                completedCourses: prevStats.completedCourses + 1,
                questsCompleted: prevStats.questsCompleted + 1,
            }));
        } else {
             setStats(prevStats => ({ ...prevStats, questsCompleted: prevStats.questsCompleted + 1, }));
        }

        const newQuizzes = quizzes.map(q => q.id === quizId ? updatedQuiz : q);
        setQuizzes(newQuizzes);
        
        setActiveQuiz(null);
        setActiveModule(null);
        
        setCompletionStatus({ isCourseComplete: allModulesCompleted });
        setScreen(Screen.QuizComplete);
    };

    const handleFinishQuiz = () => setScreen(Screen.MyCourses);
    
    const handleViewLesson = (quiz, moduleId) => {
        const module = quiz.program.find(m => m.id === moduleId);
        if (!module) {
            console.error("Module not found!");
            return;
        }
        setActiveModule({ quiz, module });
        navigateToScreen(Screen.Lesson);
    };
    
    const handleStartModuleTest = (quiz, moduleId) => {
        const module = quiz.program.find(m => m.id === moduleId);
        if (!module) {
            console.error("Module not found!");
            return;
        }

        const moduleQuiz = {
            ...quiz,
            questions: module.questions,
            title: `${quiz.title} - Тест`,
            moduleId,
        };
        
        setActiveQuiz(moduleQuiz);
        navigateToScreen(Screen.Quiz);
    };

    const handleCreateNewCourse = () => {
        navigateToScreen(Screen.CreateCourse);
    };

    const handleDeleteCourse = (quizIdToDelete) => {
        const quizToDelete = quizzes.find(q => q.id === quizIdToDelete);
        if (!quizToDelete) return;

        const newQuizzes = quizzes.filter(q => q.id !== quizIdToDelete);
        setQuizzes(newQuizzes);

        setStats(prevStats => ({
            ...prevStats,
            totalCourses: newQuizzes.length,
            completedCourses: quizToDelete.completed 
                ? prevStats.completedCourses - 1 
                : prevStats.completedCourses,
        }));
    };

    useEffect(() => {
        if (!currentUser) return;
        try {
            localStorage.setItem(`oqu-stats-${currentUser.id}`, JSON.stringify(stats));
        } catch (error) {
            console.error('Error saving stats to localStorage', error);
        }
    }, [stats, currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        try {
            localStorage.setItem(`oqu-quizzes-${currentUser.id}`, JSON.stringify(quizzes));
        } catch (error) {
            console.error('Error saving quizzes to localStorage', error);
        }
    }, [quizzes, currentUser]);

    useEffect(() => {
        const sync = async () => {
            if (!currentUser) return;
            try {
                await syncQuests(stats);
            } catch (error) {
                console.error('Failed to sync quests', error);
            }
        };
        sync();
    }, [stats, currentUser]);

    const renderScreen = () => {
        switch (screen) {
            case Screen.Splash:
                return <SplashScreen />;
            case Screen.Auth:
                return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
            case Screen.Welcome:
                return <WelcomeScreen onStart={handleStartOnboarding} />;
            case Screen.OnboardingIntro:
                return <OnboardingIntroScreen onNext={handleStartQuestionnaire} />;
            case Screen.OnboardingFlow:
                return <OnboardingFlow onComplete={handleOnboardingComplete} initialAnswers={initialOnboardingAnswers} />;
            case Screen.CreateCourse:
                 return <CreateCourseScreen onComplete={handleOnboardingComplete} onExit={() => navigateToScreen(Screen.MyCourses)} />;
            case Screen.QuickOnboarding:
                return quickOnboardingTopic && <QuickOnboardingScreen topic={quickOnboardingTopic} onComplete={handleQuickOnboardingComplete} onBack={() => navigateToScreen(Screen.Dashboard)} />;
            case Screen.PathSelection:
                 return <PathSelectionScreen onSelect={handlePathSelection} />;
            case Screen.GeneratingContent:
                return <GeneratingContentScreen message={loadingMessage} />;
            case Screen.Lesson:
                return activeModule && <LessonScreen 
                            course={activeModule.quiz}
                            module={activeModule.module} 
                            onStartTest={() => handleStartModuleTest(activeModule.quiz, activeModule.module.id)}
                            onBack={() => navigateToScreen(Screen.MyCourses)}
                        />;
            case Screen.Quiz:
                return activeQuiz && <QuizScreen quiz={activeQuiz} onComplete={(score) => handleQuizComplete(activeQuiz.id, score, activeQuiz.moduleId)} onExit={handleFinishQuiz} />;
            case Screen.QuizComplete:
                return <QuizCompleteScreen onFinish={handleFinishQuiz} isCourseComplete={completionStatus.isCourseComplete} />;
            case Screen.Dashboard:
                return (
                    <Dashboard
                        navigate={navigateToScreen}
                        stats={stats}
                        startOnboardingWithTopic={handleStartOnboardingWithTopic}
                        currentUser={currentUser}
                        onLogout={handleLogout}
                    />
                );
            case Screen.MyCourses:
                return <MyCoursesScreen 
                            navigate={navigateToScreen} 
                            quizzes={quizzes} 
                            viewLesson={handleViewLesson} 
                            createNewCourse={handleCreateNewCourse} 
                            deleteCourse={handleDeleteCourse} 
                        />
            case Screen.Quests:
                return <QuestsScreen navigate={navigateToScreen} />;
            default:
                return <WelcomeScreen onStart={handleStartOnboarding} />;
        }
    };

    return (
        <div className="w-full min-h-screen bg-white max-w-md mx-auto font-sans">
            {renderScreen()}
        </div>
    );
};

export default App;
