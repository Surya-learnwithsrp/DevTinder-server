const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('../middlewares/authMiddleware');
const { validateProfileUpdateData } = require('../utils/validation');


const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user; // Assuming user is set by an auth middleware
      res.status(200).json({user});
    } catch (error) {
      res.status(400).send("ERROR : " + error);
    }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    if(!validateProfileUpdateData(req)) {
      throw new Error("Invalid profile update data");
    }

    const user = req.user;
    Object.keys(req.body).forEach(key => user[key] = req.body[key]);
    await user.save();
    res.status(200).json({ message: "Profile updated successfully!", user });

  } catch (error) {
    res.status(400).send("ERROR : " + error);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Old and new passwords are required");
    }

    const user = req.user;
    const isPasswordMatch = await user.comparePassword(oldPassword);
    if(!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send("Password updated successfully!");

  } catch(error) {
    res.status(400).send("ERROR : " + error);
  }
});


module.exports = profileRouter;