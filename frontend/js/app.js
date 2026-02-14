// js/app.js
// Основной JavaScript файл приложения

console.log('🚀 Загрузка app.js...');

// Состояние приложения
const AppState = {
  problems: [],
  solutions: [],
  ideas: [],
  currentFilters: {
    problemCategory: 'all',
    solutionLevel: '',
    solutionDifficulty: '',
    solutionImpact: '',
    ideaCategory: '',
    ideaSort: 'date',
  },
};

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM загружен, начинаем инициализацию...');
  console.log('🌍 Приложение "Экология Беларуси" загружается...');
  
  // Проверяем наличие API
  if (typeof API === 'undefined') {
    console.error('❌ API не загружен! Проверьте что api.js подключен перед app.js');
    return;
  }
  console.log('✅ API доступен');
  
  // Инициализация навигации
  initNavigation();
  
  // Инициализация модальных окон
  initModals();
  
  // Загрузка данных
  await loadAllData();
  
  // Инициализация фильтров
  initFilters();
  
  console.log('✅ Приложение готово к работе!');
});

/**
 * Навигация
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  console.log('✅ Навигация инициализирована');
}

/**
 * Инициализация модальных окон
 */
function initModals() {
  console.log('🔧 Начало инициализации модальных окон...');
  
  // Получаем элементы
  const addIdeaBtn = document.getElementById('addIdeaBtn');
  const ideaModal = document.getElementById('ideaModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const ideaForm = document.getElementById('ideaForm');
  
  // Подробная диагностика
  console.log('Проверка элементов:');
  console.log('  addIdeaBtn:', addIdeaBtn ? '✅ найдена' : '❌ не найдена');
  console.log('  ideaModal:', ideaModal ? '✅ найдено' : '❌ не найдено');
  console.log('  modalOverlay:', modalOverlay ? '✅ найден' : '❌ не найден');
  console.log('  modalClose:', modalClose ? '✅ найдена' : '❌ не найдена');
  console.log('  cancelBtn:', cancelBtn ? '✅ найдена' : '❌ не найдена');
  console.log('  ideaForm:', ideaForm ? '✅ найдена' : '❌ не найдена');
  
  if (!addIdeaBtn || !ideaModal) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Основные элементы модального окна не найдены!');
    console.error('Проверьте что в HTML есть:');
    console.error('  <button id="addIdeaBtn">');
    console.error('  <div id="ideaModal">');
    return;
  }
  
  console.log('✅ Все элементы найдены, настраиваем обработчики...');
  
  // Функция открытия модального окна
  const openModal = () => {
    console.log('🔓 ОТКРЫТИЕ модального окна');
    ideaModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  // Функция закрытия модального окна
  const closeModal = () => {
    console.log('🔒 ЗАКРЫТИЕ модального окна');
    ideaModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (ideaForm) ideaForm.reset();
  };
  
  // Обработчик кнопки "Добавить идею"
  addIdeaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('👆 КЛИК по кнопке "Добавить идею"');
    openModal();
  });
  
  // Обработчик закрытия
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      console.log('👆 Клик по overlay');
      closeModal();
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      console.log('👆 Клик по кнопке закрытия');
      closeModal();
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      console.log('👆 Клик по кнопке "Отмена"');
      closeModal();
    });
  }
  
  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ideaModal.classList.contains('active')) {
      console.log('⌨️ Нажата клавиша Escape');
      closeModal();
    }
  });
  
  // Обработчик отправки формы
  if (ideaForm) {
    ideaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('📝 Отправка формы');
      await handleIdeaSubmit(e);
    });
  }
  
  // Инициализация модального окна для проблем
  const problemModal = document.getElementById('problemModal');
  const problemModalOverlay = document.getElementById('problemModalOverlay');
  const problemModalClose = document.getElementById('problemModalClose');
  
  const closeProblemModal = () => {
    if (problemModal) {
      problemModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };
  
  if (problemModalOverlay) {
    problemModalOverlay.addEventListener('click', closeProblemModal);
  }
  
  if (problemModalClose) {
    problemModalClose.addEventListener('click', closeProblemModal);
  }
  
  console.log('✅ Модальные окна полностью инициализированы!');
}

