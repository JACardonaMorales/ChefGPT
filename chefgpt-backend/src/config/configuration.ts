export default () => ({
  openaiApiKey: process.env.OPENAI_API_KEY,
  port: parseInt(process.env.PORT, 10) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  databasePath: process.env.DATABASE_PATH || './chefgpt.db',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

