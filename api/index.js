// Vercel Serverless Function Entry Point
const app = require('../server/dist/server').default;

module.exports = app;
