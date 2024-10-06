const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://araviindp:zWbEQmXgFjINiKvh@cluster0.rbbr9.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0"
    )
}

module.exports=connectDB