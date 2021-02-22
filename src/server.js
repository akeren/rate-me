require('dotenv').config({ path: '.env' });
const http = require('http');
const app = require('./app');

// HANDLING UNCAUGHT EXCEPTION ERRORS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🙄 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ESTABLISH CONNECTION TO DB
require('./utils/db/mongoose');

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`App running at http://127.0.0.1:${port} 😍`);
});

// HANDLING UNHANDLED PROMISE REJECTION ERROR
process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANDLED REJECTION! 😞 Shutting down Server...');
  server.close(() => {
    process.exit(1);
  });
});
