// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('SW зарегистрирован!'))
    .catch(err => console.log('Ошибка SW:', err));
}

// Открытие / закрытие бокового меню
function toggleMenu() {
  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  
  if (menu && overlay) {
    menu.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

// Переключение экранов и подсветка нижней панели
function showTab(tabId) {
  // Скрываем все страницы
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
    page.classList.remove('active');
  });
  
  // Показываем нужную
  const selectedPage = document.getElementById(tabId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
    selectedPage.classList.add('active');
  }
  
  // Автоматически подсвечиваем нужную кнопку в нижней панели
  const navButtons = document.querySelectorAll('.bottom-nav .nav-btn');
  navButtons.forEach(btn => btn.classList.remove('active'));

  // Сопоставляем вкладки с кнопками навигации
  let btnIndex = 0;
  if (tabId === 'tab-home') btnIndex = 0;
  else if (tabId === 'tab-info') btnIndex = 1;
  else if (tabId === 'tab-support') btnIndex = 2;
  else if (tabId === 'tab-diary') btnIndex = 3;

  if (navButtons[btnIndex]) {
    navButtons[btnIndex].classList.add('active');
  }
  
  // Возвращаем скролл наверх страницы
  window.scrollTo(0, 0);
}

