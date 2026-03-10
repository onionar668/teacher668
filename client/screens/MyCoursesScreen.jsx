import React, { useState } from "react";
import PropTypes from "prop-types";
import { Screen, QuizPropType } from "../types.js";
import BottomNav from "../components/BottomNav.jsx";
import Button from "../components/Button.jsx";

const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
ChevronDownIcon.propTypes = { isOpen: PropTypes.bool.isRequired };

const CourseProgram = ({ quiz, onModuleSelect }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <CheckIcon />
          </div>
        );
      case "failed":
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <CrossIcon />
          </div>
        );
      case "locked":
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <LockIcon />
          </div>
        );
      default: // unlocked
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <BookOpenIcon />
          </div>
        );
    }
  };

  const safeProgram = Array.isArray(quiz.program) ? quiz.program : [];

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      <h4 className="font-bold text-xl text-gray-800">Программа курса</h4>
      <div className="space-y-2">
        {safeProgram.map((module, index) => {
          const progress = quiz.progress || {};
          const baseStatus =
            progress[module.id] ||
            (index === 0 ? "unlocked" : "locked");
          const status = baseStatus || (index === 0 ? "unlocked" : "locked");
          const isLocked = status === "locked";

          return (
            <button
              key={module.id}
              onClick={() => !isLocked && onModuleSelect(quiz, module.id)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all duration-200 ${
                isLocked
                  ? "bg-gray-100 border-transparent cursor-not-allowed"
                  : "bg-white border-[#02fa1b]/40 hover:border-[#02fa1b] hover:bg-[#02fa1b]/10"
              }`}
            >
              {getStatusIcon(status)}
              <div className="text-left">
                <p
                  className={`font-semibold ${
                    isLocked ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {module.title}
                </p>
              </div>
              {status === "failed" && (
                <span className="ml-auto text-xs font-bold text-red-500 pr-2">
                  ПЕРЕСДАТЬ
                </span>
              )}
              {status === "completed" && (
                <span className="ml-auto text-xs font-bold text-green-500 pr-2">
                  ПРОЙДЕНО
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
CourseProgram.propTypes = {
  quiz: QuizPropType.isRequired,
  onModuleSelect: PropTypes.func.isRequired,
};

const MyCoursesScreen = ({
  navigate,
  quizzes,
  viewLesson,
  createNewCourse,
  deleteCourse,
}) => {
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const handleDelete = (quizId, quizTitle) => {
    if (window.confirm(`Вы уверены, что хотите удалить курс "${quizTitle}"?`)) {
      deleteCourse(quizId);
    }
  };

  const handleToggleDescription = (quizId) => {
    setExpandedCourseId((prevId) => (prevId === quizId ? null : quizId));
  };

  const getTotalQuestions = (quiz) => {
    if (!quiz.program) return quiz.questions?.length || 0;
    return quiz.program.reduce(
      (total, module) => total + (module.questions?.length || 0),
      0
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-20">
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#02fa1b] text-white rounded-lg flex items-center justify-center">
            <img src="/myCourse-icon.svg" alt="" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Мои курсы</h2>
          </div>
          <button
            onClick={createNewCourse}
            className="w-12 h-12 bg-[#02fa1b] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#02fa1b] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow px-6 overflow-y-auto">
        {quizzes.length > 0 ? (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-800 pr-2">
                          {quiz.title}
                        </h3>
                        {(quiz.introduction ||
                          quiz.program ||
                          quiz.description) && (
                          <button
                            onClick={() => handleToggleDescription(quiz.id)}
                            className="hover:bg-gray-100 rounded-full p-1 -mr-1"
                          >
                            <ChevronDownIcon
                              isOpen={expandedCourseId === quiz.id}
                            />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {getTotalQuestions(quiz)} вопросов
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(quiz.id, quiz.title)}
                      className="text-gray-400 hover:text-red-500 p-1 ml-2 flex-shrink-0"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                {expandedCourseId === quiz.id && (
                  <div className="border-t border-gray-200">
                    {quiz.introduction && (
                      <div className="p-4 animate-fadeIn border-b border-gray-200">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                          О курсе
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {quiz.introduction}
                        </p>
                      </div>
                    )}
                    {quiz.program ? (
                      <CourseProgram quiz={quiz} onModuleSelect={viewLesson} />
                    ) : (
                      <div className="p-4 bg-gray-50">
                        <Button
                          onClick={() =>
                            alert(
                              "This is an old course format and needs to be updated."
                            )
                          }
                          disabled={quiz.completed}
                        >
                          {quiz.completed ? "Пройден" : "Продолжить обучение"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Здесь пока пусто
            </h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              У вас еще нет созданных курсов. Давайте создадим ваш первый
              персональный курс!
            </p>
            <Button onClick={createNewCourse}>Создать новый курс</Button>
          </div>
        )}
      </main>

      <BottomNav activeScreen={Screen.MyCourses} navigate={navigate} />
    </div>
  );
};

MyCoursesScreen.propTypes = {
  navigate: PropTypes.func.isRequired,
  quizzes: PropTypes.arrayOf(QuizPropType).isRequired,
  viewLesson: PropTypes.func.isRequired,
  createNewCourse: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
};

export default MyCoursesScreen;
