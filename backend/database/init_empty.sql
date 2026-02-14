-- database/init_empty.sql
-- Скрипт создания ПУСТОЙ структуры базы данных для приложения об экологии Беларуси
-- Этот файл создаёт только таблицы БЕЗ предзагруженных данных

-- Создание базы данных (выполнить отдельно от основного скрипта)
-- CREATE DATABASE belarus_ecology;

-- Подключиться к базе данных belarus_ecology

-- Удаление таблиц если они существуют (для чистой установки)
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS solutions CASCADE;
DROP TABLE IF EXISTS problems CASCADE;

-- ============================================
-- Таблица экологических проблем
-- ============================================
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Комментарий к таблице
COMMENT ON TABLE problems IS 'Таблица экологических проблем Беларуси';
COMMENT ON COLUMN problems.id IS 'Уникальный идентификатор проблемы';
COMMENT ON COLUMN problems.title IS 'Название проблемы';
COMMENT ON COLUMN problems.description IS 'Подробное описание проблемы';
COMMENT ON COLUMN problems.category IS 'Категория: Вода, Леса, Воздух, Отходы, Радиация, Почва, и т.д.';
COMMENT ON COLUMN problems.severity IS 'Уровень серьёзности: низкая, средняя, высокая, критическая';
COMMENT ON COLUMN problems.image_url IS 'URL изображения проблемы (опционально)';
COMMENT ON COLUMN problems.created_at IS 'Дата создания записи';

-- ============================================
-- Таблица решений проблем
-- ============================================
CREATE TABLE solutions (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  impact VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Комментарии к таблице
COMMENT ON TABLE solutions IS 'Таблица решений экологических проблем';
COMMENT ON COLUMN solutions.id IS 'Уникальный идентификатор решения';
COMMENT ON COLUMN solutions.problem_id IS 'Ссылка на проблему (внешний ключ)';
COMMENT ON COLUMN solutions.title IS 'Название решения';
COMMENT ON COLUMN solutions.description IS 'Подробное описание решения';
COMMENT ON COLUMN solutions.level IS 'Уровень реализации: индивидуальный, общественный, государственный';
COMMENT ON COLUMN solutions.difficulty IS 'Сложность реализации: легко, средне, сложно';
COMMENT ON COLUMN solutions.impact IS 'Уровень влияния: низкий, средний, высокий';
COMMENT ON COLUMN solutions.created_at IS 'Дата создания записи';

-- ============================================
-- Таблица идей пользователей
-- ============================================
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  votes INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'новая',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Комментарии к таблице
COMMENT ON TABLE ideas IS 'Таблица идей пользователей по улучшению экологии';
COMMENT ON COLUMN ideas.id IS 'Уникальный идентификатор идеи';
COMMENT ON COLUMN ideas.author_name IS 'Имя автора идеи';
COMMENT ON COLUMN ideas.title IS 'Название идеи';
COMMENT ON COLUMN ideas.description IS 'Подробное описание идеи';
COMMENT ON COLUMN ideas.category IS 'Категория идеи: Вода, Леса, Воздух, Отходы, Энергия, Транспорт, Другое';
COMMENT ON COLUMN ideas.votes IS 'Количество голосов (лайков)';
COMMENT ON COLUMN ideas.status IS 'Статус идеи: новая, на рассмотрении, одобрена, отклонена';
COMMENT ON COLUMN ideas.created_at IS 'Дата создания идеи';
COMMENT ON COLUMN ideas.updated_at IS 'Дата последнего обновления';

-- ============================================
-- Создание индексов для улучшения производительности
-- ============================================

-- Индексы для таблицы problems
CREATE INDEX idx_problems_category ON problems(category);
CREATE INDEX idx_problems_severity ON problems(severity);
CREATE INDEX idx_problems_created_at ON problems(created_at DESC);

-- Индексы для таблицы solutions
CREATE INDEX idx_solutions_problem_id ON solutions(problem_id);
CREATE INDEX idx_solutions_level ON solutions(level);
CREATE INDEX idx_solutions_difficulty ON solutions(difficulty);
CREATE INDEX idx_solutions_impact ON solutions(impact);

-- Индексы для таблицы ideas
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_votes ON ideas(votes DESC);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_author ON ideas(author_name);

-- ============================================
-- Триггер для автоматического обновления updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON ideas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Ограничения на значения
-- ============================================

-- Проверка категорий для problems
ALTER TABLE problems ADD CONSTRAINT check_problem_category 
  CHECK (category IN ('Вода', 'Леса', 'Воздух', 'Отходы', 'Радиация', 'Почва', 'Энергия', 'Транспорт', 'Другое'));

-- Проверка уровня серьёзности для problems
ALTER TABLE problems ADD CONSTRAINT check_problem_severity 
  CHECK (severity IN ('низкая', 'средняя', 'высокая', 'критическая'));

-- Проверка уровня для solutions
ALTER TABLE solutions ADD CONSTRAINT check_solution_level 
  CHECK (level IN ('индивидуальный', 'общественный', 'государственный'));

-- Проверка сложности для solutions
ALTER TABLE solutions ADD CONSTRAINT check_solution_difficulty 
  CHECK (difficulty IN ('легко', 'средне', 'сложно'));

-- Проверка влияния для solutions
ALTER TABLE solutions ADD CONSTRAINT check_solution_impact 
  CHECK (impact IN ('низкий', 'средний', 'высокий'));

-- Проверка категорий для ideas
ALTER TABLE ideas ADD CONSTRAINT check_idea_category 
  CHECK (category IN ('Вода', 'Леса', 'Воздух', 'Отходы', 'Энергия', 'Транспорт', 'Образование', 'Другое'));

-- Проверка статуса для ideas
ALTER TABLE ideas ADD CONSTRAINT check_idea_status 
  CHECK (status IN ('новая', 'на рассмотрении', 'одобрена', 'отклонена', 'реализована'));

-- Проверка голосов (не могут быть отрицательными)
ALTER TABLE ideas ADD CONSTRAINT check_idea_votes 
  CHECK (votes >= 0);

-- ============================================
-- Информация о созданной структуре
-- ============================================

-- Вывод информации о созданных таблицах
DO $$
BEGIN
  RAISE NOTICE '✅ База данных успешно инициализирована!';
  RAISE NOTICE '📊 Созданные таблицы:';
  RAISE NOTICE '   - problems (экологические проблемы)';
  RAISE NOTICE '   - solutions (решения проблем)';
  RAISE NOTICE '   - ideas (идеи пользователей)';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Созданные индексы: 12';
  RAISE NOTICE '🔒 Созданные ограничения: 8';
  RAISE NOTICE '⚡ Созданные триггеры: 1';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Таблицы пустые и готовы к заполнению данными!';
  RAISE NOTICE '📝 Вы можете добавлять данные через веб-интерфейс или API';
END $$;
