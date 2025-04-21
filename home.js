document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcome-message').textContent = `Hello, ${currentUser.name}!`;

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quizListContainer = document.getElementById('quiz-list');  // Reference to the quiz list container.

    // Get the list of completed quizzes from localStorage
    const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || [];

    // Clear the quiz list to avoid duplicates if it already has content
    quizListContainer.innerHTML = '';

    if (quizzes.length === 0) {
        quizListContainer.innerHTML = '<p>No quizzes available yet.</p>';
        return;
    }

    // Creating the quiz cards and appending them
    quizzes.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card'; // Apply the quiz-card styling
        quizCard.id = `quiz-card-${quiz.id}`;  // Use quiz id to target it

        const totalQuestions = quiz.questions.length;
        const totalGrade = quiz.questions.reduce((sum, q) => sum + (q.grade || 0), 0);

        quizCard.innerHTML = `
            <h3>${quiz.title} Quiz</h3>
            <p>${totalQuestions} questions</p>
            <p>Total Grade: ${totalGrade}</p>
        `;

   

        // Event listener for card click
        quizCard.addEventListener('click', () => {
            window.location.href = `quiz.html?quizId=${quiz.id}`;
        });

        // Append the card to the quiz list container
        quizListContainer.appendChild(quizCard);
    });
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
