document.addEventListener('DOMContentLoaded', function () {
    function ensureQuizzesExist() {
        if (!localStorage.getItem('quizzes')) {
            const quizzes = [
                {
                    id: "quiz1",
                    title: "Math",
                    questions: [
                        {
                            question: "What is 2 + 2?",
                            choices: ["3", "4", "5"],
                            correctAnswer: "4",
                            grade: 1
                        },
                        {
                            question: "What is 5 x 3?",
                            choices: ["8", "15", "10"],
                            correctAnswer: "15",
                            grade: 1
                        },
                        {
                            question: "Square root of 16?",
                            choices: ["4", "6", "8"],
                            correctAnswer: "4",
                            grade: 1
                        }
                    ]
                },
                {
                    id: "quiz2",
                    title: "Science",
                    questions: [
                        {
                            question: "What is H2O?",
                            choices: ["Water", "Oxygen", "Hydrogen"],
                            correctAnswer: "Water",
                            grade: 1
                        },
                        {
                            question: "Earth's shape?",
                            choices: ["Flat", "Round", "Cube"],
                            correctAnswer: "Round",
                            grade: 1
                        },
                        {
                            question: "Sun is a?",
                            choices: ["Planet", "Star", "Moon"],
                            correctAnswer: "Star",
                            grade: 1
                        }
                    ]
                },
                {
                    id: "quiz3",
                    title: "Coding",
                    questions: [
                        {
                            question: "Which tag defines JavaScript in HTML?",
                            choices: ["<js>", "<script>", "<javascript>"],
                            correctAnswer: "<script>",
                            grade: 1
                        },
                        {
                            question: "What does CSS stand for?",
                            choices: ["Color Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
                            correctAnswer: "Cascading Style Sheets",
                            grade: 1
                        },
                        {
                            question: "Symbol for JS comments?",
                            choices: ["//", "/*", "#"],
                            correctAnswer: "//",
                            grade: 1
                        }
                    ]
                }
            ];
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
        }
    }

    ensureQuizzesExist();
});
