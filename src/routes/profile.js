const express = require('express')
const router = express.Router()
const { userAuth } = require('../middlewares/auth')
const { validateEditProfileData } = require('../utils/validation')
const User = require('../models/user')
const validator = require('validator')
const bcrypt = require('bcrypt')

//view profile
router.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        return res.send({ user })
    } catch (error) {
        res.status(400).send("something went wrong" + error)
    }
})

//edit profile
router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request")
        }
        const loggedInUser = req.user
        // console.log('loggedInUser: ', loggedInUser);
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        return res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

//forgot password
router.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const user = req.user
        const { currentPassword, password, confirmPassword } = req.body

        const isPasswordValid = await user.validatePassword(currentPassword)

        if (!isPasswordValid) {
            throw new Error("Invalid current password")
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Please enter a strong password(1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 char)")
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match")
        }

        user.password = await bcrypt.hash(password, 10)
        await user.save()
        return res.json({ message: "Password changed successfully", data: user })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = router