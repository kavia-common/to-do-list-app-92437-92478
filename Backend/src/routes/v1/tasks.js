const express = require('express');
const { authenticate } = require('../../middleware/auth');
const { validate, taskValidations } = require('../../utils/validator');
const tasksController = require('../../controllers/tasks');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: CRUD operations for user tasks
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', authenticate, tasksController.list);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/', authenticate, validate(taskValidations.create), tasksController.create);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *     responses:
 *       200:
 *         description: A task
 *       404:
 *         description: Task not found
 */
router.get('/:id', authenticate, validate(taskValidations.idParam), tasksController.get);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by id (replace fields)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Updated task
 */
router.put('/:id', authenticate, validate(taskValidations.idParam), validate(taskValidations.update), tasksController.update);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Partially update a task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               completed: { type: boolean }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Updated task
 */
router.patch('/:id', authenticate, validate(taskValidations.idParam), validate(taskValidations.update), tasksController.update);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by id
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string, format: uuid }
 *         required: true
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, validate(taskValidations.idParam), tasksController.remove);

module.exports = router;
