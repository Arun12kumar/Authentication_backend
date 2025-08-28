import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/mongodb.js';
import authRouter from './src/route/authRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true
}));

//API ENDpoints

app.use('/api/auth', authRouter);

app.get('/', (req,res) => res.send('welcome to Backend'));

app.listen(port,()=> console.log(`Server start on PORT:${port}`));