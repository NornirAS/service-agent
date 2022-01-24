import dotenv from 'dotenv';

dotenv.config({
  path: 'src/config/.env'
});

export const token = process.env.TOKEN || '';