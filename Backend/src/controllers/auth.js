const asyncHandler = require('../middleware/asyncHandler');
const authService = require('../services/authService');

/**
 * PUBLIC_INTERFACE
 */
const register = asyncHandler(async (req, res) => {
  /** Register a user. */
  const { email, password, name } = req.body;
  const result = await authService.register({ email, password, name });
  return res.status(201).json({ status: 'success', ...result });
});

/**
 * PUBLIC_INTERFACE
 */
const login = asyncHandler(async (req, res) => {
  /** Login a user. */
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return res.status(200).json({ status: 'success', ...result });
});

/**
 * PUBLIC_INTERFACE
 */
const me = asyncHandler(async (req, res) => {
  /** Get current user details. */
  const user = await authService.me(req.user.id);
  return res.status(200).json({ status: 'success', user });
});

/**
 * PUBLIC_INTERFACE
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
  /** Request password reset; email sent if user exists. */
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  return res.status(200).json({ status: 'success', message: 'If the email is registered, a reset link will be sent.' });
});

/**
 * PUBLIC_INTERFACE
 */
const resetPassword = asyncHandler(async (req, res) => {
  /** Reset password using token. */
  const { token, password } = req.body;
  await authService.resetPassword({ token, password });
  return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
});

module.exports = {
  register,
  login,
  me,
  requestPasswordReset,
  resetPassword,
};
