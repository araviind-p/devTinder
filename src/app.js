const express = require('express');
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json())
app.use(cookieParser())

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const requestsRoutes = require('./routes/requests')

app.use("/",authRoutes)
app.use("/",profileRoutes)
app.use("/",requestsRoutes)

connectDB()
    .then(() => {
        console.log('Database connected✅')
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        })
    })
    .catch(err => console.log("Error in databse connection", err))