const express = require('express');
const healthController = require('../controllers/health');
const authRouter = require('./v1/auth');
const tasksRouter = require('./v1/tasks');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Service health checks
 *
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// API v1 routes
router.use('/api/auth', authRouter);
router.use('/api/tasks', tasksRouter);

module.exports = router;
