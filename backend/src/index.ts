import express from 'express' 
import { router } from './routes/index';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3333",
  credentials: true,
}));
app.get('/', (req, res) => {
  res.send("Hello"); //Landing page
})


app.use('/api', router);
app.listen(3333,() => {
  console.log("Server running at 3333");
  connectDB();
})
