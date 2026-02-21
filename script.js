document.addEventListener('DOMContentLoaded', () => {
    const projectGrid = document.getElementById('project-grid');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // 1. Fetch Projects from Backend
    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            projectGrid.innerHTML = `<p class="error">Unable to load projects. Please try again later.</p>`;
            console.error(error);
        }
    };

    const displayProjects = (projects) => {
        projectGrid.innerHTML = projects.map(project => `
            <div class="card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <small>Tech: ${project.techStack.join(', ')}</small>
            </div>
        `).join('');
    };

    // 2. Handle Contact Form Submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            formStatus.textContent = 'Sending...';
            const response = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formStatus.innerHTML = '<p class="success">Message sent successfully!</p>';
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            formStatus.innerHTML = '<p class="error">Oops! Something went wrong.</p>';
        }
    });

    fetchProjects();
});