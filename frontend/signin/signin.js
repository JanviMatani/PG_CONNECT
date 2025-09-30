const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', async e => {
    e.preventDefault();

    if (validateInputs()) {
        await handleFormSubmission();
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    let isValid = true;

    if(usernameValue === '') {
        setError(username, 'Username is required');
        isValid = false;
    } else {
        setSuccess(username);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
        isValid = false;
    } else {
        setSuccess(password);
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
        isValid = false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        isValid = false;
    } else {
        setSuccess(password2);
    }

    return isValid;
};
const handleFormSubmission = async () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    try {
        // Check if email already exists
        const emailResponse = await fetch('http://localhost:5000/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValue })
        });

        const emailData = await emailResponse.json();

        if (emailData.exists) {
            setError(email, 'Email already exists');
            return;
        }

        // Register new user
        const signupResponse = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameValue,
                email: emailValue,
                password: passwordValue
            })
        });

        const signupData = await signupResponse.json();

        if (signupResponse.ok) {
            alert('Registration successful! You can now sign in.');
            // Clear form
            form.reset();
            // Remove success/error classes
            const inputControls = document.querySelectorAll('.input-control');
            inputControls.forEach(control => {
                control.classList.remove('success', 'error');
            });
        } else {
            alert(signupData.message || 'Registration failed');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
};
