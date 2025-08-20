const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/db');
const { sendMail } = require('../config/mailer');

const JWT_TTL = process.env.JWT_TTL || '1d';

async function findUserByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0];
}

async function findUserById(id) {
  const { rows } = await query('SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1 LIMIT 1', [id]);
  return rows[0];
}

async function createUser({ email, password, name }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  const insertSql =
    'INSERT INTO users (id, email, password_hash, name, created_at, updated_at) ' +
    'VALUES ($1, $2, $3, $4, NOW(), NOW())';
  await query(insertSql, [id, email, passwordHash, name || null]);

  // Fire-and-forget welcome email
  sendMail({
    to: email,
    subject: 'Welcome to the To-Do App',
    text: 'Hello' + (name ? ' ' + name : '') + ', welcome to the To-Do App!',
    html: '<p>Hello' + (name ? ' ' + name : '') + ', welcome to the To-Do App!</p>',
  }).catch(() => {});

  return findUserById(id);
}

function signToken(user) {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: JWT_TTL });
}

/**
 * PUBLIC_INTERFACE
 */
async function register({ email, password, name }) {
  /** Register a new user and return profile + JWT token. */
  const user = await createUser({ email: email.toLowerCase(), password, name });
  const token = signToken(user);
  return { user, token };
}

/**
 * PUBLIC_INTERFACE
 */
async function login({ email, password }) {
  /** Login a user by email/password and return profile + JWT token. */
  const user = await findUserByEmail(email.toLowerCase());
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const { password_hash, ...safeUser } = user;
  const token = signToken(user);
  return { user: safeUser, token };
}

/**
 * PUBLIC_INTERFACE
 */
async function me(userId) {
  /** Get current authenticated user profile. */
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
}

/**
 * PUBLIC_INTERFACE
 */
async function requestPasswordReset(email) {
  /** Generate password reset token and email it to the user. */
  const user = await findUserByEmail(email.toLowerCase());
  if (!user) {
    // Avoid disclosing user existence
    return;
  }
  const token = uuidv4();
  const expiresMinutes = parseInt(process.env.PASSWORD_RESET_TTL_MINUTES || '30', 10);

  const updateResetSql =
    'UPDATE users SET reset_token = $1, reset_token_expires = NOW() + ($2::int * INTERVAL \\'1 minute\\'), updated_at = NOW() WHERE id = $3';
  await query(updateResetSql, [token, expiresMinutes, user.id]);

  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const resetLink = siteUrl + '/reset-password?token=' + token;

  await sendMail({
    to: email,
    subject: 'Password Reset Request',
    text: 'Reset your password using this link: ' + resetLink,
    html: '<p>Reset your password using this link:</p><p><a href=\'' + resetLink + '\'>' + resetLink + '</a></p>',
  });
}

/**
 * PUBLIC_INTERFACE
 */
async function resetPassword({ token, password }) {
  /** Reset password using token. */
  const { rows } = await query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW() LIMIT 1',
    [token]
  );
  const user = rows[0];
  if (!user) {
    const err = new Error('Invalid or expired reset token');
    err.status = 400;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const updatePasswordSql =
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, ' +
    'updated_at = NOW() WHERE id = $2';
  await query(updatePasswordSql, [passwordHash, user.id]);
}

module.exports = {
  register,
  login,
  me,
  requestPasswordReset,
  resetPassword,
};
