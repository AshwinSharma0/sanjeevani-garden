import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';



// Load environment variables from .env
// 1) Try process cwd .env (works when running from backend dir)
dotenv.config();
// 2) Also try backend/.env relative to this file (works when running from project root)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sanjeevani_garden';

// Built-in JSON parser
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Sample plants route
app.get('/api/plants', (req, res) => {
  res.json([
    { commonName: 'Tulsi', scientificName: 'Ocimum tenuiflorum' },
    { commonName: 'Neem', scientificName: 'Azadirachta indica' },
    { commonName: 'Turmeric', scientificName: 'Curcuma longa' },
  ]);
});

// Start server only after successful DB connection
async function start() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`API listening on :${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB');
    console.error(err?.message || err);
    process.exit(1);
  }
}

start();

export default app;
