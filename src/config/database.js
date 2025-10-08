const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://iamsurya:8rLxoaeAR4om1Q9O@nodejscluster.2xkm3lt.mongodb.net/devTinder');
};

module.exports = connectDB;