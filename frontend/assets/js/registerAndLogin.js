

// all about register 

const form = document.getElementById('registerForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    successDiv.textContent = '';

    const data = {
        username: form.username.value,
        email: form.email.value,
        password1: form.password1.value,
        password2: form.password2.value
    };

    try {
        const response = await fetch('http://localhost:8000/api/accounts/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();




        if (response.ok) {
            localStorage.setItem('authToken', result.key);
            successDiv.textContent = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
            window.location.href = 'pages/login.html';
            form.reset();
        } else {
            // afficher les erreurs retournées par l'API
            errorDiv.textContent = JSON.stringify(result);
        }
    } catch (err) {
        errorDiv.textContent = 'Erreur lors de l’inscription';
        console.error(err);
    }
});


// About login 

const formLog = document.getElementById('loginForm');
const errorDivLog = document.getElementById('error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';

    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
        const response = await fetch('http://localhost:8000/api/accounts/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // stocker le token dans le localStorage pour utilisation future
            localStorage.setItem('authToken', result.key);
            // redirection vers le dashboard
            window.location.href = 'dashboardOfportolio.html';
        } else {
            errorDiv.textContent = JSON.stringify(result);
        }
    } catch (err) {
        errorDiv.textContent = 'Erreur lors de la connexion';
        console.error(err);
    }
});

