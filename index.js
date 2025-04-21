document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#loginForm');
    const signupForm = document.querySelector('#signupForm');

    setupPasswordVisibilityToggle();
    setupForgotPasswordAlert();
    ensureAdminUser();

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    function ensureAdminUser() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const adminExists = users.some(user => user.email === 'admin@quiz.com');

        if (!adminExists) {
            users.push({
                name: 'Admin',
                email: 'admin@quiz.com',
                password: 'admin123',
                isAdmin: true,
                scores: {}
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function handleLogin(e) {
        e.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
            }));

            window.location.href = user.isAdmin ? 'dashboard.html' : 'home.html';
        } else {
            alert('Invalid email or password');
            loginForm.password.value = '';
        }
    }

    function handleSignup(e) {
        e.preventDefault();

        const name = signupForm.name.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value;

        if (!validateSignupInputs(name, email, password)) return;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.email === email)) {
            alert('This email is already registered');
            return;
        }

        const newUser = {
            name,
            email,
            password,
            isAdmin: false,
            scores: {}
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('currentUser', JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            isAdmin: false
        }));

        alert('Signup successful! Redirecting to home page...');
        window.location.href = 'home.html';
    }

    function validateSignupInputs(name, email, password) {
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return false;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (password.length < 6) {
            alert('Password should be at least 6 characters long');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function setupPasswordVisibilityToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function () {
                const input = button.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    button.classList.remove('fa-eye');
                    button.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    button.classList.remove('fa-eye-slash');
                    button.classList.add('fa-eye');
                }
            });
        });
    }

    function setupForgotPasswordAlert() {
        const forgotLink = document.querySelector('.loginForm .text a');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert("Password reset is not available in this version. Please contact the Admin or sign up with a new account.");
            });
        }
    }
});
