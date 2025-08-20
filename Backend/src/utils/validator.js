const { body, param, validationResult } = require('express-validator');

/**
 * PUBLIC_INTERFACE
 */
function validate(rules) {
  /** Apply validation rules and return 400 on validation errors. */
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: errors.array(),
      });
    },
  ];
}

const authValidations = {
  register: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password min length 8'),
    body('name').optional().isString().isLength({ max: 100 }),
  ],
  login: [
    body('email').isEmail(),
    body('password').isString().notEmpty(),
  ],
  requestPasswordReset: [body('email').isEmail()],
  resetPassword: [
    body('token').isString().notEmpty(),
    body('password').isLength({ min: 8 }),
  ],
};

const taskValidations = {
  idParam: [param('id').isUUID().withMessage('Task id must be a valid UUID')],
  create: [
    body('title').isString().notEmpty().isLength({ max: 255 }),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().toDate(),
  ],
  update: [
    body('title').optional().isString().isLength({ max: 255 }),
    body('description').optional().isString(),
    body('completed').optional().isBoolean(),
    body('dueDate').optional().isISO8601().toDate(),
  ],
};

module.exports = {
  validate,
  authValidations,
  taskValidations,
};
