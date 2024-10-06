const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password(1 uppercase, 1 lowercase, 1 number, 1 special char, min 8 char)")
    }
}

const validateEditProfileData = (req) => {
    try {
        const allowedEditFields = [
            "firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"
        ]
        const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
        return isEditAllowed;
    } catch (error) {
        res.send("ERROR: " + error.message)
    }
}

module.exports = { validateSignUpData, validateEditProfileData }