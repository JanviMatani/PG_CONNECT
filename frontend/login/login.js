const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    if (validateLoginInputs()) {
        await handleLogin();
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

const validateLoginInputs = () => {
    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value.trim();
    
    let isValid = true;

    if(emailValue === '') {
        setError(loginEmail, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(loginEmail, 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess(loginEmail);
    }

    if(passwordValue === '') {
        setError(loginPassword, 'Password is required');
        isValid = false;
    } else {
        setSuccess(loginPassword);
    }
    
    return isValid;
};

const handleLogin = async () => {
    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value.trim();
    
    try {
        const response = await fetch('http://localhost:5000/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: emailValue, 
                password: passwordValue 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`Welcome back, ${data.user.username}!`);
            // Store user info in localStorage for session management
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirect to dashboard or main page
            window.location.href = '/dashboard.html';
        } else {
            // Handle specific error messages
            if (data.message === 'Email not found') {
                setError(loginEmail, 'Email not found. Please sign up first.');
            } else if (data.message === 'Invalid password') {
                setError(loginPassword, 'Invalid password. Please try again.');
            } else {
                alert(data.message || 'Login failed');
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
};