/**
 * Загрузка всех данных
 */
async function loadAllData() {
  try {
    console.log('📥 Загрузка данных из API...');
    
    await loadProblems();
    await loadSolutions();
    await loadIdeas();
    
    updateStats();
    
    console.log('✅ Все данные загружены');
  } catch (error) {
    console.error('❌ Ошибка при загрузке данных:', error);
    showError('Не удалось загрузить данные. Проверьте подключение к серверу.');
  }
}

/**
 * Загрузка проблем
 */
async function loadProblems(category = 'all') {
  try {
    const filters = category === 'all' ? {} : { category };
    AppState.problems = await API.getProblems(filters);
    renderProblems(AppState.problems);
  } catch (error) {
    console.error('❌ Ошибка при загрузке проблем:', error);
    document.getElementById('problemsGrid').innerHTML = 
      '<p class="error-message">Ошибка при загрузке проблем. Проверьте что backend сервер запущен.</p>';
  }
}

/**
 * Отрисовка проблем
 */
function renderProblems(problems) {
  const grid = document.getElementById('problemsGrid');
  
  if (!grid) {
    console.error('❌ Элемент problemsGrid не найден');
    return;
  }
  
  if (problems.length === 0) {
    grid.innerHTML = '<p class="empty-message">Проблемы не найдены. Добавьте их через API или SQL.</p>';
    return;
  }
  
  grid.innerHTML = problems.map(problem => `
    <div class="problem-card" onclick="showProblemDetails(${problem.id})">
      <div class="problem-image" style="background: linear-gradient(135deg, ${getCategoryColor(problem.category)})"></div>
      <div class="problem-content">
        <span class="problem-category">${problem.category}</span>
        <h3 class="problem-title">${problem.title}</h3>
        <p class="problem-description">${problem.description}</p>
        <div class="problem-severity severity-${problem.severity}">
          <span class="severity-badge"></span>
          <span>Уровень: ${problem.severity}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Показать детали проблемы
 */
async function showProblemDetails(problemId) {
  try {
    console.log('📖 Показываем детали проблемы:', problemId);
    const problem = await API.getProblemById(problemId);
    const solutions = await API.getSolutionsForProblem(problemId);
    
    const modal = document.getElementById('problemModal');
    const content = document.getElementById('problemModalContent');
    
    content.innerHTML = `
      <div class="problem-detail">
        <span class="problem-category">${problem.category}</span>
        <h2 class="problem-title">${problem.title}</h2>
        <div class="problem-severity severity-${problem.severity}">
          <span class="severity-badge"></span>
          <span>Уровень серьёзности: ${problem.severity}</span>
        </div>
        <p class="problem-description" style="margin-top: 1.5rem; -webkit-line-clamp: unset;">
          ${problem.description}
        </p>
        
        ${solutions.length > 0 ? `
          <div style="margin-top: 2rem;">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">
              Решения этой проблемы
            </h3>
            <div class="solutions-list">
              ${solutions.map(solution => `
                <div class="solution-card">
                  <div class="solution-header">
                    <h4 class="solution-title">${solution.title}</h4>
                    <div class="solution-badges">
                      <span class="badge badge-level">${solution.level}</span>
                      <span class="badge badge-difficulty-${solution.difficulty}">${solution.difficulty}</span>
                      <span class="badge badge-impact-${solution.impact}">${solution.impact}</span>
                    </div>
                  </div>
                  <p class="solution-description">${solution.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : '<p style="margin-top: 2rem; opacity: 0.7;">Решения для этой проблемы пока не добавлены.</p>'}
      </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('❌ Ошибка при загрузке деталей проблемы:', error);
    showError('Не удалось загрузить детали проблемы');
  }
}

/**
 * Загрузка решений
 */
async function loadSolutions(filters = {}) {
  try {
    AppState.solutions = await API.getSolutions(filters);
    renderSolutions(AppState.solutions);
  } catch (error) {
    console.error('❌ Ошибка при загрузке решений:', error);
    document.getElementById('solutionsList').innerHTML = 
      '<p class="error-message">Ошибка при загрузке решений</p>';
  }
}

/**
 * Отрисовка решений
 */
function renderSolutions(solutions) {
  const list = document.getElementById('solutionsList');
  
  if (!list) return;
  
  if (solutions.length === 0) {
    list.innerHTML = '<p class="empty-message">Решения не найдены. Добавьте их через API.</p>';
    return;
  }
  
  list.innerHTML = solutions.map(solution => `
    <div class="solution-card">
      <div class="solution-header">
        <h3 class="solution-title">${solution.title}</h3>
        <div class="solution-badges">
          <span class="badge badge-level">${solution.level}</span>
          <span class="badge badge-difficulty-${solution.difficulty}">${solution.difficulty}</span>
          <span class="badge badge-impact-${solution.impact}">${solution.impact}</span>
        </div>
      </div>
      <p class="solution-description">${solution.description}</p>
    </div>
  `).join('');
}

/**
 * Загрузка идей
 */
async function loadIdeas(params = {}) {
  try {
    AppState.ideas = await API.getIdeas(params);
    renderIdeas(AppState.ideas);
  } catch (error) {
    console.error('❌ Ошибка при загрузке идей:', error);
    document.getElementById('ideasGrid').innerHTML = 
      '<p class="error-message">Ошибка при загрузке идей</p>';
  }
}

/**
 * Отрисовка идей
 */
function renderIdeas(ideas) {
  const grid = document.getElementById('ideasGrid');
  
  if (!grid) return;
  
  if (ideas.length === 0) {
    grid.innerHTML = '<p class="empty-message">Идеи пока не добавлены. Будьте первым! Нажмите "Добавить идею"</p>';
    return;
  }
  
  grid.innerHTML = ideas.map(idea => `
    <div class="idea-card">
      <div class="idea-header">
        <span class="idea-author">👤 ${idea.author_name}</span>
        <span class="idea-date">${formatDate(idea.created_at)}</span>
      </div>
      <h3 class="idea-title">${idea.title}</h3>
      <span class="idea-category">${idea.category}</span>
      <p class="idea-description">${idea.description}</p>
      <div class="idea-footer">
        <div class="idea-votes">
          <button class="vote-btn" onclick="handleVote(${idea.id})">
            <span>👍</span>
            <span>Поддержать</span>
          </button>
          <span class="vote-count">${idea.votes} ${pluralize(idea.votes, ['голос', 'голоса', 'голосов'])}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Обработка отправки идеи
 */
async function handleIdeaSubmit(e) {
  console.log('📤 Обработка отправки формы идеи');
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    const formData = {
      author_name: document.getElementById('authorName').value,
      title: document.getElementById('ideaTitle').value,
      description: document.getElementById('ideaDescription').value,
      category: document.getElementById('ideaCategory').value,
    };
    
    console.log('Данные формы:', formData);
    
    await API.createIdea(formData);
    
    console.log('✅ Идея успешно создана');
    
    // Закрываем модальное окно
    document.getElementById('ideaModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    e.target.reset();
    
    // Перезагружаем идеи
    await loadIdeas(getCurrentIdeaFilters());
    
    // Обновляем статистику
    updateStats();
    
    // Показываем уведомление
    showNotification('Спасибо! Ваша идея успешно добавлена', 'success');
  } catch (error) {
    console.error('❌ Ошибка при отправке идеи:', error);
    showNotification('Ошибка при отправке идеи. Проверьте что backend сервер запущен.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Обработка голосования за идею
 */
async function handleVote(ideaId) {
  try {
    console.log('👍 Голосуем за идею:', ideaId);
    await API.voteForIdea(ideaId);
    
    await loadIdeas(getCurrentIdeaFilters());
    
    showNotification('Голос учтён!', 'success');
  } catch (error) {
    console.error('❌ Ошибка при голосовании:', error);
    showNotification('Ошибка при голосовании', 'error');
  }
}

/**
 * Инициализация фильтров
 */
function initFilters() {
  // Фильтры проблем
  const problemFilters = document.querySelectorAll('.filter-btn');
  problemFilters.forEach(btn => {
    btn.addEventListener('click', async () => {
      problemFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      AppState.currentFilters.problemCategory = category;
      await loadProblems(category);
    });
  });
  
  // Фильтры решений
  const levelFilter = document.getElementById('levelFilter');
  const difficultyFilter = document.getElementById('difficultyFilter');
  const impactFilter = document.getElementById('impactFilter');
  
  [levelFilter, difficultyFilter, impactFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', async () => {
        const filters = {
          level: levelFilter.value,
          difficulty: difficultyFilter.value,
          impact: impactFilter.value,
        };
        
        Object.keys(filters).forEach(key => {
          if (!filters[key]) delete filters[key];
        });
        
        await loadSolutions(filters);
      });
    }
  });
  
  // Фильтры идей
  const ideaCategoryFilter = document.getElementById('ideaCategoryFilter');
  const ideaSortFilter = document.getElementById('ideaSortFilter');
  
  [ideaCategoryFilter, ideaSortFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', async () => {
        await loadIdeas(getCurrentIdeaFilters());
      });
    }
  });
  
  console.log('✅ Фильтры инициализированы');
}

/**
 * Получить текущие фильтры идей
 */
function getCurrentIdeaFilters() {
  const categoryFilter = document.getElementById('ideaCategoryFilter');
  const sortFilter = document.getElementById('ideaSortFilter');
  
  const category = categoryFilter ? categoryFilter.value : '';
  const sort = sortFilter ? sortFilter.value : 'date';
  
  const filters = {
    sort,
    order: 'desc',
  };
  
  if (category) {
    filters.category = category;
  }
  
  return filters;
}

/**
 * Обновление статистики
 */
function updateStats() {
  const problemsCount = document.getElementById('problemsCount');
  const solutionsCount = document.getElementById('solutionsCount');
  const ideasCount = document.getElementById('ideasCount');
  
  if (problemsCount) animateCounter(problemsCount, AppState.problems.length);
  if (solutionsCount) animateCounter(solutionsCount, AppState.solutions.length);
  if (ideasCount) animateCounter(ideasCount, AppState.ideas.length);
}

/**
 * Анимация счётчика
 */
function animateCounter(element, target) {
  const duration = 1000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Плюрализация
 */
function pluralize(number, forms) {
  const cases = [2, 0, 1, 1, 1, 2];
  return forms[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
}

/**
 * Получить цвет категории
 */
function getCategoryColor(category) {
  const colors = {
    'Вода': '#4a7c9e, #74c0e3',
    'Леса': '#2d6a4f, #52b788',
    'Воздух': '#74c0e3, #95d5b2',
    'Отходы': '#8b6f47, #d4a574',
    'Радиация': '#d64545, #e97451',
    'Почва': '#8b6f47, #95d5b2',
  };
  return colors[category] || '#52b788, #95d5b2';
}

/**
 * Показать уведомление
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 2rem;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? 'var(--meadow-green)' : 'var(--danger-red)'};
    color: white;
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    z-index: 3000;
    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Показать ошибку
 */
function showError(message) {
  showNotification(message, 'error');
}

// Добавляем CSS для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
    }
  }
  
  .empty-message, .error-message {
    text-align: center;
    padding: 3rem;
    color: var(--forest-green);
    font-size: 1.125rem;
  }
  
  .error-message {
    color: var(--danger-red);
  }
`;
document.head.appendChild(style);

// Экспортируем функции для глобального доступа
window.showProblemDetails = showProblemDetails;
window.handleVote = handleVote;

console.log('✅ app.js полностью загружен');
