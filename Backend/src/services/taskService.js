const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/db');

/**
 * PUBLIC_INTERFACE
 */
async function listTasks(userId) {
  /** List tasks for a user ordered by created_at descending. */
  const { rows } = await query(
    `SELECT id, user_id, title, description, completed, due_date, created_at, updated_at
     FROM tasks WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * PUBLIC_INTERFACE
 */
async function getTask(userId, id) {
  /** Get a single task by id for a user. */
  const { rows } = await query(
    `SELECT id, user_id, title, description, completed, due_date, created_at, updated_at
     FROM tasks WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [id, userId]
  );
  return rows[0];
}

/**
 * PUBLIC_INTERFACE
 */
async function createTask(userId, { title, description, dueDate }) {
  /** Create a new task for a user. */
  const id = uuidv4();
  const { rows } = await query(
    `INSERT INTO tasks (id, user_id, title, description, completed, due_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, false, $5, NOW(), NOW())
     RETURNING id, user_id, title, description, completed, due_date, created_at, updated_at`,
    [id, userId, title, description || null, dueDate || null]
  );
  return rows[0];
}

/**
 * PUBLIC_INTERFACE
 */
async function updateTask(userId, id, fields) {
  /** Update an existing task for a user, returning the updated record. */
  const toSet = [];
  const params = [];
  let idx = 1;

  ['title', 'description', 'completed', 'dueDate'].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      if (key === 'dueDate') {
        toSet.push(`due_date = $${idx++}`);
        params.push(fields[key]);
      } else {
        toSet.push(`${key === 'completed' ? 'completed' : key} = $${idx++}`);
        params.push(fields[key]);
      }
    }
  });

  if (toSet.length === 0) {
    const err = new Error('No valid fields to update');
    err.status = 400;
    throw err;
  }

  const whereIdIndex = idx++;
  const whereUserIndex = idx++;
  const sql = `
    UPDATE tasks SET ${toSet.join(', ')}, updated_at = NOW()
    WHERE id = $${whereIdIndex} AND user_id = $${whereUserIndex}
    RETURNING id, user_id, title, description, completed, due_date, created_at, updated_at
  `;
  params.push(id, userId);

  const { rows } = await query(sql, params);
  return rows[0];
}

/**
 * PUBLIC_INTERFACE
 */
async function deleteTask(userId, id) {
  /** Delete a task for a user. */
  const { rowCount } = await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return rowCount > 0;
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
