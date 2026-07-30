const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const searchForm = document.querySelectorAll('#searchForm');
const searchInput = document.querySelectorAll('#searchInput');
const destinationList = document.getElementById('destinationList');
const searchResults = document.getElementById('searchResults');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const heroSlider = document.getElementById('heroSlider');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');

let currentSlide = 0;
let slideInterval = null;

function toggleNav() {
    if (!siteNav) return;
    siteNav.classList.toggle('open');
}

function setActiveSlide(index) {
    const slides = heroSlider?.querySelectorAll('.slide');
    if (!slides?.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentSlide);
    });
}

function moveSlide(direction) {
    setActiveSlide(currentSlide + direction);
}

function startSlider() {
    if (!heroSlider) return;
    slideInterval = setInterval(() => moveSlide(1), 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

function handleSearch(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('input[type="search"]');
    const query = input.value.trim().toLowerCase();
    if (!query || !destinationList) {
        if (searchResults) searchResults.textContent = '';
        return;
    }

    const items = destinationList.querySelectorAll('.place');
    let matchCount = 0;

    items.forEach(item => {
        const searchText = item.dataset.search || item.textContent.toLowerCase();
        const matches = searchText.includes(query);
        item.style.display = matches ? 'block' : 'none';
        if (matches) matchCount += 1;
    });

    if (searchResults) {
        searchResults.textContent = matchCount > 0 ? `${matchCount} destination(s) found for "${query}"` : `No destinations matched "${query}". Try another keyword.`;
    }
}

function loadSearchForms() {
    searchForm.forEach(form => {
        form?.addEventListener('submit', handleSearch);
    });
}

function saveContactForm(event) {
    event.preventDefault();
    if (!contactForm || !formMessage) return;

    const formData = {
        username: contactForm.username.value.trim(),
        age: contactForm.age.value.trim(),
        phone: contactForm.phone.value.trim(),
        gender: contactForm.gender.value,
        message: contactForm.message.value.trim(),
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('heritageContact', JSON.stringify(formData));
    formMessage.textContent = 'Your details have been saved locally. You can revisit this page anytime.';
}

function loadContactForm() {
    if (!contactForm) return;
    const saved = localStorage.getItem('heritageContact');
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        contactForm.username.value = data.username || '';
        contactForm.age.value = data.age || '';
        contactForm.phone.value = data.phone || '';
        contactForm.message.value = data.message || '';
        if (data.gender) {
            const genderInput = contactForm.querySelector(`input[name="gender"][value="${data.gender}"]`);
            if (genderInput) genderInput.checked = true;
        }
    } catch (error) {
        console.warn('Could not parse saved contact form data', error);
    }
}

function init() {
    if (navToggle) navToggle.addEventListener('click', toggleNav);
    if (prevButton) prevButton.addEventListener('click', () => {
        moveSlide(-1);
        stopSlider();
        startSlider();
    });
    if (nextButton) nextButton.addEventListener('click', () => {
        moveSlide(1);
        stopSlider();
        startSlider();
    });

    loadSearchForms();
    loadContactForm();
    setActiveSlide(0);
    startSlider();

    if (contactForm) {
        contactForm.addEventListener('submit', saveContactForm);
    }
}

window.addEventListener('DOMContentLoaded', init);
