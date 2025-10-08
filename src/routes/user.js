const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModal = require("../models/user");
const userRouter = express.Router();

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestsReceived = await ConnectionRequestModel
            .find({ receiver: loggedInUser._id, status: "interested" })
            .populate('sender', 'firstName lastName photoUrl gender');

        if (requestsReceived.length === 0) {
            throw new Error("No connection requests received");
        }
        
        res.json({ requests: requestsReceived });
    } catch (error) {
        return res.status(400).send("ERROR : " + error);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel
            .find({
                $or: [
                    {sender: loggedInUser._id, status: "accepted"},
                    {receiver: loggedInUser._id, status: "accepted"}
                ]
            })
            .populate('sender', 'firstName lastName photoUrl')
            .populate('receiver', 'firstName lastName photoUrl');

        if (connectionRequests.length === 0) {
            throw new Error("No connections found");
        }

        const connections = connectionRequests.map(row => loggedInUser._id.equals(row.sender._id) ? row.receiver : row.sender);
        res.json({ connections });
    } catch (error) {
        return res.status(400).send("ERROR : " + error);
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50);

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel
            .find({ $or: [{sender: loggedInUser._id}, {receiver: loggedInUser._id}] })
            .select("sender receiver")
            .skip(skip)
            .limit(limit)
        
        const hideUsersFromfeed = new Set(connectionRequests.map(req => {
            return loggedInUser._id.equals(req.sender) ? req.receiver.toString() : req.sender.toString();
        }));

        // console.log("Hide users from feed: ", hideUsersFromfeed);

        const feedusers = await UserModal.find({
            $and: [
                {_id: { $nin: Array.from(hideUsersFromfeed)}},
                {_id: { $ne: loggedInUser._id}}
            ]
        }).select("firstName lastName photoUrl gender skills");

        res.status(200).json({ feedusers });

    } catch (error) {
        return res.status(400).send("ERROR : " + error);
    }
});

module.exports = userRouter;