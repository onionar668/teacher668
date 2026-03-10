import { GoogleGenAI, Type } from "@google/genai";
import { allTopics, allTopicsLowerCase } from './topics.js';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * A wrapper function to call the Gemini API with a retry mechanism.
 * @param {object} generationConfig - The configuration object for the generateContent call.
 * @param {number} [maxRetries=3] - The maximum number of retry attempts.
 * @returns {Promise<GenerateContentResponse>} - The response from the API.
 */
const callGeminiWithRetry = async (generationConfig, maxRetries = 3) => {
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {
        try {
            const response = await ai.models.generateContent(generationConfig);
            return response; 
        } catch (error) {
            attempt++;
            console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`, error.message);
            if (attempt >= maxRetries) {
                console.error(`Failed to call Gemini API after ${maxRetries} attempts:`, error);
                throw error; 
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; 
        }
    }
};


const programSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING, description: "A short, engaging description of the course topic." },
        introduction: { type: Type.STRING, description: "A brief introduction about the course subject itself (2-3 sentences). For example, for Python, explain what Python is and its common uses." },
        program: {
            type: Type.ARRAY,
            description: "The structured program of the course, divided into modules. Each module has a theory block (Урок). Do NOT generate questions here.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Title of the module, e.g., 'Модуль 1: Основы'" },
                    theory: { type: Type.STRING, description: "A detailed theoretical block of text (about 200-300 words) that provides the necessary information for the user to understand the topic of this module. This text is the 'Урок'." },
                },
                required: ["title", "theory"]
            }
        }
    },
    required: ["title", "description", "program", "introduction"]
};

const moduleQuestionsSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of questions for this specific module's test.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    codeSnippet: { type: Type.STRING, description: "Optional code snippet relevant to the question" },
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING, description: "A brief explanation of why the correct answer is correct." }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
            }
        }
    },
    required: ["questions"]
};


export const validateTopic = async (topic) => {
    if (!topic || topic.trim().length < 1) {
        return false;
    }
    
    if (allTopicsLowerCase.includes(topic.trim().toLowerCase())) {
        return true;
    }

    const prompt = `
    You are a topic validation expert. I need to determine if a user's input is a valid topic for an educational course.
    A valid topic is a well-known spoken language, programming language, framework, library, or technology.
    Here is a comprehensive list of allowed topics for reference: ${allTopics.join(', ')}.

    The user's input is: "${topic}".

    Is this a valid topic based on the list or common knowledge of similar topics? Please check for variations and different spellings (e.g., "испанскому языку" for "испанский", "ReactJS" for "React").
    Respond with only the word "yes" or "no".
    `;

    try {
        const response = await callGeminiWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                maxOutputTokens: 5,
                temperature: 0.0,
            }
        });
        const resultText = response.text.trim().toLowerCase();
        return resultText.includes("yes");
    } catch (error) {
        console.error("Error validating topic with AI:", error);
        return false; 
    }
};


export const generatePlacementTest = async (topic, level) => {
    const prompt = `Generate a 5-question multiple-choice quiz about ${topic} for a person with a ${level} skill level to test their knowledge. For each question, provide one correct answer and a brief explanation for why that answer is correct. Include code snippets where relevant. The user is Russian-speaking. All content must be in Russian.`;

    try {
        const response = await callGeminiWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { 
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    codeSnippet: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correctAnswer: { type: Type.STRING },
                                    explanation: { type: Type.STRING, description: "A brief explanation of why the correct answer is correct." }
                                },
                                required: ["question", "options", "correctAnswer", "explanation"]
                            }
                        }
                    },
                    required: ["title", "questions"]
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating placement test:", error);
        throw new Error("Failed to generate quiz content from AI.");
    }
};

const achievementsSchema = {
    type: Type.OBJECT,
    properties: {
        achievements: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["title", "description"]
            },
            minItems: 3,
            maxItems: 3,
        }
    },
    required: ["achievements"]
};

export const generateAchievements = async (answers) => {
    const { topic, level, goal, timeCommitment } = answers;
    const prompt = `A user wants to start a personalized learning course. Based on their answers, generate 3 short, realistic, and motivational achievements they can expect to reach in 28 days of study.
The user is Russian-speaking. All content (titles, descriptions) must be in Russian.
The output must be in JSON format, containing an array of exactly 3 achievement objects.

User's details:
- Topic to learn: "${topic}"
- Current knowledge level: "${level}"
- Learning goal: "${goal}"
- Time commitment: "${timeCommitment}"

Example for "Python", "Новичок", "Карьера":
{
  "achievements": [
    { "title": "Освоите основы синтаксиса", "description": "Вы научитесь писать простые скрипты, работать с переменными, циклами и функциями." },
    { "title": "Решите первые задачи", "description": "Сможете решать базовые алгоритмические задачи, которые заложат фундамент для собеседований." },
    { "title": "Создадите мини-проект", "description": "Напишете небольшую программу, например, калькулятор или текстовую игру, чтобы применить знания на практике." }
  ]
}`;

    try {
        const response = await callGeminiWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: achievementsSchema,
            }
        });
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        if (parsedResponse.achievements && parsedResponse.achievements.length === 3) {
            return parsedResponse.achievements;
        } else {
             throw new Error("Invalid format for achievements received from AI.");
        }
    } catch (error) {
        console.error("Error generating achievements:", error);
        return [
            { title: "Быстрый результат и мотивация", description: "За 28 дней вы можете освоить базовые навыки и почувствовать прогресс." },
            { title: "Минимальные затраты времени", description: "Вы учитесь эффективно, сразу применяя знания на практике." },
            { title: "Фундамент для развития", description: "После обучения легче осваивать сложные темы и развивать экспертизу." }
        ];
    }
};


const generateCourseProgram = async (topic, level, goal, timeCommitment, moduleCount) => {
     const prompt = `Create a personalized learning course program structure about "${topic}".
    The user's details are:
    - Knowledge level: "${level}"
    - Learning goal: "${goal}"
    - Study time: "${timeCommitment}"
    The user is Russian-speaking. ALL content must be in Russian.

    The course must be structured into a program with exactly ${moduleCount} modules. Each module represents a complete learning unit containing theory (Урок).

    The entire output MUST be in JSON format and adhere to the provided schema.
    
    Your task is to generate:
    1. A "title" for the course: "Курс по «${topic}»".
    2. A "description": A short, engaging description of what the user will learn in this specific course.
    3. An "introduction": A brief introduction (2-3 sentences) about the subject matter itself.
    4. A "program" array, structured into ${moduleCount} modules.
        - Each module object must have a "title" (e.g., "Модуль 1: Введение в синтаксис").
        - Each module object must have a "theory": A detailed theoretical block of text (about 200-300 words) that provides the necessary information for the user to understand the topic of this module. This text is the 'Урок'.
    
    IMPORTANT: Do NOT generate the actual questions for the tests in this step. Only generate the course structure with modules and their theory.
    `;
    
    const response = await callGeminiWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: programSchema,
        }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};


const generateModuleQuestions = async (courseTopic, userLevel, moduleTitle, moduleTheory, questionsPerModule) => {
    const prompt = `Generate exactly ${questionsPerModule} multiple-choice test questions for a module within a course. These questions will form a test (Тест) for the user after they have studied the module's theory.
    - Course Topic: "${courseTopic}"
    - User's Knowledge Level: "${userLevel}"
    - Current Module Title: "${moduleTitle}"
    - Module Theory (Урок): "${moduleTheory}"
    
    The user is Russian-speaking. ALL content (questions, options, explanations) must be in Russian.
    For each question, provide a question text, four options, the correct answer, and a brief explanation. Include code snippets where relevant.

    **CRITICAL RULE: The questions must be based ENTIRELY on the provided "Module Theory". Do not introduce concepts not mentioned in the theory text.**
    **IMPORTANT RULE: The question text and the code snippet must NEVER contain or reveal the correct answer. The user must be able to solve the question only by reasoning about the provided options.**
    
    The entire output must be a JSON object containing a "questions" array.
    `;
    
    try {
        const response = await callGeminiWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: moduleQuestionsSchema,
            }
        });
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);
        return parsedResult.questions || [];
    } catch (error) {
        console.error(`Failed to generate questions for module "${moduleTitle}" after all retries:`, error);
        return []; }
};

export const generateQuizCourse = async (answers) => {
    const { topic, level, goal, timeCommitment } = answers;

    const getQuestionsPerModule = () => {
        switch (timeCommitment) {
            case '5 минут в день': return 3;
            case '10 минут в день': return 5;
            case '15 минут в день': return 7;
            case '20 минут в день': return 8;
            default: return 5;
        }
    };
    const questionsPerModule = getQuestionsPerModule();

    const getModuleCount = () => {
        switch (timeCommitment) {
            case '5 минут в день':
            case '10 минут в день':
                return 3;
            case '15 минут в день':
            case '20 минут в день':
                return 4;
            default:
                return 3;
        }
    };
    const moduleCount = getModuleCount();

    try {
        const courseStructure = await generateCourseProgram(topic, level, goal, timeCommitment, moduleCount);

        let totalQuestions = 0;

        for (const [index, module] of courseStructure.program.entries()) {
            module.id = `module-${index + 1}`;
            
            const moduleQuestions = await generateModuleQuestions(topic, level, module.title, module.theory, questionsPerModule);
            
            if (moduleQuestions.length > 0) {
                module.questions = moduleQuestions;
                totalQuestions += moduleQuestions.length;
            } else {
                module.questions = [];
            }
        }
        

        courseStructure.program = courseStructure.program.filter(module => module.questions.length > 0);
        
        if (totalQuestions === 0) {
            throw new Error("AI failed to generate any questions for the course.");
        }
        
        return courseStructure;

    } catch (error) {
        console.error("Error generating quiz course:", error);
        throw new Error("Failed to generate course content from AI.");
    }
};