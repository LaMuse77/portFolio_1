

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
        const response = await fetch('http://localhost:8000/dj-rest-auth/registration/', {
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
            window.location.href = 'login.html';
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

