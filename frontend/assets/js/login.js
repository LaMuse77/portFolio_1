
// About login 

const formLog = document.getElementById('loginForm');
const errorDivLog = document.getElementById('error');


formLog.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDivLog.textContent = '';

    const data = {
        username: formLog.username.value,
        password: formLog.password.value
    };

    try {
        const response = await fetch('http://localhost:8000/dj-rest-auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', result.key);
            window.location.href = 'dashboardOfportolio.html';  // redirection OK
        } else {
            errorDivLog.textContent = JSON.stringify(result);
        }
    } catch (err) {
        errorDivLog.textContent = 'Erreur lors de la connexion';
        console.error(err);
    }form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';

    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
        const response = await fetch('http://localhost:8000/dj-rest-auth/login/', {
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

});

