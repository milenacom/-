if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('SW зарегистрирован!'))
    .catch(err => console.log('Ошибка SW:', err));
}

function toggleMenu() {
  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  
  menu.classList.toggle('open');
  overlay.classList.toggle('active');
}

function showTab(tabId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');
  
  const selectedPage = document.getElementById(tabId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
}
