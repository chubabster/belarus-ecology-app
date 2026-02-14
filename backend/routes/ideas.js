// routes/ideas.js
// Маршруты для работы с идеями пользователей по улучшению экологии

const express = require('express');
const router = express.Router();
const pool = require('../database/config');

/**
 * GET /api/ideas
 * Получить все идеи пользователей
 * Query параметры:
 *   - category: фильтр по категории
 *   - status: фильтр по статусу
 *   - sort: сортировка (votes, date)
 *   - order: порядок (asc, desc)
 */
router.get('/', async (req, res) => {
  try {
    const { category, status, sort = 'date', order = 'desc' } = req.query;
    let query = 'SELECT * FROM ideas';
    const params = [];
    const conditions = [];

    // Добавление фильтров
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Сортировка
    const sortColumn = sort === 'votes' ? 'votes' : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Ошибка при получении идей:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * GET /api/ideas/:id
 * Получить конкретную идею по ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM ideas WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Идея не найдена' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при получении идеи:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при получении данных',
      message: error.message 
    });
  }
});

/**
 * POST /api/ideas
 * Создать новую идею
 */
router.post('/', async (req, res) => {
  try {
    const { author_name, title, description, category } = req.body;

    // Валидация
    if (!author_name || !title || !description || !category) {
      return res.status(400).json({ 
        success: false,
        error: 'Необходимо заполнить все обязательные поля' 
      });
    }

    // Валидация длины
    if (title.length > 255) {
      return res.status(400).json({ 
        success: false,
        error: 'Заголовок не должен превышать 255 символов' 
      });
    }

    if (author_name.length > 100) {
      return res.status(400).json({ 
        success: false,
        error: 'Имя автора не должно превышать 100 символов' 
      });
    }

    const result = await pool.query(
      `INSERT INTO ideas (author_name, title, description, category) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [author_name, title, description, category]
    );

    res.status(201).json({
      success: true,
      message: 'Идея успешно создана',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при создании идеи:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при создании идеи',
      message: error.message 
    });
  }
});

/**
 * PUT /api/ideas/:id
 * Обновить существующую идею
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, title, description, category, status } = req.body;

    // Проверка существования идеи
    const checkResult = await pool.query(
      'SELECT * FROM ideas WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Идея не найдена' 
      });
    }

    // Обновление только переданных полей
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (author_name !== undefined) {
      updates.push(`author_name = $${paramCount}`);
      values.push(author_name);
      paramCount++;
    }

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    if (updates.length === 1) { // Только updated_at
      return res.status(400).json({ 
        success: false,
        error: 'Нет данных для обновления' 
      });
    }

    const query = `UPDATE ideas SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Идея успешно обновлена',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при обновлении идеи:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при обновлении идеи',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/ideas/:id
 * Удалить идею
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM ideas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Идея не найдена' 
      });
    }

    res.json({
      success: true,
      message: 'Идея успешно удалена',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при удалении идеи:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при удалении идеи',
      message: error.message 
    });
  }
});

/**
 * POST /api/ideas/:id/vote
 * Проголосовать за идею (увеличить счётчик голосов)
 */
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE ideas SET votes = votes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Идея не найдена' 
      });
    }

    res.json({
      success: true,
      message: 'Голос учтён',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка при голосовании:', error);
    res.status(500).json({ 
      success: false,
      error: 'Ошибка при голосовании',
      message: error.message 
    });
  }
});

module.exports = router;

// PUT /api/ideas/:id - Обновление идеи (для админки)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, title, description, category } = req.body;
  
  try {
    // Формируем динамический запрос обновления
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (title) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (category) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Нет данных для обновления'
      });
    }
    
    values.push(id);
    
    const result = await pool.query(
      `UPDATE ideas 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Идея не найдена'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Идея успешно обновлена'
    });
  } catch (error) {
    console.error('Ошибка при обновлении идеи:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении идеи',
      details: error.message
    });
  }
});