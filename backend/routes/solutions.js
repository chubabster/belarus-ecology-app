// routes/solutions.js
// Маршруты для работы с решениями экологических проблем

const express = require('express');
const router = express.Router();
const pool = require('../database/config');

/**
 * GET /api/solutions
 * Получить все решения
 * Query параметры:
 *   - level: фильтр по уровню (индивидуальный, общественный, государственный)
 *   - difficulty: фильтр по сложности
 *   - impact: фильтр по влиянию
 */
router.get('/', async (req, res) => {
  try {
    const { level, difficulty, impact } = req.query;
    let query = 'SELECT * FROM solutions';
    const params = [];
    const conditions = [];

    // Добавление фильтров
    if (level) {
      params.push(level);
      conditions.push(`level = $${params.length}`);
    }
    
    if (difficulty) {
      params.push(difficulty);
      conditions.push(`difficulty = $${params.length}`);
    }

    if (impact) {
      params.push(impact);
      conditions.push(`impact = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY impact DESC, difficulty ASC';

    const result = await pool.query(query, params);
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
 * GET /api/solutions/:id
 * Получить конкретное решение по ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM solutions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Решение не найдено' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при получении решения:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * POST /api/solutions
 * Создать новое решение
 */
router.post('/', async (req, res) => {
  try {
    const { problem_id, title, description, level, difficulty, impact } = req.body;

    // Валидация
    if (!problem_id || !title || !description || !level || !difficulty || !impact) {
      return res.status(400).json({ 
        success: false,
        error: 'Необходимо заполнить все обязательные поля' 
      });
    }

    // Проверка существования проблемы
    const problemCheck = await pool.query(
      'SELECT id FROM problems WHERE id = $1',
      [problem_id]
    );

    if (problemCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Проблема с указанным ID не найдена' 
      });
    }

    const result = await pool.query(
      `INSERT INTO solutions (problem_id, title, description, level, difficulty, impact) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [problem_id, title, description, level, difficulty, impact]
    );

    res.status(201).json({
      success: true,
      message: 'Решение успешно создано',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при создании решения:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при создании решения',
      message: error.message 
    });
  }
});

module.exports = router;
