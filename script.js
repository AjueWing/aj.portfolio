// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  // Reveal on scroll
  const revealElements = document.querySelectorAll('.about, .portfolio, .contact, .section-title');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add('fade-in', 'visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Load Projects dynamically
  fetch('projects.json')
    .then(res => res.json())
    .then(projects => {
      const grid = document.getElementById('portfolioGrid');
      const modals = document.getElementById('modalsContainer');

      grid.innerHTML = '';
      modals.innerHTML = '';

      projects.forEach(project => {
        // Project card
        grid.innerHTML += `
          <div class="portfolio-item" data-modal="${project.id}">
            <img src="${project.image}" alt="${project.title}" class="portfolio-img" loading="lazy">
            <div class="portfolio-overlay">
              <h3>${project.title}</h3>
              <p>${project.tech.slice(0,2).join(' + ')}</p>
            </div>
          </div>
        `;

        // Modal
        modals.innerHTML += `
          <div id="${project.id}" class="modal">
            <div class="modal-content">
              <span class="close">&times;</span>
              <img src="${project.image}" alt="${project.title}" class="modal-img">
              <div class="modal-text">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <ul class="modal-tech">${project.tech.map(t => `<li>${t}</li>`).join('')}</ul>
                <a href="${project.demoUrl}" class="btn btn-outline" target="_blank">Live Demo</a>
                <a href="${project.sourceUrl}" class="btn btn-primary" target="_blank">Source Code</a>
              </div>
            </div>
          </div>
        `;
      });

      setupModals();
    })
    .catch(err => {
      console.error('Failed to load projects:', err);
      document.getElementById('portfolioGrid').innerHTML = '<p style="color:#ccc;text-align:center;">Could not load projects.</p>';
    });

  // Modal functions
  function setupModals() {
    const items = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const closes = document.querySelectorAll('.close');

    items.forEach(item => {
      item.addEventListener('click', () => {
        const modal = document.getElementById(item.dataset.modal);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('show'), 10);
      });
    });

    closes.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 300);
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('show');
          setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }, 300);
        }
      });
    });
  }

  // Back-to-top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 300);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Form validation
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return alert('Please fill in all fields.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Enter a valid email.');
    alert('Message sent! (demo only)');
    form.reset();
  });
});
