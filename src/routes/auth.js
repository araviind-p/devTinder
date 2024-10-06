const express = require('express')
const router = express.Router()
const User = require('../models/user')
const validator = require('validator')
const { validateSignUpData } = require('../utils/validation')
const bcrypt = require('bcrypt')

//signup
router.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body

        const passwordHash = await bcrypt.hash(password, 10);
        console.log('passwordHash: ', passwordHash);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        })
        await user.save()
        return res.send({ user })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }

})

//login
router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid")
        }
        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        console.log('isPasswordValid: ', isPasswordValid);
        if (isPasswordValid) {
            const token = await user.getJWT()
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            })
            return res.send("Login success")
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

//logout
router.post("/logout", async (req, res) => {
    try {
        res.clearCookie('token', null, { expires: new Date(Date.now()) })
        return res.send("Logout success")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = router