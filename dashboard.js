document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Only allow admin access
    if (!currentUser || currentUser.email !== "admin@quiz.com") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("admin-info").textContent = `Welcome, ${currentUser.name}`;

    // Get users, quizzes, and scores from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const scores = JSON.parse(localStorage.getItem("scores")) || {};

    // Prepare the table head
    const tableHeadRow = document.getElementById("table-head-row");

    // Remove any old quiz columns (after Name and Email)
    while (tableHeadRow.children.length > 2) {
        tableHeadRow.removeChild(tableHeadRow.lastChild);
    }

    // Add a header column for each quiz
    quizzes.forEach(quiz => {
        const th = document.createElement("th");
        th.textContent = quiz.title;
        tableHeadRow.appendChild(th);
    });

    const tableBody = document.querySelector("#user-scores-table tbody");
    tableBody.innerHTML = "";

    // Loop through each non-admin user
    users.forEach(user => {
        if (user.email === "admin@quiz.com") return; // Skip admin

        const tr = document.createElement("tr");

        // User Name
        const nameTd = document.createElement("td");
        nameTd.textContent = user.name;
        tr.appendChild(nameTd);

        // Email
        const emailTd = document.createElement("td");
        emailTd.textContent = user.email;
        tr.appendChild(emailTd);

        // Quiz scores
        quizzes.forEach(quiz => {
            const scoreTd = document.createElement("td");
            const userScores = scores[user.email] || {};
            const quizScoreEntry = userScores[quiz.id];

            scoreTd.textContent = quizScoreEntry ? quizScoreEntry.score : "0";
            tr.appendChild(scoreTd);
        });

        //  Append the row to the table body
        tableBody.appendChild(tr);
    });
});

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
