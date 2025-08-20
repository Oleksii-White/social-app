const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const { prisma } = require('./prisma/prisma-client');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

async function connectToDatabase() {
  console.log('Attempting to connect to database using Prisma...');
  try {
    await prisma.$connect();
    console.log('Successfully connected to database with Prisma!');
  } catch (e) {
    console.error('Database connection failed (Prisma error):', e);
    process.exit(1);
  }
}

connectToDatabase();

app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes'));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.get('/', (_req, res) => res.json({ message: 'API is running' }));

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
