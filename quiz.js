document.addEventListener('DOMContentLoaded', function () {
    

    // Get quizId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    if (!quizId) {
        document.getElementById('quiz-content').innerHTML = '<h2>No quiz selected</h2>';
        return;
    }

    // Retrieve quizzes from localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
        document.getElementById('quiz-content').innerHTML = '<h2>Quiz not found</h2>';
        return;
    }

    // Create and display the quiz content
    const container = document.createElement('div');
    container.className = 'quiz-container';

    const title = document.createElement('h2');
    title.textContent = quiz.title + ' Quiz';
    container.appendChild(title);

    const form = document.createElement('form');
    form.id = 'quiz-form';

    quiz.questions.slice(0, 3).forEach((question, index) => {
        const questionWrapper = document.createElement('div');
        questionWrapper.className = 'question-block';

        const qText = document.createElement('h4');
        qText.textContent = `${index + 1}. ${question.question}`;
        questionWrapper.appendChild(qText);

        question.choices.forEach((option, i) => {
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

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    form.appendChild(submitBtn);

    const resultDisplay = document.createElement('div');
    resultDisplay.id = 'result';
    container.appendChild(form);
    container.appendChild(resultDisplay);

    document.getElementById('quiz-content').appendChild(container);

    // Check if user already attended the quiz
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';  // Redirect to login page if no current user
        return;
    }

    const allScores = JSON.parse(localStorage.getItem('scores')) || {};
    if (allScores[currentUser.email] && allScores[currentUser.email][quizId]) {
        resultDisplay.innerHTML = '<h3>You have already completed this quiz.</h3>';
        form.style.display = 'none';  // Hide the form if quiz is already completed
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let score = 0;
        const total = Math.min(3, quiz.questions.length);

        quiz.questions.slice(0, 3).forEach((question, index) => {
            const selected = form.querySelector(`input[name="question-${index}"]:checked`);
            if (selected && selected.value === question.correctAnswer) {
                score += question.grade || 1;
            }
        });

        resultDisplay.innerHTML = `<h3>Your Score: ${score}</h3>`;

        // Update the user's score in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            const user = users[userIndex];
            if (!user.scores) {
                user.scores = {};
            }
            user.scores[quizId] = score;  // Save score for the current quiz
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update the scores in localStorage (for quiz history)
        if (!allScores[currentUser.email]) {
            allScores[currentUser.email] = {};
        }
        allScores[currentUser.email][quiz.id] = {
            title: quiz.title,
            score: score,
            total: total
        };
        localStorage.setItem('scores', JSON.stringify(allScores));

     

        // Store completed quiz info
        let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || [];
        if (!completedQuizzes.includes(quizId)) {
            completedQuizzes.push(quizId);
            localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
        }

        // Redirect to home page after submission
        setTimeout(function () {
            window.location.href = 'home.html';
        }, 2000);  // Delay the redirect to give the user time to see the score
    });
});
