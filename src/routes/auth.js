const express = require('express');
const bcrypt = require('bcrypt');

const { validateSignUpData } = require('../utils/validation');

const UserModel = require('../models/user');


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the request body
     validateSignUpData(req);

     // Encrypt the password before save
     const { password } = req.body;
     const passwordHash = await bcrypt.hash(password, 10);

     const user = new UserModel({
      ...req.body,
      password: passwordHash
     });

     await user.save()
     res.send("User signed up successfully!");
  } catch (error) {
      res.status(500).json({ message: "ERROR : " + error.message });
  }
});

authRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;  
      
      // Find the user by email from collection
      const user = await UserModel.findOne({email: email});
      if (!user) {
        throw new Error("User not found!");
      }
  
      const isPasswordvalid = await user.comparePassword(password);
  
      if(isPasswordvalid) {
        // create a JWT token
        const jwtToken = await user.getJwtToken();
        // console.log(jwtToken);
  
        res.cookie("token", jwtToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 60 * 1000)
        });
        return res.status(200).json({
          user,
          message: "User logged in successfully!"
        });
      } else {
        throw new Error("Invalid credentials");
        // return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

authRouter.post("/logout",  async(req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now())
    })
    .send("User logged out successfully!");
})

module.exports = authRouter;