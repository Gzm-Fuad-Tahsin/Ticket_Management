import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  PORT: process.env.PORT || 4000,
  database_URL: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  NODE_ENV: process.env.NODE_ENV,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_VERIFIED_USER_SECRET: process.env.JWT_VERIFIED_USER_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  RESET_PASSWORD_URI: process.env.RESET_PASSWORD_URI,
  GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
  SERVER_URL : process.env.SERVER_URL,
};
