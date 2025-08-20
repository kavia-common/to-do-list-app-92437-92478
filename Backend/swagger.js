const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do List Backend API',
      version: '1.0.0',
      description: 'Express API for user auth, tasks CRUD, and email notifications',
    },
    tags: [
      { name: 'Health', description: 'Service health checks' },
      { name: 'Auth', description: 'User registration, login, account' },
      { name: 'Tasks', description: 'CRUD for user tasks' }
    ]
  },
  apis: ['./src/routes/**/*.js'], // include nested route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
