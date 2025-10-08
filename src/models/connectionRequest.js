const mongoose = require('mongoose');

const { Schema } = mongoose;

const connectRequestSchema = Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is not a valid status`
        }
    }
}, { timestamps: true });

connectRequestSchema.pre('save', async function (next) {
    const connectRequest = this;
    // Check if the sender and receiver are the same
    if (connectRequest.sender.equals(connectRequest.receiver)) {
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
});

const ConnectRequestModel = mongoose.model('ConnectRequest', connectRequestSchema);

module.exports = ConnectRequestModel;