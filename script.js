document.addEventListener('DOMContentLoaded', () => {

  /* 0. PAGE LOADING SEQUENCE */
  const loader = document.getElementById('rp-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 500);
    }, 400);
  }

  /* 1. READING PROGRESS BAR */
  const progressBar = document.createElement('div');
  progressBar.id = 'rp-reading-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  /* 2. TOAST NOTIFICATION UTILITY */
  function showToast(message) {
    const existingToast = document.querySelector('.rp-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'rp-toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* 3. COPY-TO-CLIPBOARD EMAIL */
  const emailLink = document.getElementById('email-copy-link');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('riasadrahmanrakib.24@gmail.com').then(() => {
        showToast('📋 Email copied to clipboard!');
      });
    });
  }

  /* 4. DARK / LIGHT MODE WITH SAVED PREFERENCE */
  const themeToggleBtn = document.createElement('button');
  themeToggleBtn.id = 'theme-toggle';
  themeToggleBtn.innerHTML = '🌙';
  themeToggleBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
  document.querySelector('.rp-links').appendChild(themeToggleBtn);

  const currentTheme = localStorage.getItem('portfolio-theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '☀️';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    let theme = 'light';
    if (document.body.classList.contains('dark-theme')) {
      theme = 'dark';
      themeToggleBtn.innerHTML = '☀️';
    } else {
      themeToggleBtn.innerHTML = '🌙';
    }
    localStorage.setItem('portfolio-theme', theme);
    showToast(`Switched to ${theme} mode`);
  });

  /* 5. SCROLL-TRIGGERED ANIMATIONS */
  const animatedElements = document.querySelectorAll('.rp-card, .rp-project-showcase, .rp-achievement-card, .rp-timeline-item');
  animatedElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  /* 6. 3D CARD TILT EFFECT */
  const tiltCards = document.querySelectorAll('.rp-card, .rp-project-showcase, .rp-profile-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* 7. PROJECT CATEGORY FILTERS */
  const projectSectionHeader = document.querySelector('#rp-projects .rp-section-header');
  if (projectSectionHeader) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'rp-filter-bar';
    filterContainer.innerHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="vision">Computer Vision</button>
      <button class="filter-btn" data-filter="ai">GenAI & Agents</button>
      <button class="filter-btn" data-filter="automation">Automation & IoT</button>
    `;
    projectSectionHeader.appendChild(filterContainer);

    const projects = document.querySelectorAll('.rp-project-showcase');
    const categories = ['vision', 'ai', 'automation', 'ai', 'vision', 'ai'];
    projects.forEach((proj, index) => {
      proj.setAttribute('data-category', categories[index] || 'all');
    });

    filterContainer.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.getAttribute('data-filter');
      projects.forEach(proj => {
        if (filter === 'all' || proj.getAttribute('data-category') === filter) {
          proj.style.display = 'flex';
        } else {
          proj.style.display = 'none';
        }
      });
    });
  }

  /* 8. PROJECT DETAIL POPUPS (MODAL) */
  const modal = document.createElement('div');
  modal.id = 'rp-modal';
  modal.className = 'rp-modal';
  modal.innerHTML = `
    <div class="rp-modal-content">
      <span class="rp-modal-close">&times;</span>
      <h2 id="modal-title" style="margin-bottom: 12px; font-weight:800;"></h2>
      <p id="modal-desc" style="color:var(--text-muted); line-height:1.6; margin-bottom: 20px;"></p>
      <a id="modal-link" class="rp-btn rp-btn-primary" href="" style="color:#FFF !important; width:100%; justify-content:center;">Go to Full Project Page ↗</a>
    </div>
  `;
  document.body.appendChild(modal);

  const modalClose = modal.querySelector('.rp-modal-close');
  modalClose.addEventListener('click', () => modal.classList.remove('active'));
  window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  const projectsList = document.querySelectorAll('.rp-project-showcase');
  projectsList.forEach(proj => {
    proj.addEventListener('click', (e) => {
      if (proj.getAttribute('href') && proj.getAttribute('href').includes('competition')) {
        return;
      }
      e.preventDefault();
      const title = proj.querySelector('h3').innerText;
      const desc = proj.querySelector('p').innerText;
      const href = proj.getAttribute('href');

      document.getElementById('modal-title').innerText = title;
      document.getElementById('modal-desc').innerText = desc;
      document.getElementById('modal-link').setAttribute('href', href);
      modal.classList.add('active');
    });
  });

  /* 9. COMMAND PALETTE (CTRL + K) */
  const cmdModal = document.createElement('div');
  cmdModal.className = 'rp-cmd-modal';
  cmdModal.innerHTML = `
    <div class="rp-cmd-box">
      <input type="text" id="rp-cmd-input" class="rp-cmd-input" placeholder="Type a command or search sections (e.g. Projects, CV)...">
      <div id="rp-cmd-list" class="rp-cmd-list">
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-about"><span>Go to About Me</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-skills"><span>Go to Core Skills</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-research"><span>Go to Research & Case Studies</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-competitions"><span>Go to Competitions</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-projects"><span>Go to Projects</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-achievements"><span>Go to Achievements & Certifications</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-experience"><span>Go to Industrial Experience</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="scroll" data-target="#rp-contact"><span>Go to Contact Section</span><span class="shortcut">Section</span></div>
        <div class="rp-cmd-item" data-action="link" data-href="assets/Riasad_Rahman_Rakib_CV.pdf"><span>Download CV Document</span><span class="shortcut">PDF</span></div>
        <div class="rp-cmd-item" data-action="link" data-href="https://github.com/R-Rakib"><span>Open GitHub Profile</span><span class="shortcut">External</span></div>
        <div class="rp-cmd-item" data-action="toggle-theme"><span>Toggle Dark/Light Mode</span><span class="shortcut">Preference</span></div>
      </div>
    </div>
  `;
  document.body.appendChild(cmdModal);

  const cmdTriggerBtn = document.getElementById('cmd-trigger-btn');
  const cmdInput = document.getElementById('rp-cmd-input');
  const cmdList = document.getElementById('rp-cmd-list');

  function toggleCommandPalette(open) {
    if (open) {
      cmdModal.classList.add('active');
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdInput.focus(), 50);
    } else {
      cmdModal.classList.remove('active');
    }
  }

  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', () => toggleCommandPalette(true));
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleCommandPalette(!cmdModal.classList.contains('active'));
    }
    if (e.key === 'Escape' && cmdModal.classList.contains('active')) {
      toggleCommandPalette(false);
    }
  });

  cmdModal.addEventListener('click', (e) => {
    if (e.target === cmdModal) toggleCommandPalette(false);
  });

  function filterCmdItems(query) {
    const items = cmdList.querySelectorAll('.rp-cmd-item');
    const q = query.toLowerCase();
    items.forEach(item => {
      const text = item.querySelector('span').innerText.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  cmdInput.addEventListener('input', (e) => {
    filterCmdItems(e.target.value);
  });

  cmdList.addEventListener('click', (e) => {
    const item = e.target.closest('.rp-cmd-item');
    if (!item) return;
    const action = item.getAttribute('data-action');
    toggleCommandPalette(false);

    if (action === 'scroll') {
      const target = document.querySelector(item.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'link') {
      window.open(item.getAttribute('data-href'), '_blank');
    } else if (action === 'toggle-theme') {
      document.getElementById('theme-toggle').click();
    }
  });

  /* 10. IMAGE LIGHTBOX */
  const lightbox = document.createElement('div');
  lightbox.className = 'rp-lightbox';
  lightbox.innerHTML = `<img src="" alt="Zoomed Preview">`;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('img.rp-standard-img, img.rp-proj-thumb, img.rp-avatar').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });
  lightbox.addEventListener('click', () => lightbox.classList.remove('active'));

  /* 11. ANIMATED PORTFOLIO STATISTICS */
  const statValues = document.querySelectorAll('.rp-stat-value');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statValues.forEach(stat => stat.classList.add('stat-animated'));
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.rp-stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  /* 12. CONTACT FORM EMAIL PREPARATION */
  const contactCard = document.querySelector('.rp-contact-card');
  if (contactCard) {
    const formHTML = `
      <form id="rp-contact-form" style="max-width: 500px; margin: 25px auto 0; text-align: left;">
        <input type="text" id="contact-name" placeholder="Your Name" required class="rp-form-input">
        <input type="email" id="contact-email" placeholder="Your Email" required class="rp-form-input">
        <textarea id="contact-message" rows="4" placeholder="Your Message" required class="rp-form-input"></textarea>
        <button type="submit" class="rp-btn rp-btn-primary" style="width:100%; justify-content:center; color:#FFF !important;">Review & Send Email ✉️</button>
      </form>
    `;
    contactCard.insertAdjacentHTML('beforeend', formHTML);

    document.getElementById('rp-contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Rakib,\n\n${message}\n\nBest regards,\n${name}\n(${email})`);
      window.location.href = `mailto:riasadrahmanrakib.24@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* 13. EASTER EGG */
  console.log(
    "%c 👋 Hello Fellow Developer! ",
    "background: #A3E635; color: #111827; font-size: 16px; font-weight: bold; padding: 6px 12px; border-radius: 6px;"
  );
  console.log("Looking under the hood? This portfolio was engineered by Riasad Rahman Rakib. Feel free to reach out at riasadrahmanrakib.24@gmail.com!");
});