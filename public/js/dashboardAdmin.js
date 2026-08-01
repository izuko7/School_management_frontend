// Vérification d'accès admin
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = '/login';
}


const logOut = document.getElementById('boutonDeconnexion');
logOut.addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/accueil'
})


const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.querySelector('.sidebar');

boutonBurger.addEventListener('click', function () {
    sidebar.classList.add('ouvert');
});

boutonFermerSidebar.addEventListener('click', function () {
    sidebar.classList.remove('ouvert');
});