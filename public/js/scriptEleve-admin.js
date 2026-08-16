// Vérification d'accès admin (de base)
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = '/login';
}


const fetchAuth = async (url, method = 'GET', body = null) => {

    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const reponse = await fetch(url, options);

    if (reponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error("Token expiré");
    }

    return reponse.json();
};







// Menu burgur 
// Gestion du menu Burger (Sidebar mobile)
const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.getElementById('sidebar');

// Ouvrir avec le burger
boutonBurger.addEventListener('click', () => {
    sidebar.classList.add('ouvert');
});

// Fermer avec la croix
boutonFermerSidebar.addEventListener('click', () => {
    sidebar.classList.remove('ouvert');
});

// Fermer le menu si on clique sur un lien à l'intérieur
document.querySelectorAll('.sidebar .nav-item').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('ouvert');
    });
});