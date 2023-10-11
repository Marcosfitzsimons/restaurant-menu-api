import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import 'express-async-errors'
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import credentials from './middleware/credentials.js'
import connectDB from './db/connect.js'
import corsOptions from './config/corsOptions.js'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'

const app = express()

// .env
dotenv.config()

// ignore warning
mongoose.set('strictQuery', false)

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

// middlewares

// Handle options credentials check - before CORS!
// and fetch cookies credentiuals requirement
app.use(credentials)

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())


app.use("/api/auth", authRoute)
app.use("/api/users", usersRoute)
app.use("/api/products", productsRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})


const port = process.env.PORT || 8800;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () =>
            console.log(`Connected to backend. Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
