const asyncHandler = require('../middleware/asyncHandler');
const taskService = require('../services/taskService');

/**
 * PUBLIC_INTERFACE
 */
const list = asyncHandler(async (req, res) => {
  /** List tasks for current user. */
  const tasks = await taskService.listTasks(req.user.id);
  return res.status(200).json({ status: 'success', tasks });
});

/**
 * PUBLIC_INTERFACE
 */
const get = asyncHandler(async (req, res) => {
  /** Get one task by id for current user. */
  const task = await taskService.getTask(req.user.id, req.params.id);
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  return res.status(200).json({ status: 'success', task });
});

/**
 * PUBLIC_INTERFACE
 */
const create = asyncHandler(async (req, res) => {
  /** Create a task for current user. */
  const { title, description, dueDate } = req.body;
  const task = await taskService.createTask(req.user.id, { title, description, dueDate });
  return res.status(201).json({ status: 'success', task });
});

/**
 * PUBLIC_INTERFACE
 */
const update = asyncHandler(async (req, res) => {
  /** Update a task for current user. */
  const fields = {};
  ['title', 'description', 'completed', 'dueDate'].forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(req.body, k)) fields[k] = req.body[k];
  });
  const task = await taskService.updateTask(req.user.id, req.params.id, fields);
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  return res.status(200).json({ status: 'success', task });
});

/**
 * PUBLIC_INTERFACE
 */
const remove = asyncHandler(async (req, res) => {
  /** Delete a task for current user. */
  const ok = await taskService.deleteTask(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ status: 'error', message: 'Task not found' });
  return res.status(204).send();
});

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
