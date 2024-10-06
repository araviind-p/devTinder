const express = require('express')
const router = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectionRequestModel = require('../models/connectionRequest')
const User = require('../models/user')

//sendConnectionRequest
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["ignore", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }



        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({ message: "User not found" })
        }


        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already sent" })
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        return res.json({
            message: `${req.user.firstName} ${status === "interested" ? "is interested in" : "ignored"} ${toUser.firstName}`,
            data
        });

    } catch (error) {

        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = router