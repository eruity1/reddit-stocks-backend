import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:');
  missingEnvVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file');
  process.exit(1);
}

if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
  console.warn('⚠️  Reddit API credentials not configured. Reddit polling will not work.');
  console.warn('   Get credentials from: https://www.reddit.com/prefs/apps\n');
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  databaseUrl: process.env.DATABASE_URL as string,

  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    userAgent: process.env.REDDIT_USER_AGENT || '',
    redirectUri:
      process.env.REDDIT_REDIRECT_URI || 'http://localhost:3001/api/auth/reddit/callback',
    pollInterval: parseInt(process.env.REDDIT_POLL_INTERVAL || '15', 10),
  },

  // Feature flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Log configuration on startup (without sensitive data)
if (config.isDevelopment) {
  console.log('Configuration loaded:');
  console.log(`   - Environment: ${config.nodeEnv}`);
  console.log(`   - Port: ${config.port}`);
  console.log(`   - Frontend URL: ${config.frontendUrl}`);
  console.log(`   - Reddit API: ${config.reddit.clientId ? 'Configured' : 'Not configured'}`);
  console.log(`   - Database: ${config.databaseUrl.split('@')[1] || 'configured'}\n`);
}

export default config;
