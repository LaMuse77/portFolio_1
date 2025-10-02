// Variables globales
let sidebarCollapsed = false;
let currentExpandedBox = null;

// Gestion de la sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('Side');
    const toggleIcon = document.getElementById('toggleIcon');
    
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
        toggleIcon.className = 'fa-solid fa-chevron-right';
    } else {
        sidebar.classList.remove('collapsed');
        toggleIcon.className = 'fa-solid fa-chevron-left';
    }
}

// Gestion de l'expansion des boxes
function expandBox(element) {
    document.querySelectorAll('.expandable-box').forEach(box => {
        box.classList.remove('expanded');
    });
    
    if (currentExpandedBox !== element) {
        element.classList.add('expanded');
        currentExpandedBox = element;
    } else {
        currentExpandedBox = null;
    }
}

function closeExpanded(element) {
    const box = element.closest('.expandable-box');
    box.classList.remove('expanded');
    currentExpandedBox = null;
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.expandable-box') && !e.target.closest('.action-btn')) {
        document.querySelectorAll('.expandable-box').forEach(box => {
            box.classList.remove('expanded');
        });
        currentExpandedBox = null;
    }
});

// Gestion de la recherche
async function performSearch(query) {
    if (query.length < 2) return;
    
    const projects = await searchProjects(query);
    
    const projectGrid = document.getElementById('projectGrid');
    projectGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tech', project.stacks.map(s => s.name.toLowerCase()).join(' '));
        card.onclick = () => viewProject(project.id);
        card.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    
    showNotification(`Recherche: "${query}" - ${projects.length} résultats`);
}

// Gestion des notifications
function toggleNotifications() {
    showNotification('3 nouvelles notifications');
}

// Gestion du menu profil
function toggleProfileMenu() {
    showNotification('Menu profil ouvert');
}

// Gestion de la navigation
function showSection(sectionName) {
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    showNotification(`Navigation vers ${sectionName}`);
}

// Gestion des projets
async function openProject(projectId) {
    const project = await getProjectById(projectId);
    if (project) {
        showNotification(`Ouverture du projet: ${project.title}`);
        openProjectModal(project);
    }
}

async function viewProject(projectId) {
    event.stopPropagation();
    const project = await getProjectById(projectId);
    if (project) {
        showNotification(`Visualisation du projet: ${project.title}`);
        openProjectModal(project);
    }
}

// Filtrage par technologie
async function filterByTech(tech) {
    const projects = await getProjectsByTech(tech);
    const projectGrid = document.getElementById('projectGrid');
    projectGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tech', project.stacks.map(s => s.name.toLowerCase()).join(' '));
        card.onclick = () => viewProject(project.id);
        card.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    
    showNotification(`Filtrage par: ${tech}`);
    
    setTimeout(() => {
        loadProjects(); // Réinitialiser après 5 secondes
    }, 5000);
}

// Gestion des clients
function viewClient(clientId) {
    event.stopPropagation();
    showNotification(`Consultation du client: ${clientId}`);
}

// Gestion des échéances
function editDeadline(deadlineId) {
    showNotification(`Édition de l'échéance: ${deadlineId}`);
}

// Fonctions utilitaires
function downloadCV() {
    showNotification('Téléchargement du CV en cours...');
    setTimeout(() => {
        showNotification('CV téléchargé avec succès!');
    }, 1500);
}

function openBlog() {
    showNotification('Ouverture du blog...');
    window.open('#', '_blank');
}

function showCertifications() {
    showNotification('Affichage des certifications');
}

function exportStats() {
    showNotification('Export des statistiques en cours...');
    setTimeout(() => {
        showNotification('Statistiques exportées avec succès!');
    }, 1000);
}

// Modal pour créer/modifier un projet
async function openNewProjectModal() {
    document.getElementById('modalTitle').textContent = 'Nouveau Projet';
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    document.getElementById('newProjectModal').style.display = 'block';
    
    const stacks = await getAllStacks();
    const select = document.getElementById('stacks');
    select.innerHTML = '';
    stacks.forEach(stack => {
        const option = document.createElement('option');
        option.value = stack.id;
        option.textContent = stack.name;
        select.appendChild(option);
    });
}

async function openProjectModal(project) {
    document.getElementById('modalTitle').textContent = 'Modifier Projet';
    document.getElementById('projectId').value = project.id;
    document.getElementById('title').value = project.title;
    document.getElementById('description').value = project.description;
    document.getElementById('link').value = project.link || '';
    document.getElementById('github').value = project.github || '';
    document.getElementById('image').value = '';
    
    const stacks = await getAllStacks();
    const select = document.getElementById('stacks');
    select.innerHTML = '';
    stacks.forEach(stack => {
        const option = document.createElement('option');
        option.value = stack.id;
        option.textContent = stack.name;
        if (project.stacks.some(s => s.id === stack.id)) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    document.getElementById('newProjectModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('newProjectModal').style.display = 'none';
}

function openNewClientModal() {
    showNotification('Ouverture du modal nouveau client');
}

function openNewDeadlineModal() {
    showNotification('Ouverture du modal nouvelle échéance');
}

// Système de notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Charger les projets au démarrage
async function loadProjects() {
    const projects = await getAllProjects();
    const projectGrid = document.getElementById('projectGrid');
    projectGrid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tech', project.stacks.map(s => s.name.toLowerCase()).join(' '));
        card.onclick = () => viewProject(project.id);
        card.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    
    // Mettre à jour les stats
    const stats = getProjectStats(projects);
    document.querySelector('.detailed-stats').innerHTML = `
        <div>Total Projets: ${stats.total}</div>
        <div>En cours: ${stats.ongoing}</div>
        <div>Terminés: ${stats.completed}</div>
    `;
}

// Gestion du formulaire
document.getElementById('projectForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const projectData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        link: document.getElementById('link').value || null,
        github: document.getElementById('github').value || null,
        stacks_ids: Array.from(document.getElementById('stacks').selectedOptions).map(opt => parseInt(opt.value))
    };
    
    let result;
    if (projectId) {
        result = await updateProject(projectId, projectData);
    } else {
        result = await createProject(projectData);
    }
    
    if (result) {
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            await uploadProjectImage(result.id, imageFile);
        }
        loadProjects();
        closeModal();
    }
});

// Événements initiaux
document.addEventListener('DOMContentLoaded', function() {
    showNotification('Portfolio chargé avec succès!');
    loadProjects();
    
    const elements = document.querySelectorAll('.project-card, .client-item, .stat-card, .deadline-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });

    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = width;
            }, 100);
        });
    }, 1000);
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input').focus();
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.expandable-box').forEach(box => {
            box.classList.remove('expanded');
        });
        closeModal();
        currentExpandedBox = null;
    }
});

function handleResize() {
    if (window.innerWidth <= 1200) {
        document.querySelectorAll('.expandable-box').forEach(box => {
            box.classList.remove('expanded');
        });
        currentExpandedBox = null;
    }
}

window.addEventListener('resize', handleResize);

setInterval(() => {
    console.log('Auto-save effectué');
}, 30000);

window.addEventListener('online', () => {
    showNotification('Connexion rétablie');
    loadProjects();
});

window.addEventListener('offline', () => {
    showNotification('Mode hors ligne activé');
});

function scrollDeadlines(direction) {
    const container = document.querySelector('.deadline-list');
    const scrollAmount = 260;
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}