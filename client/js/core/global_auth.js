document.addEventListener('DOMContentLoaded', () => {
    // Sabhi zaroori elements ko select karna
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // --- Modal Dikhane Wale Triggers ---
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const switchToSignupLinks = document.querySelectorAll('.switch-to-signup');
    const switchToLoginLinks = document.querySelectorAll('.switch-to-login');

    if (loginButton) loginButton.addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });
    if (signupButton) signupButton.addEventListener('click', (e) => { e.preventDefault(); showSignupModal(); });
    
    switchToSignupLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); hideLoginModal(); showSignupModal(); }));
    switchToLoginLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); hideSignupModal(); showLoginModal(); }));


    // --- Authentication Guard ---
    const publicPages = ['landing.html', 'index.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    const isPublic = publicPages.includes(currentPage);

    if (!isPublic && !isLoggedIn) {
        showLoginModal();
    }

    // --- Login/Logout Logic ---
    if (isLoggedIn) {
        if (loginButton) loginButton.textContent = 'Log Out';
        if (signupButton) signupButton.style.display = 'none'; // Login hai toh "Create Resume" hide kar do
    }

    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            if (isLoggedIn) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                alert('You have been logged out.');
                window.location.reload();
            }
        });
    }

    // --- Form Submission ---
    const modalLoginForm = document.getElementById('modalLoginForm');
    if (modalLoginForm) {
        modalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Yahan validation logic add kar sakte hain
            localStorage.setItem('isLoggedIn', 'true');
            hideLoginModal();
            setTimeout(() => window.location.reload(), 300);
        });
    }
    
    const modalSignupForm = document.getElementById('modalSignupForm');
    if(modalSignupForm) {
        modalSignupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Yahan validation logic add kar sakte hain
            alert('Account created successfully! Please log in.');
            hideSignupModal();
            showLoginModal();
        });
    }

    // --- Password Toggle (Dono Modals ke liye) ---
    const toggleIcons = document.querySelectorAll('.password-toggle-icon');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const passwordInput = icon.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.textContent = 'visibility';
            } else {
                passwordInput.type = 'password';
                icon.textContent = 'visibility_off';
            }
        });
    });

    // --- Helper Functions ---
    function showLoginModal() { if (loginModal) { loginModal.classList.add('visible'); document.body.classList.add('no-scroll'); } }
    function hideLoginModal() { if (loginModal) { loginModal.classList.remove('visible'); document.body.classList.remove('no-scroll'); } }
    function showSignupModal() { if (signupModal) { signupModal.classList.add('visible'); document.body.classList.add('no-scroll'); } }
    function hideSignupModal() { if (signupModal) { signupModal.classList.remove('visible'); document.body.classList.remove('no-scroll'); } }
});

