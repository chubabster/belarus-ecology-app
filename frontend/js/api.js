// js/api.js
// Модуль для взаимодействия с REST API

const API_BASE_URL = 'https://belarus-ecology-backend.onrender.com/api';

/**
 * API клиент для работы с бэкендом
 */
const API = {
  /**
   * Получить все проблемы
   * @param {Object} filters - Фильтры (category, severity)
   * @returns {Promise<Array>}
   */
  async getProblems(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/problems?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при получении проблем:', error);
      throw error;
    }
  },

  /**
   * Получить проблему по ID
   * @param {number} id - ID проблемы
   * @returns {Promise<Object>}
   */
  async getProblemById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/problems/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при получении проблемы:', error);
      throw error;
    }
  },

  /**
   * Получить решения для проблемы
   * @param {number} problemId - ID проблемы
   * @returns {Promise<Array>}
   */
  async getSolutionsForProblem(problemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/problems/${problemId}/solutions`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при получении решений:', error);
      throw error;
    }
  },

  /**
   * Получить все решения
   * @param {Object} filters - Фильтры (level, difficulty, impact)
   * @returns {Promise<Array>}
   */
  async getSolutions(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/solutions?${params}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при получении решений:', error);
      throw error;
    }
  },

  /**
   * Получить все идеи
   * @param {Object} params - Параметры (category, status, sort, order)
   * @returns {Promise<Array>}
   */
  async getIdeas(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/ideas?${queryParams}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при получении идей:', error);
      throw error;
    }
  },

  /**
   * Создать новую идею
   * @param {Object} ideaData - Данные идеи
   * @returns {Promise<Object>}
   */
  async createIdea(ideaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при создании идеи:', error);
      throw error;
    }
  },

  /**
   * Обновить идею
   * @param {number} id - ID идеи
   * @param {Object} updateData - Данные для обновления
   * @returns {Promise<Object>}
   */
  async updateIdea(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при обновлении идеи:', error);
      throw error;
    }
  },

  /**
   * Удалить идею
   * @param {number} id - ID идеи
   * @returns {Promise<Object>}
   */
  async deleteIdea(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при удалении идеи:', error);
      throw error;
    }
  },

  /**
   * Проголосовать за идею
   * @param {number} id - ID идеи
   * @returns {Promise<Object>}
   */
  async voteForIdea(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${id}/vote`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error) {
      console.error('Ошибка при голосовании:', error);
      throw error;
    }
  },
};

// Экспортируем API
window.API = API;
