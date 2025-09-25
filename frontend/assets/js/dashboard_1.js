// Gestion de la sidebar
        let sidebarCollapsed = false;
        
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

        // Gestion de la navigation
        function showSection(sectionName) {
            // Mettre à jour les liens actifs
            document.querySelectorAll('.nav-list a').forEach(link => {
                link.classList.remove('active');
            });
            event.target.classList.add('active');
            
            showNotification(`Navigation vers ${sectionName}`);
        }

        // Gestion des projets
        function openProject(projectId) {
            showNotification(`Ouverture du projet: ${projectId}`);
            // Ici vous pourriez ouvrir un modal avec les détails du projet
        }

        function viewProject(projectId) {
            showNotification(`Visualisation du projet: ${projectId}`);
            // Simuler l'ouverture d'une page projet
        }

        // Filtrage par technologie
        function filterByTech(tech) {
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const cardTech = card.getAttribute('data-tech') || '';
                if (cardTech.includes(tech)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            showNotification(`Filtrage par: ${tech}`);
            
            // Réinitialiser après 3 secondes
            setTimeout(() => {
                projectCards.forEach(card => {
                    card.style.display = 'block';
                });
            }, 3000);
        }

        // Gestion des clients
        function viewClient(clientId) {
            showNotification(`Consultation du client: ${clientId}`);
        }

        // Gestion des échéances
        function editDeadline(deadlineId) {
            showNotification(`Édition de l'échéance: ${deadlineId}`);
        }

        // Fonctions utilitaires
        function downloadCV() {
            showNotification('Téléchargement du CV en cours...');
            // Simuler un téléchargement
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

        // Gestion des modals
        function openNewProjectModal() {
            document.getElementById('newProjectModal').classList.add('show');
        }

        function openNewClientModal() {
            document.getElementById('newClientModal').classList.add('show');
        }

        function openNewDeadlineModal() {
            document.getElementById('newDeadlineModal').classList.add('show');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        // Fermeture des modals en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // Gestion des formulaires
        document.getElementById('newProjectForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('projectName').value;
            const description = document.getElementById('projectDescription').value;
            const tech = document.getElementById('projectTech').value;
            
            // Créer un nouveau projet
            addNewProject(name, description, tech);
            
            // Fermer le modal et réinitialiser
            closeModal('newProjectModal');
            this.reset();
            
            showNotification(`Projet "${name}" créé avec succès!`);
        });

        document.getElementById('newClientForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('clientName').value;
            const project = document.getElementById('clientProject').value;
            const status = document.getElementById('clientStatus').value;
            
            // Ajouter un nouveau client
            addNewClient(name, project, status);
            
            closeModal('newClientModal');
            this.reset();
            
            showNotification(`Client "${name}" ajouté avec succès!`);
        });

        document.getElementById('newDeadlineForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('deadlineTitle').value;
            const description = document.getElementById('deadlineDescription').value;
            const date = document.getElementById('deadlineDate').value;
            const urgent = document.getElementById('deadlineUrgent').checked;
            
            // Ajouter une nouvelle échéance
            addNewDeadline(title, description, date, urgent);
            
            closeModal('newDeadlineModal');
            this.reset();
            
            showNotification(`Échéance "${title}" ajoutée avec succès!`);
        });

        // Fonctions pour ajouter du contenu
        function addNewProject(name, description, tech) {
            const projectGrid = document.getElementById('projectGrid');
            const techArray = tech.split(',').map(t => t.trim());
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-tech', tech.toLowerCase());
            projectCard.onclick = () => viewProject(name.toLowerCase().replace(/\s+/g, ''));
            
            projectCard.innerHTML = `
                <h4>${name}</h4>
                <p>${description}</p>
                <div class="tech-stack">
                    ${techArray.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
            
            // Animation d'entrée
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                projectCard.style.transition = 'all 0.5s ease';
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, 100);
        }

        function addNewClient(name, project, status) {
            const clientList = document.getElementById('clientList');
            
            const clientItem = document.createElement('div');
            clientItem.className = 'client-item';
            clientItem.onclick = () => viewClient(name.toLowerCase().replace(/\s+/g, ''));
            
            clientItem.innerHTML = `
                <div class="client-name">${name}</div>
                <div class="client-project">${project} - ${status}</div>
            `;
            
            clientList.appendChild(clientItem);
            
            // Animation d'entrée
            clientItem.style.opacity = '0';
            clientItem.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                clientItem.style.transition = 'all 0.5s ease';
                clientItem.style.opacity = '1';
                clientItem.style.transform = 'translateX(0)';
            }, 100);
        }

        function addNewDeadline(title, description, date, urgent) {
            const deadlineList = document.getElementById('deadlineList');
            
            const deadlineItem = document.createElement('div');
            deadlineItem.className = 'deadline-item';
            deadlineItem.onclick = () => editDeadline(title.toLowerCase().replace(/\s+/g, ''));
            
            // Formatter la date
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            
            deadlineItem.innerHTML = `
                <div>
                    <strong>${title}</strong>
                    <div style="font-size: 13px; color: #94a3b8;">${description}</div>
                </div>
                <div class="deadline-date ${urgent ? 'urgent' : ''}">${formattedDate}</div>
            `;
            
            deadlineList.appendChild(deadlineItem);
            
            // Animation d'entrée
            deadlineItem.style.opacity = '0';
            deadlineItem.style.transform = 'translateY(10px)';
            setTimeout(() => {
                deadlineItem.style.transition = 'all 0.5s ease';
                deadlineItem.style.opacity = '1';
                deadlineItem.style.transform = 'translateY(0)';
            }, 100);
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

        // Raccourcis clavier
        document.addEventListener('keydown', function(e) {
            // Ctrl + N pour nouveau projet
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                openNewProjectModal();
            }
            
            // Échap pour fermer les modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });

        // Animation de chargement initial
        document.addEventListener('DOMContentLoaded', function() {
            showNotification('Portfolio chargé avec succès!');
            
            // Animation séquentielle des cartes
            const cards = document.querySelectorAll('.project-card, .client-item');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });

        // Sauvegarde automatique (simulation)
        setInterval(() => {
            // Simuler une sauvegarde automatique
            console.log('Sauvegarde automatique effectuée');
        }, 30000); // Toutes les 30 secondes

        // Gestion de l'état hors ligne
        window.addEventListener('online', () => {
            showNotification('Connexion rétablie');
        });

        window.addEventListener('offline', () => {
            showNotification('Mode hors ligne activé');
        });