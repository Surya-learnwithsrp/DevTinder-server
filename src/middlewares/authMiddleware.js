const JWT = require('jsonwebtoken');
const UserModel = require('../models/user');

const SECRET_TOKEN = 'shhhhsecret';

const userAuth = async (req, res, next) => {
    try {
      const { token } = req.cookies;
    
      // console.log(authenticationToken, 'authenticationToken from cookie');
      if (!token) {
        return res.status(401).send("Unauthorized: Please log in");
      }
    
      // Verify the JWT token
      const decoded = await JWT.verify(token, SECRET_TOKEN);

      // Find the user by ID from the decoded token
      const user = await UserModel.findById(decoded._id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      req.user = user; // Attach user to request object
      next();
    } catch (error) {
      res.status(400).send("ERROR : " + error);
    }
};

module.exports = {userAuth};