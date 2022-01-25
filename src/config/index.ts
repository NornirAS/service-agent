import dotenv from 'dotenv';

dotenv.config({
  path: 'src/config/.env'
});

export const token = process.env.TOKEN || '';

export const serviceUrl = process.env.SERVICE_URL || '';

export const targetUrl = process.env.TARGET_URL || '';