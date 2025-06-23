import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);


const port = 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});