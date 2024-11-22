import express from 'express' 
import { router } from './routes/index';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send("Hello"); //Landing page
})


app.use('/api', router);
app.listen(3333,() => {
  console.log("Server running at 3333");
  connectDB();
})
