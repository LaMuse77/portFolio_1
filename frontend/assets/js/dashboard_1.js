let sidebarCollapsed = false;
let currentExpandedBox = null;

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
            ${project.image ? `<img src="${project.image}" alt="${project.title}" style="max-width: 100%; height: auto;">` : ''}
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    showNotification(`Recherche: "${query}" - ${projects.length} résultats`);
}

function toggleNotifications() {
    showNotification('3 nouvelles notifications');
}

function toggleProfileMenu() {
    showNotification('Menu profil ouvert');
}

function showSection(sectionName) {
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    showNotification(`Navigation vers ${sectionName}`);
}

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
            ${project.image ? `<img src="${project.image}" alt="${project.title}" style="max-width: 100%; height: auto;">` : ''}
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    showNotification(`Filtrage par: ${tech}`);
    setTimeout(() => loadProjects(), 5000);
}

function viewClient(clientId) {
    event.stopPropagation();
    showNotification(`Consultation du client: ${clientId}`);
}

function editDeadline(deadlineId) {
    showNotification(`Édition de l'échéance: ${deadlineId}`);
}

function downloadCV() {
    showNotification('Téléchargement du CV en cours...');
    setTimeout(() => showNotification('CV téléchargé avec succès!'), 1500);
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
    setTimeout(() => showNotification('Statistiques exportées avec succès!'), 1000);
}

function addStackField() {
    const container = document.getElementById('newStacksContainer');
    const stackGroup = document.createElement('div');
    stackGroup.className = 'stack-input-group';
    stackGroup.innerHTML = `
        <input type="text" class="stackName" placeholder="Nom de la technologie" required>
        <input type="file" class="stackIcon" accept="image/*">
        <button type="button" class="removeStackBtn" onclick="removeStackField(this)">Supprimer</button>
    `;
    container.appendChild(stackGroup);
}

function removeStackField(button) {
    const container = document.getElementById('newStacksContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        showNotification('❌ Au moins une technologie est requise');
    }
}

async function openNewProjectModal() {
    document.getElementById('modalTitle').textContent = 'Nouveau Projet';
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    document.getElementById('deleteButton').style.display = 'none';
    document.getElementById('newStacksContainer').innerHTML = `
        <div class="stack-input-group">
            <input type="text" class="stackName" placeholder="Nom de la technologie" required>
            <input type="file" class="stackIcon" accept="image/*">
            <button type="button" class="removeStackBtn" onclick="removeStackField(this)">Supprimer</button>
        </div>
    `;
    
    const stacks = await getAllStacks();
    const select = document.getElementById('stacks');
    select.innerHTML = '';
    stacks.forEach(stack => {
        const option = document.createElement('option');
        option.value = stack.id;
        option.textContent = stack.name;
        select.appendChild(option);
    });
    
    document.getElementById('newProjectModal').style.display = 'block';
}

async function openProjectModal(project) {
    document.getElementById('modalTitle').textContent = 'Modifier Projet';
    document.getElementById('projectId').value = project.id;
    document.getElementById('title').value = project.title;
    document.getElementById('description').value = project.description;
    document.getElementById('link').value = project.link || '';
    document.getElementById('github').value = project.github || '';
    document.getElementById('image').value = '';
    document.getElementById('status').value = project.status;
    document.getElementById('deleteButton').style.display = 'block';
    
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
    
    document.getElementById('newStacksContainer').innerHTML = `
        <div class="stack-input-group">
            <input type="text" class="stackName" placeholder="Nom de la technologie" required>
            <input type="file" class="stackIcon" accept="image/*">
            <button type="button" class="removeStackBtn" onclick="removeStackField(this)">Supprimer</button>
        </div>
    `;
    
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

function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

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
            ${project.image ? `<img src="${project.image}" alt="${project.title}" style="max-width: 100%; height: auto;">` : ''}
            <div class="tech-stack">
                ${project.stacks.map(stack => `<span class="tech-badge">${stack.name}</span>`).join('')}
            </div>
        `;
        projectGrid.appendChild(card);
    });
    
    const stats = getProjectStats(projects);
    document.getElementById('projectStats').innerHTML = `
        <div>Total Projets: ${stats.total}</div>
        <div>En cours: ${stats.ongoing}</div>
        <div>Terminés: ${stats.completed}</div>
        <div>Planifiés: ${stats.planned}</div>
    `;
    
    document.getElementById('projectDetails').innerHTML = projects.map(project => `
        <div class="list-item">${project.title}: ${project.description}</div>
    `).join('');
}

async function loadRecentProjects() {
    const projects = await getRecentProjects();
    const navList = document.getElementById('recentProjectsList');
    navList.innerHTML = '';
    projects.forEach(project => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="openProject(${project.id})">
                <i class="fa-solid fa-globe"></i>
                <span class="nav-text">${project.title}</span>
            </a>
        `;
        navList.appendChild(li);
    });
}

async function loadStacks() {
    const stacks = await getAllStacks();
    const stackList = document.getElementById('stackList');
    stackList.innerHTML = '';
    stacks.forEach(stack => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="filterByTech('${stack.name.toLowerCase()}')">
                ${stack.icon ? `<img src="${stack.icon}" alt="${stack.name}" style="width: 20px; height: 20px; margin-right: 5px;">` : `<i class="fa-brands fa-${stack.name.toLowerCase()}" style="font-size: 20px;"></i>`}
                <span class="nav-text">${stack.name}</span>
            </a>
        `;
        stackList.appendChild(li);
    });
}

document.getElementById('projectForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const projectData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        link: document.getElementById('link').value || null,
        github: document.getElementById('github').value || null,
        status: document.getElementById('status').value,
        stacks_ids: Array.from(document.getElementById('stacks').selectedOptions).map(opt => parseInt(opt.value))
    };
    
    // Collecter les nouvelles stacks
    const newStacks = [];
    const stackGroups = document.querySelectorAll('.stack-input-group');
    stackGroups.forEach(group => {
        const name = group.querySelector('.stackName').value;
        const icon = group.querySelector('.stackIcon').files[0];
        if (name) {
            newStacks.push({ name, icon });
        }
    });
    
    let result;
    if (newStacks.length > 0) {
        const createdStacks = await createStacks(newStacks);
        projectData.stacks_ids = [...projectData.stacks_ids, ...createdStacks.map(stack => stack.id)];
    }
    
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
        loadRecentProjects();
        loadStacks();
        closeModal();
    }
});

async function deleteProject(projectId) {
    if (projectId && await deleteProject(projectId)) {
        loadProjects();
        loadRecentProjects();
        closeModal();
    }
}

document.getElementById('authForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (await login(username, password)) {
        closeAuthModal();
        loadProjects();
        loadRecentProjects();
        loadStacks();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        openAuthModal();
    } else {
        loadProjects();
        loadRecentProjects();
        loadStacks();
    }
    
    showNotification('Portfolio chargé avec succès!');
    
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
        closeAuthModal();
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
    loadRecentProjects();
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