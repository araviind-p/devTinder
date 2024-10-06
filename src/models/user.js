const mongoose = require('mongoose');
const validator = require("validator")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        trim: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is incorrect gender type`
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/256/149/149071.png"
    },
    about: {
        type: String,
        default: "This is a default about the user!"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

// userSchema.index({ firstName: 1, lastName: 1 })

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "JWT_SECRET", { expiresIn: "7d" })
    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password)
    return isPasswordValid
}

const User = mongoose.model('User', userSchema);

module.exports = User