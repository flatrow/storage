try {
    require('dotenv').config();
} catch {}

export const port = Number(process.env.PORT) || 3000;
