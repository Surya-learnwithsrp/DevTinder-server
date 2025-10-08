const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const SECRET_TOKEN = 'shhhhsecret';

const userSchema = Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: 'https://example.com/default-profile.png',
    },
    gender: {
        type: String
    },
    skills: {
        type: [String],
        default: ["JavaScript", "Node.js"]
    }
}, { timestamps: true });

userSchema.methods.getJwtToken = async function() {
    const user = this;

    // Generate a JWT token with the user's ID and it expires in 1 hour
    const token = await JWT.sign({ _id: user._id}, SECRET_TOKEN, {expiresIn: '1h'});
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    const user = this;

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch;
}

const UserModel =  mongoose.model('User', userSchema);

module.exports = UserModel;