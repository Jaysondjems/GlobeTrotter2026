require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'CHANGE_ME',
  nodeEnv: process.env.NODE_ENV || 'development',
};
