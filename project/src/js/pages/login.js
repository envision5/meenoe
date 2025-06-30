// Login page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if already authenticated
    if (window.auth.redirectIfAuthenticated()) {
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'ti ti-eye' : 'ti ti-eye-off';
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideError();

        try {
            const result = await window.auth.login(email, password);
            
            if (result.success) {
                // Redirect to dashboard
                window.location.href = '/';
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('d-none');
    }

    function hideError() {
        errorMessage.classList.add('d-none');
    }

    function setLoadingState(loading) {
        const btnText = loginBtn.querySelector('.btn-text');
        const spinner = loginBtn.querySelector('.spinner-border');
        
        if (loading) {
            btnText.textContent = 'Signing in...';
            spinner.classList.remove('d-none');
            loginBtn.disabled = true;
        } else {
            btnText.textContent = 'Sign in';
            spinner.classList.add('d-none');
            loginBtn.disabled = false;
        }
    }
});