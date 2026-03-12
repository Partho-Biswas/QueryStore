document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const signupUsernameInput = document.getElementById('signup-username');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const loginErrorDiv = document.getElementById('login-error');
    const signupErrorDiv = document.getElementById('signup-error');

    // Reset Password Elements
    const resetForm = document.getElementById('reset-form');
    const resetUsernameInput = document.getElementById('reset-username');
    const resetPasswordInput = document.getElementById('reset-password');
    const resetErrorDiv = document.getElementById('reset-error');
    const resetSuccessDiv = document.getElementById('reset-success');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const resetTabButton = document.getElementById('pills-reset-tab');

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

    // Reset Password Form Submission
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resetErrorDiv.textContent = '';
            resetSuccessDiv.textContent = '';

            const username = resetUsernameInput.value.trim();
            const newPassword = resetPasswordInput.value;

            if (!username || !newPassword) {
                resetErrorDiv.textContent = 'Both fields are required.';
                return;
            }

            try {
                const response = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, newPassword }),
                });

                if (response.ok) {
                    const data = await response.json();
                    resetSuccessDiv.textContent = data.message || 'Password reset successful!';
                    resetForm.reset();
                    // Optional: Switch back to login after a delay
                    setTimeout(() => {
                        const loginTabButton = document.getElementById('pills-login-tab');
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
            const password = signupPasswordInput.value;
            const confirmPassword = signupConfirmPasswordInput.value;

            if (!username || !password || !confirmPassword) {
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
                    body: JSON.stringify({ username, password }),
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

            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value;

            if (!username || !password) {
                loginErrorDiv.textContent = 'Both fields are required.';
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
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
