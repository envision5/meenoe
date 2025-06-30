// Register page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if already authenticated
    if (window.auth.redirectIfAuthenticated()) {
        return;
    }

    const registerForm = document.getElementById('register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    const registerBtn = document.getElementById('register-btn');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'ti ti-eye' : 'ti ti-eye-off';
    });

    // Toggle confirm password visibility
    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const icon = toggleConfirmPasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'ti ti-eye' : 'ti ti-eye-off';
    });

    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideError();
        hideSuccess();

        try {
            const result = await window.auth.register(name, email, password);
            
            if (result.success) {
                showSuccess('Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
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

    function showSuccess(message) {
        successText.textContent = message;
        successMessage.classList.remove('d-none');
    }

    function hideSuccess() {
        successMessage.classList.add('d-none');
    }

    function setLoadingState(loading) {
        const btnText = registerBtn.querySelector('.btn-text');
        const spinner = registerBtn.querySelector('.spinner-border');
        
        if (loading) {
            btnText.textContent = 'Creating account...';
            spinner.classList.remove('d-none');
            registerBtn.disabled = true;
        } else {
            btnText.textContent = 'Create account';
            spinner.classList.add('d-none');
            registerBtn.disabled = false;
        }
    }
});