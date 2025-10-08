const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModal = require("../models/user");


const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const user = req.user;

        const allowedStatuses = ["ignored", "interested"];
        if(!allowedStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        // Check if the user is trying to send a request to yourself and this validation can be done as middleware in schema pre
        // if (user._id.toString() === toUserId) {
        //     throw new Error("You cannot send a connection request to yourself.");
        // }

        // Check if the receiver exists in db
        const toUser = await UserModal.findById(toUserId);
        if (!toUser) {
            throw new Error("User not found!");
        }

        // Check if a request already exists between the sender and receiver
        // const existingRequest = await ConnectionRequestModel.findOne({
        //     sender: user._id,
        //     receiver: toUserId,
        //     status: { $in: allowedStatuses }
        // });
        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                {sender: user._id, receiver: toUserId},
                {sender: toUserId, receiver: user._id}
            ]
        });

        if (existingRequest) {
            throw new Error("A connection request already exists!!!");
        }

        const connectRequest = new ConnectionRequestModel({
            sender: user._id,
            receiver: toUserId,
            status: status
        });

        const data = await connectRequest.save();
        // res.send("Connection request sent successfully!");
        res.json({ message: "Connection request sent successfully!", request: data });

    } catch (error) {
        res.status(400).send("ERROR : " + error);
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatuses = ["accepted", "rejected"];

        const { status, requestId } = req.params;

        if(!allowedStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            receiver: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            throw new Error("Connection request not found");
        }

        connectionRequest.status = status;

        await connectionRequest.save();

        res.json({ message: `Connection request ${status} successfully!`, request: connectionRequest });
        
    } catch (error) {
        return res.status(400).send("Error" + error.message);
    }
});

module.exports = requestRouter;