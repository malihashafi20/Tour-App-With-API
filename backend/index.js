import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongo from './db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import planningRoutes from './routes/planning.js';
import updateUserRoutes from './routes/updateUser.js';
import deleteUserRoutes from './routes/deleteUser.js';
import dataRoutes from './routes/data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

connectToMongo();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', planningRoutes);
app.use('/api/users', userRoutes);       // list users
app.use('/api/users', updateUserRoutes); // update
app.use('/api/users', deleteUserRoutes); // delete
app.use('/api/test', dataRoutes);
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
