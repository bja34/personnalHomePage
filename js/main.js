const frFlag = document.getElementById('fr-flag');
const enFlag = document.getElementById('en-flag');
const LANG_KEY = 'preferredLang';

// Applique la langue aux éléments marqués data-i18n-key
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.dataset.i18nKey;
    // si c'est un champ placeholder
    if (el.placeholder !== undefined && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    } else if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  // stocke la préférence
  localStorage.setItem(LANG_KEY, lang);
}

// Sélection visuelle du drapeau
function updateFlagSelection(lang) {
  if (lang === 'fr') {
    frFlag.classList.add('selected');
    enFlag.classList.remove('selected');
    document.documentElement.lang = 'fr';
  } else {
    enFlag.classList.add('selected');
    frFlag.classList.remove('selected');
    document.documentElement.lang = 'en';
  }
}

frFlag.addEventListener('click', () => {
  applyTranslations('fr');
  updateFlagSelection('fr');
});

enFlag.addEventListener('click', () => {
  applyTranslations('en');
  updateFlagSelection('en');
});

// Au chargement, on récupère la langue préférée ou on met le français par défaut
const initialLang = localStorage.getItem(LANG_KEY) || 'fr';
applyTranslations(initialLang);
updateFlagSelection(initialLang);

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: sanitizeInput(formData.get('name')),
                email: sanitizeInput(formData.get('email')),
                message: sanitizeInput(formData.get('message'))
            };

            // Validate data
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';

            try {
                // Send email using FormSubmit service
                const response = await fetch('https://formsubmit.co/mikael@baldassin.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Message envoyé avec succès !');
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

// Input sanitization
function sanitizeInput(input) {
    // Remove HTML tags
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Form validation
function validateForm(data) {
    // Name validation
    if (!/^[A-Za-zÀ-ÿ\s-]{2,50}$/.test(data.name)) {
        alert('Le nom doit contenir entre 2 et 50 caractères, uniquement des lettres, espaces et tirets');
        return false;
    }

    // Email validation
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(data.email)) {
        alert('Veuillez entrer une adresse email valide');
        return false;
    }

    // Message validation
    if (data.message.length < 10 || data.message.length > 1000) {
        alert('Le message doit contenir entre 10 et 1000 caractères');
        return false;
    }

    return true;
}

// Function to load components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load components when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load social icons components
    loadComponent('contact-social-icons', '/components/social-icons.html');
    loadComponent('footer-social-icons', '/components/social-icons.html');
    
    // ... rest of your existing main.js code ...
});
