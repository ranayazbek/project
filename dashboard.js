document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Restrict non-admin access
    if (!currentUser || currentUser.email !== "admin@quiz.com") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("admin-info").textContent = `Welcome, ${currentUser.name}`;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const scores = JSON.parse(localStorage.getItem("scores")) || {};

    const tableHeadRow = document.getElementById("table-head-row");
    while (tableHeadRow.children.length > 2) {
        tableHeadRow.removeChild(tableHeadRow.lastChild);
    }

    // Add quiz titles to the table header
    quizzes.forEach(quiz => {
        const th = document.createElement("th");
        th.textContent = quiz.title;
        tableHeadRow.appendChild(th);
    });

    const tableBody = document.querySelector("#user-scores-table tbody");
    tableBody.innerHTML = "";

    // Calculate total scores for each user and sort by total scores
    const usersWithTotalScores = users
        .filter(user => user.email !== "admin@quiz.com") // Exclude admin
        .map(user => {
            const userScores = scores[user.email] || {};
            const totalScore = quizzes.reduce((sum, quiz) => {
                return sum + (userScores[quiz.id] || 0); // Add score for each quiz
            }, 0);
            return { ...user, totalScore };
        })
        .sort((a, b) => b.totalScore - a.totalScore); // Sort by total scores (highest to lowest)

    // Populate the table with sorted user data
    usersWithTotalScores.forEach(user => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = user.name;
        tr.appendChild(nameTd);

        const emailTd = document.createElement("td");
        emailTd.textContent = user.email;
        tr.appendChild(emailTd);

        quizzes.forEach(quiz => {
            const scoreTd = document.createElement("td");
            const userScores = scores[user.email] || {}; // Retrieve scores for the user
            const quizScore = userScores[quiz.id] || 0; // Get the score for the quiz, default to 0

            scoreTd.textContent = quizScore;
            tr.appendChild(scoreTd);
        });

        // Append the row to the table body
        tableBody.appendChild(tr);
    });
});

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

