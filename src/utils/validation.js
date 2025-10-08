const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(email)) {
        console.log(email, "email");
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid!");
    }
};

const validateProfileUpdateData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'email', 'gender', 'photoUrl', 'skills'];
    return Object.keys(req.body).every(key => allowedFields.includes(key));
}

module.exports = {
    validateSignUpData,
    validateProfileUpdateData
};