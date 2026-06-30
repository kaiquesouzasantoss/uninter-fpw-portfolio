/**
 * ========================================
 * PORTFÓLIO PESSOAL - JAVASCRIPT
 * ========================================
 * Script responsável pela navegação, interações visuais,
 * validação de formulário, persistência de seção e tema.
 *
 * Autor: Célio Marcos Moreira Santiago - UNINTER
 * Versão: 1.0
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * ========================================
     * SELETORES PRINCIPAIS
     * ========================================
     */

    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const header = document.querySelector('.main-header');

    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');

    const themeToggleButton = document.getElementById('theme-toggle');

    /**
     * ========================================
     * NAVEGAÇÃO ENTRE SEÇÕES
     * ========================================
     */

    function clearActiveNavigationState() {
        contentSections.forEach(section => section.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
    }

    function showSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        const targetLink = document.querySelector(`a[href="${sectionId}"]`);

        if (!targetSection) return;

        clearActiveNavigationState();

        targetSection.classList.add('active');

        if (targetLink) {
            targetLink.classList.add('active');
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function handleNavigationClick(event) {
        event.preventDefault();

        const sectionId = event.currentTarget.getAttribute('href');

        showSection(sectionId);
        localStorage.setItem('currentSection', sectionId);
    }

    function restoreLastVisitedSection() {
        const savedSection = localStorage.getItem('currentSection') || '#sobre';
        showSection(savedSection);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigationClick);
    });

    restoreLastVisitedSection();

    /**
     * ========================================
     * HEADER COM FEEDBACK VISUAL NO SCROLL
     * ========================================
     */

    function updateHeaderShadow() {
        if (!header) return;

        const hasScrolled = window.scrollY > 50;

        header.style.boxShadow = hasScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    window.addEventListener('scroll', updateHeaderShadow);

    /**
     * ========================================
     * FORMULÁRIO DE CONTATO
     * ========================================
     */

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function showFormMessage(message, type) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }

    function validateFormField(condition, message, inputElement) {
        if (!condition) return false;

        showFormMessage(message, 'error');

        if (inputElement) {
            inputElement.focus();
        }

        return true;
    }

    function setSubmitButtonLoadingState(isLoading) {
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Enviando...' : 'Enviar Mensagem';
        submitButton.classList.toggle('sending', isLoading);
    }

    function resetFormWithSuccessFeedback() {
        form.reset();

        showFormMessage('Mensagem enviada com sucesso!', 'success');

        form.classList.add('form-success');

        setTimeout(() => {
            form.classList.remove('form-success');
        }, 500);

        setSubmitButtonLoadingState(false);
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const mensagemInput = document.getElementById('mensagem');

        const nome = nomeInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const mensagem = mensagemInput?.value.trim() || '';

        if (validateFormField(nome === '', 'Por favor, preencha o campo Nome Completo.', nomeInput)) return;
        if (validateFormField(nome.length < 3, 'O nome deve conter pelo menos 3 caracteres.', nomeInput)) return;

        if (validateFormField(email === '', 'Por favor, preencha o campo Email.', emailInput)) return;
        if (validateFormField(!isValidEmail(email), 'Por favor, informe um email válido. Exemplo: usuario@dominio.com', emailInput)) return;

        if (validateFormField(mensagem === '', 'Por favor, preencha o campo Mensagem.', mensagemInput)) return;
        if (validateFormField(mensagem.length < 10, 'A mensagem deve conter pelo menos 10 caracteres.', mensagemInput)) return;

        setSubmitButtonLoadingState(true);

        setTimeout(resetFormWithSuccessFeedback, 800);
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    /**
     * ========================================
     * ANIMAÇÃO DAS BARRAS DE IDIOMAS
     * ========================================
     */

    function animateLanguageBars() {
        const languageBars = document.querySelectorAll('.level-fill');

        languageBars.forEach(bar => {
            const originalWidth = bar.style.width;

            bar.style.width = '0';

            setTimeout(() => {
                bar.style.width = originalWidth;
            }, 300);
        });
    }

    const educationLink = document.querySelector('a[href="#formacao"]');

    if (educationLink) {
        educationLink.addEventListener('click', () => {
            setTimeout(animateLanguageBars, 100);
        });
    }

    /**
     * ========================================
     * EFEITO VISUAL NOS ÍCONES DOS PROJETOS
     * ========================================
     */

    function applyProjectIconMovement(event) {
        const icon = event.currentTarget;
        const rect = icon.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((mouseY - centerY) / centerY) * 10;
        const rotateY = ((mouseX - centerX) / centerX) * 10;

        icon.style.transform = `
            perspective(1000px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            scale(1.1)
        `;
    }

    function resetProjectIconMovement(event) {
        event.currentTarget.style.transform =
            'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    }

    document.querySelectorAll('.project-icon').forEach(icon => {
        icon.addEventListener('mousemove', applyProjectIconMovement);
        icon.addEventListener('mouseleave', resetProjectIconMovement);
    });

    /**
     * ========================================
     * LAZY LOADING DE IMAGENS
     * ========================================
     */

    function enableLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (!('IntersectionObserver' in window)) {
            lazyImages.forEach(image => {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
            });

            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const image = entry.target;

                image.src = image.dataset.src;
                image.removeAttribute('data-src');

                observer.unobserve(image);
            });
        });

        lazyImages.forEach(image => imageObserver.observe(image));
    }

    enableLazyLoading();

    /**
     * ========================================
     * TEMA CLARO E ESCURO
     * ========================================
     */

    function updateThemeButton(isDarkTheme) {
        if (!themeToggleButton) return;

        themeToggleButton.textContent = isDarkTheme
            ? '☀️'
            : '🌙';
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isDarkTheme = savedTheme === 'dark';

        document.body.classList.toggle('dark-theme', isDarkTheme);
        updateThemeButton(isDarkTheme);
    }

    function toggleTheme() {
        const isDarkTheme = document.body.classList.toggle('dark-theme');

        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        updateThemeButton(isDarkTheme);
    }

    applySavedTheme();

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    /**
     * ========================================
     * ACESSIBILIDADE E NAVEGAÇÃO POR TECLADO
     * ========================================
     */

    function navigateBetweenSections(direction) {
        const links = Array.from(navLinks);
        const activeLink = document.querySelector('.nav-link.active');

        if (!links.length || !activeLink) return;

        const currentIndex = links.indexOf(activeLink);
        const nextIndex = (currentIndex + direction + links.length) % links.length;

        links[nextIndex].click();
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') {
            navigateBetweenSections(1);
        }

        if (event.key === 'ArrowLeft') {
            navigateBetweenSections(-1);
        }

        if (event.key === 'Escape') {
            /*
             * Espaço reservado para fechamento de modais,
             * menus suspensos ou outros componentes futuros.
             */
        }
    });

    /**
     * ========================================
     * MENSAGENS GERAIS DE FEEDBACK
     * ========================================
     */

    function showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');

        messageElement.className = `feedback-message ${type}`;
        messageElement.textContent = message;

        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    /**
     * ========================================
     * PERFORMANCE
     * ========================================
     */

    function debounce(callback, delay) {
        let timeoutId;

        return (...args) => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    }

    const handleOptimizedResize = debounce(() => {
        console.log('Janela redimensionada');
    }, 250);

    window.addEventListener('resize', handleOptimizedResize);

    /**
     * ========================================
     * CONSOLE EASTER EGG
     * ========================================
     */

    console.log(
        '%c🚀 Bem-vindo ao meu portfólio!',
        'font-size: 20px; color: #2563eb; font-weight: bold;'
    );

    console.log(
        '%c💻 Desenvolvido com HTML, CSS e JavaScript puro',
        'font-size: 14px; color: #10b981;'
    );

    console.log(
        '%c📧 Entre em contato: celiomarcos@gmail.com',
        'font-size: 14px; color: #94a3b8;'
    );
});
