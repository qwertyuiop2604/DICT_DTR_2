document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.querySelector('.Log_in_Container');
    const firstnameInput = document.getElementById('FirstName');
    const lastnameInput = document.getElementById('LastName');
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');
    const confirmPasswordInput = document.getElementById('ConfirmPassword');
    const registerButton = document.getElementById('register');
    const Login = document.getElementById('LOGIN_btn');
    const btn_ok = document.getElementById('btn_ok');
    const popup= document.querySelector('.popup');
    const body = document.querySelector('body');

    // Initially hide the popup container
    popup.style.display = 'none'; 

    // Clear previous error messages
    const clearErrorMessages = () => {
        document.querySelectorAll('.error-message').forEach((message) => {
            message.textContent = ''; // Clear the error messages
        });
    };

    // Event listeners to clear error messages when the user starts typing
    firstnameInput.addEventListener('input', () => {
        document.getElementById('FirstNameError').textContent = '';
    });

    lastnameInput.addEventListener('input', () => {
        document.getElementById('LastNameError').textContent = '';
    });

    emailInput.addEventListener('input', () => {
        document.getElementById('EmailError').textContent = '';
    });

    passwordInput.addEventListener('input', () => {
        document.getElementById('PasswordError').textContent = '';
    });

    confirmPasswordInput.addEventListener('input', () => {
        document.getElementById('ConfirmPasswordError').textContent = '';
    });

    registerButton.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent form submission

        


        // Get values from the form
        const firstname = firstnameInput.value.trim();
        const lastname = lastnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validation checks
        let hasError = false;

        if (!firstname) {
            document.getElementById('FirstNameError').textContent = "First Name is required.";
            hasError = true;
        }

        if (!lastname) {
            document.getElementById('LastNameError').textContent = "Last Name is required.";
            hasError = true;
        }

        if (!email) {
            document.getElementById('EmailError').textContent = "Email is required.";
            hasError = true;
        }


        if (!password) {
            document.getElementById('PasswordError').textContent = "Password is required.";
            hasError = true;
        }

        if (password !== confirmPassword) {
            document.getElementById('ConfirmPasswordError').textContent = "Passwords do not match.";
            hasError = true;
        }

        if (password.length < 6) {
            document.getElementById('PasswordError').textContent = "Password should be at least 6 characters long.";
            hasError = true;
        }

        if (hasError) {
            return; // Prevent further code execution if there are errors
        }

        registrationForm.classList.add('blurred');

        
        // Show the popup after successful registration
        popup.style.display = 'block'; // Make the popup visible

        
    });

    Login.addEventListener('click', function(){

        // simulating successful going to log in page
        alert("going to log in page");
    });
    btn_ok.addEventListener('click', function (e){
        registrationForm.classList.remove('blurred');
    });

    btn_ok.addEventListener('click', function(e){
            // Clear the input values
            firstnameInput.value = '';
            lastnameInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';
    });
    btn_ok.addEventListener('click', function(e){
        popup.style.display = 'none'; 
    });
    
});