import PropTypes from 'prop-types';

export const Screen = Object.freeze({
    Splash: 'Splash',
    Auth: 'Auth',
    Welcome: 'Welcome',
    OnboardingIntro: 'OnboardingIntro',
    OnboardingFlow: 'OnboardingFlow',
    CreateCourse: 'CreateCourse',
    PathSelection: 'PathSelection',
    GeneratingContent: 'GeneratingContent',
    Lesson: 'Lesson',
    Quiz: 'Quiz',
    QuizComplete: 'QuizComplete',
    Dashboard: 'Dashboard',
    MyCourses: 'MyCourses',
    Quests: 'Quests',
    QuickOnboarding: 'QuickOnboarding'
});

export const UserAnswersPropType = PropTypes.shape({
    topic: PropTypes.string,
    level: PropTypes.string,
    goal: PropTypes.string,
    timeCommitment: PropTypes.string,
});

export const QuizQuestionPropType = PropTypes.shape({
    question: PropTypes.string.isRequired,
    codeSnippet: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.string.isRequired,
    explanation: PropTypes.string,
});

const ProgramModulePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    theory: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(QuizQuestionPropType).isRequired,
});


export const QuizPropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    introduction: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    program: PropTypes.arrayOf(ProgramModulePropType),
    progress: PropTypes.objectOf(PropTypes.oneOf(['locked', 'unlocked', 'completed', 'failed'])),
});

export const StatsPropType = PropTypes.shape({
    totalCourses: PropTypes.number.isRequired,
    completedCourses: PropTypes.number.isRequired,
    lessonStreak: PropTypes.number.isRequired,
    questsCompleted: PropTypes.number.isRequired,
});
