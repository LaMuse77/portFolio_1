
async function loadUserProfile() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        window.location.href = "login.html"; // pas de token → redirige vers login
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/dj-rest-auth/user/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json"
            }
        });

        const user = await response.json();

        if (response.ok) {
            // remplacer les infos dans ton header
            document.querySelector(".profile-avatar").textContent = user.username[0].toUpperCase();
            document.querySelector(".profile-info h4").textContent = user.username;
            document.querySelector(".profile-info p").textContent = user.bio ?? "Utilisateur connecté";

            if (user.profile_image) {
                document.querySelector(".profile-avatar").style.backgroundImage = `url(${user.profile_image})`;
                document.querySelector(".profile-avatar").style.backgroundSize = "cover";
                document.querySelector(".profile-avatar").textContent = ""; // on enlève les initiales
            }
        } else {
            console.error("Erreur API :", user);
            window.location.href = "login.html"; // si token invalide → retour login
        }
    } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
    }
}

const API_BASE_URL = 'http://localhost:8000/api';
const getAuthToken = () => localStorage.getItem('authToken');

const getHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (includeAuth && token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
};

const getFormHeaders = (includeAuth = false) => {
    const headers = {};
    const token = getAuthToken();
    if (includeAuth && token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
};

async function getAllProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        showNotification('❌ Erreur de chargement des projets');
        return [];
    }
}

async function getProjectById(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        showNotification('❌ Erreur de chargement du projet');
        return null;
    }
}

async function createProject(projectData) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        const newProject = await response.json();
        showNotification('✅ Projet créé avec succès!');
        return newProject;
    } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        showNotification('❌ Erreur lors de la création du projet');
        return null;
    }
}

async function updateProject(projectId, projectData) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const updatedProject = await response.json();
        showNotification('✅ Projet mis à jour avec succès!');
        return updatedProject;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        showNotification('❌ Erreur lors de la mise à jour');
        return null;
    }
}

async function deleteProject(projectId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        return false;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        showNotification('✅ Projet supprimé avec succès!');
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        showNotification('❌ Erreur lors de la suppression');
        return false;
    }
}

async function getRecentProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/recent/`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des projets récents:', error);
        return [];
    }
}

async function getProjectsByTech(techName) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/by_tech/?tech=${encodeURIComponent(techName)}`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors du filtrage par technologie:', error);
        return [];
    }
}

async function searchProjects(searchQuery) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/?search=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        return [];
    }
}

async function uploadProjectImage(projectId, imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
            method: 'PATCH',
            headers: getFormHeaders(true),
            body: formData
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const updatedProject = await response.json();
        showNotification('✅ Image uploadée avec succès!');
        return updatedProject;
    } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        showNotification('❌ Erreur lors de l\'upload');
        return null;
    }
}

async function getAllStacks() {
    try {
        const response = await fetch(`${API_BASE_URL}/stacks/`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des stacks:', error);
        return [];
    }
}

async function createStacks(stacksData) {
    const createdStacks = [];
    for (const stack of stacksData) {
        try {
            const formData = new FormData();
            formData.append('name', stack.name);
            if (stack.icon) {
                formData.append('icon', stack.icon);
            }
            const response = await fetch(`${API_BASE_URL}/stacks/`, {
                method: 'POST',
                headers: getFormHeaders(true),
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            const newStack = await response.json();
            createdStacks.push(newStack);
        } catch (error) {
            console.error(`Erreur lors de la création de la stack ${stack.name}:`, error);
            showNotification(`❌ Erreur lors de la création de ${stack.name}`);
        }
    }
    if (createdStacks.length > 0) {
        showNotification(`✅ ${createdStacks.length} technologie(s) créée(s) avec succès!`);
    }
    return createdStacks;
}

async function deleteStack(stackId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette technologie ?')) {
        return false;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/stacks/${stackId}/`, {
            method: 'DELETE',
            headers: getHeaders(true)
        });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        showNotification('✅ Technologie supprimée avec succès!');
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la stack:', error);
        showNotification('❌ Erreur lors de la suppression');
        return false;
    }
}

async function login(username, password) {
    try {
        const response = await fetch('http://localhost:8000/dj-rest-auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Identifiants incorrects');
        const data = await response.json();
        localStorage.setItem('authToken', data.key);
        showNotification('✅ Connexion réussie!');
        return data;
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showNotification('❌ Erreur de connexion');
        return null;
    }
}

async function logout() {
    try {
        const response = await fetch('http://localhost:8000/dj-rest-auth/logout/', {
            method: 'POST',
            headers: getHeaders(true)
        });
        localStorage.removeItem('authToken');
        showNotification('✅ Déconnexion réussie!');
        return true;
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        localStorage.removeItem('authToken');
        return false;
    }
}

function getProjectStats(projects) {
    const total = projects.length;
    const ongoing = projects.filter(p => p.status === 'ongoing').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const planned = projects.filter(p => p.status === 'planned').length;
    return { total, ongoing, completed, planned };
}

function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}