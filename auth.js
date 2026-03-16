document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginIdentifierInput = document.getElementById('login-identifier');
    const loginPasswordInput = document.getElementById('login-password');
    const signupUsernameInput = document.getElementById('signup-username');
    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const loginErrorDiv = document.getElementById('login-error');
    const signupErrorDiv = document.getElementById('signup-error');
    const togglePassword = document.getElementById('toggle-password');
    const rememberMe = document.getElementById('remember-me');

    // Password visibility toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            // Toggle the icon
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-eye-slash');
            icon.classList.toggle('bi-eye');
        });
    }
    
    // Load saved credentials if they exist
    if (localStorage.getItem('rememberMe') === 'true') {
        loginIdentifierInput.value = localStorage.getItem('loginIdentifier') || '';
        loginPasswordInput.value = localStorage.getItem('loginPassword') || '';
        rememberMe.checked = true;
    }

    // Reset Password Elements
    const resetForm = document.getElementById('reset-form');
    const resetEmailInput = document.getElementById('reset-email');
    const resetPasswordInput = document.getElementById('reset-password');
    const resetErrorDiv = document.getElementById('reset-error');
    const resetSuccessDiv = document.getElementById('reset-success');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login-link');
    const resetTabButton = document.getElementById('pills-reset-tab');
    const loginTabButton = document.getElementById('pills-login-tab');

    // Reset all forms and messages on page load for a "clean" state
    const clearAllForms = () => {
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
        if (resetForm) resetForm.reset();
        if (loginErrorDiv) loginErrorDiv.textContent = '';
        if (signupErrorDiv) signupErrorDiv.textContent = '';
        if (resetErrorDiv) resetErrorDiv.textContent = '';
        if (resetSuccessDiv) resetSuccessDiv.textContent = '';
    };

    clearAllForms();

    // Clear forms whenever any tab is shown (Login, Signup, or Reset)
    document.querySelectorAll('button[data-bs-toggle="pill"]').forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', () => {
            clearAllForms();
        });
    });

    // Redirect if already logged in
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    const handleLoginSuccess = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        window.location.href = 'index.html';
    };

    // --- Event Listeners ---

    // Forgot Password Link
    if (forgotPasswordLink && resetTabButton) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const resetTab = new bootstrap.Tab(resetTabButton);
            resetTab.show();
        });
    }

    // Back to Login Link
    if (backToLoginLink && loginTabButton) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            const loginTab = new bootstrap.Tab(loginTabButton);
            loginTab.show();
        });
    }

    // Reset Password Form Submission
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Two-step confirmation via popup
            if (!confirm('Are you sure you want to reset your password? This action cannot be undone.')) {
                return;
            }

            // Proceed with reset
            resetErrorDiv.textContent = '';
            resetSuccessDiv.textContent = '';

            const email = resetEmailInput.value.trim();
            const newPassword = resetPasswordInput.value;

            if (!email || !newPassword) {
                resetErrorDiv.textContent = 'Both fields are required.';
                return;
            }

            try {
                const response = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, newPassword }),
                });

                if (response.ok) {
                    const data = await response.json();
                    resetSuccessDiv.textContent = data.message || 'Password reset successful!';
                    resetForm.reset();
                    
                    // Switch back to login after a delay
                    setTimeout(() => {
                        const loginTab = new bootstrap.Tab(loginTabButton);
                        loginTab.show();
                        resetSuccessDiv.textContent = '';
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    resetErrorDiv.textContent = errorData.message || 'Error resetting password.';
                }
            } catch (error) {
                console.error('Error during password reset:', error);
                resetErrorDiv.textContent = 'Could not connect to the server.';
            }
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupErrorDiv.textContent = '';

            const username = signupUsernameInput.value.trim();
            const email = signupEmailInput.value.trim();
            const password = signupPasswordInput.value;
            const confirmPassword = signupConfirmPasswordInput.value;

            if (!username || !email || !password || !confirmPassword) {
                signupErrorDiv.textContent = 'All fields are required.';
                return;
            }

            if (password !== confirmPassword) {
                signupErrorDiv.textContent = 'Passwords do not match.';
                return;
            }

            try {
                const signupResponse = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                if (!signupResponse.ok) {
                    const errorData = await signupResponse.json();
                    throw new Error(errorData.message || 'An unknown error occurred during signup.');
                }

                // Automatically log the user in after successful signup
                const loginResponse = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!loginResponse.ok) {
                    throw new Error('Signup successful, but failed to automatically log in.');
                }

                const loginData = await loginResponse.json();
                alert('Sign up successful! You are now logged in.');
                handleLoginSuccess(loginData);

            } catch (error) {
                console.error('Error during signup process:', error);
                signupErrorDiv.textContent = error.message;
            }
        });
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginErrorDiv.textContent = '';

            const identifier = loginIdentifierInput.value.trim();
            const password = loginPasswordInput.value;

            if (!identifier || !password) {
                loginErrorDiv.textContent = 'Both fields are required.';
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identifier, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (rememberMe.checked) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('loginIdentifier', identifier);
                        localStorage.setItem('loginPassword', password);
                    } else {
                        localStorage.removeItem('rememberMe');
                        localStorage.removeItem('loginIdentifier');
                        localStorage.removeItem('loginPassword');
                    }

                    handleLoginSuccess(data);
                } else {
                    const errorData = await response.json();
                    loginErrorDiv.textContent = errorData.message || 'Invalid credentials.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginErrorDiv.textContent = 'Could not connect to the server.';
            }
        });
    }
});
