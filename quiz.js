document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const quizContent = document.getElementById('quiz-content');
    const timerDisplay = document.getElementById('timer-display');

    let timerInterval;

    // Validate quiz ID
    if (!quizId) {
        quizContent.innerHTML = '<h2>No quiz selected</h2>';
        return;
    }

    // Retrieve quizzes
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        quizContent.innerHTML = '<h2>Quiz not found</h2>';
        return;
    }

    // Retrieve the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Retrieve completed quizzes for the current user
    const scores = JSON.parse(localStorage.getItem('scores')) || {};
    const userScores = scores[currentUser.email] || {};

    // Check if the quiz has already been completed
    if (userScores[quizId]) {
        quizContent.innerHTML = `
            <h2>${quiz.title} Quiz</h2>
            <h3>You have already completed this quiz.</h3>
            <p>Your Score: ${userScores[quizId]}</p>
        `;
        return;
    }

    // Create quiz container
    const container = document.createElement('div');
    container.className = 'quiz-container';

    // Quiz Title
    const title = document.createElement('h2');
    title.textContent = `${quiz.title} Quiz`;
    container.appendChild(title);

    // Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    container.appendChild(progressBar);

    // Quiz Form
    const form = document.createElement('form');
    form.id = 'quiz-form';

    quiz.questions.forEach((question, index) => {
        const questionWrapper = document.createElement('div');
        questionWrapper.className = 'question-block';

        const qText = document.createElement('h4');
        qText.textContent = `${index + 1}. ${question.question}`;
        questionWrapper.appendChild(qText);

        question.choices.forEach(option => {
            const label = document.createElement('label');
            label.style.display = 'block';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${index}`;
            input.value = option;

            label.appendChild(input);
            label.appendChild(document.createTextNode(option));
            questionWrapper.appendChild(label);
        });

        form.appendChild(questionWrapper);
    });

    // Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    form.appendChild(submitBtn);

    // Result Display
    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'result';
    container.appendChild(form);
    container.appendChild(resultDisplay);

    quizContent.appendChild(container);

    // Timer Initialization
    let timer = 30;

    function startTimer() {
        timerDisplay.textContent = `Time Remaining: ${timer} seconds`;
        timerInterval = setInterval(() => {
            timer--;
            if (timer <= 0) {
                clearInterval(timerInterval);
                form.submit(); // Auto-submit when timer runs out
            }
            timerDisplay.textContent = `Time Remaining: ${timer} seconds`;
        }, 1000);
    }

    // Progress Bar Update
    function updateProgressBar() {
        const totalQuestions = quiz.questions.length;
        const answeredQuestions = Array.from(form.elements)
            .filter(el => el.checked).length;
        const progress = (answeredQuestions / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Form Submission Handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearInterval(timerInterval);

        let score = 0;

        // Calculate Score
        quiz.questions.forEach((question, index) => {
            const selected = form.querySelector(`input[name="question-${index}"]:checked`);
            if (selected && selected.value === question.correctAnswer) {
                score += question.grade || 1;
            }
        });

        // Display Result
        resultDisplay.innerHTML = `<h3>Your Score: ${score} / ${quiz.questions.length}</h3>`;

        // Save Scores
        if (!scores[currentUser.email]) {
            scores[currentUser.email] = {};
        }
        scores[currentUser.email][quizId] = score;

        localStorage.setItem('scores', JSON.stringify(scores));

        // Redirect to Home Page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    });

    // Update Progress Bar on Change
    form.addEventListener('change', updateProgressBar);

    startTimer();
});
