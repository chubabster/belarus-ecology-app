// routes/problems.js
// Маршруты для работы с экологическими проблемами

const express = require('express');
const router = express.Router();
const pool = require('../database/config');

/**
 * GET /api/problems
 * Получить все экологические проблемы
 * Query параметры:
 *   - category: фильтр по категории
 *   - severity: фильтр по уровню серьёзности
 */
router.get('/', async (req, res) => {
  try {
    const { category, severity } = req.query;
    let query = 'SELECT * FROM problems';
    const params = [];
    const conditions = [];

    // Добавление фильтров
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    
    if (severity) {
      params.push(severity);
      conditions.push(`severity = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY severity DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Ошибка при получении проблем:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * GET /api/problems/:id
 * Получить конкретную проблему по ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM problems WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Проблема не найдена' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при получении проблемы:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * GET /api/problems/:id/solutions
 * Получить все решения для конкретной проблемы
 */
router.get('/:id/solutions', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверка существования проблемы
    const problemCheck = await pool.query(
      'SELECT id FROM problems WHERE id = $1',
      [id]
    );

    if (problemCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Проблема не найдена' 
      });
    }

    // Получение решений
    const result = await pool.query(
      'SELECT * FROM solutions WHERE problem_id = $1 ORDER BY impact DESC, difficulty ASC',
      [id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Ошибка при получении решений:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * POST /api/problems
 * Создать новую проблему (для администраторов)
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, category, severity, image_url } = req.body;

    // Валидация
    if (!title || !description || !category || !severity) {
      return res.status(400).json({ 
        success: false,
        error: 'Необходимо заполнить все обязательные поля' 
      });
    }

    const result = await pool.query(
      `INSERT INTO problems (title, description, category, severity, image_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, category, severity, image_url || null]
    );

    res.status(201).json({
      success: true,
      message: 'Проблема успешно создана',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при создании проблемы:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при создании проблемы',
      message: error.message 
    });
  }
});

module.exports = router;
