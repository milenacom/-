// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('SW зарегистрирован!'))
    .catch(err => console.log('Ошибка SW:', err));
}

// Открытие / закрытие бокового меню
function toggleMenu() {
  const menu = document.getElementById('sideMenu'); // Исправлено с 'side-menu' на 'sideMenu'
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
  else if (tabId === 'tab-stories') btnIndex = 2;
  else if (tabId === 'tab-diary') btnIndex = 3;
  else if (tabId === 'tab-support') btnIndex = 4;

  if (navButtons[btnIndex]) {
    navButtons[btnIndex].classList.add('active');
  }
  
  // Возвращаем скролл наверх страницы
  window.scrollTo(0, 0);
}


// ДНЕВНИК

const STORAGE_KEY = 'telo_diary_entries';

// Сохранение новой записи
function addDiaryEntry() {
  const input = document.getElementById('diaryInput');
  const text = input.value.trim();

  if (!text) {
    alert('Напишите хотя бы пару слов перед сохранением.');
    return;
  }

  const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  const newEntry = {
    id: Date.now(),
    text: text,
    timestamp: new Date().toISOString()
  };

  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

  input.value = '';
  renderDiaryEntries();
}

// Удаление записи
function deleteDiaryEntry(id) {
  if (!confirm('Точно удалить эту запись?')) return;
  
  let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  entries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  renderDiaryEntries();
}

// Определение заголовка дня ("Сегодня", "Вчера" или дата)
function getDayLabel(isoString) {
  const entryDate = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(entryDate, today)) return 'Сегодня';
  if (isSameDay(entryDate, yesterday)) return 'Вчера';

  return entryDate.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Отрисовка всех записей на экране
function renderDiaryEntries() {
  const container = document.getElementById('diaryEntriesContainer');
  if (!container) return;

  const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="info-card" style="text-align: center; opacity: 0.7;">
        <p>В дневнике пока пусто. Сделай первую запись выше!</p>
      </div>`;
    return;
  }

  const grouped = {};
  entries.forEach(entry => {
    const label = getDayLabel(entry.timestamp);
    if (!grouped[label]) {
      grouped[label] = [];
    }
    grouped[label].push(entry);
  });

  let html = '';
  for (const [dayLabel, dayEntries] of Object.entries(grouped)) {
    html += `<h4 style="margin: 20px 0 10px 4px; color: #555;">${dayLabel}</h4>`;
    
    dayEntries.forEach(entry => {
      const time = new Date(entry.timestamp).toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      html += `
        <div class="info-card" style="margin-bottom: 12px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px; color: #888;">
            <span>🕒 ${time}</span>
            <button onclick="deleteDiaryEntry(${entry.id})" style="background: none; border: none; color: #b55; cursor: pointer; font-size: 14px;">Удалить</button>
          </div>
          <p style="white-space: pre-wrap; margin: 0;">${escapeHTML(entry.text)}</p>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

// Защита от ввода HTML-тегов
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

// Первичная отрисовка при загрузке приложения
document.addEventListener('DOMContentLoaded', renderDiaryEntries);
