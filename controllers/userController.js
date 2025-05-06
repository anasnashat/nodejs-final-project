const express = require("express");
const AppError = require("../utils/AppError");
const User = require("../models/User");

// create user
const createUser = async (req, res, next) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return next(new AppError("You Must Provide All requirements"));
    }
    const profileImage = req.file ? req.file.path : "/uploads/profile.png";
    const user = await User.create({ name, password, email, profileImage });
    res.status(201).json({
      message: "create user successfully",
      data: user,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
//get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.where("role").equals("user").select('+profileImage');
    console.log(users);
    if (!users) {
      return next(new AppError("Users Not Found", 404));
    }
    const usersWithProfileImage = users.map((user) => ({
      ...user.toObject(),
      profileImage: user.profileImage
        ? `http://localhost:5000/${user.profileImage.replace(/^\/+/, "")}`
        : `http://localhost:5000/uploads/profile.png`,
    }));

    res.status(200).json({
      message: "Users returned Successfully",
      data: usersWithProfileImage,
      results: users.length,
    });
  } catch (err) {
    next(new AppError(err.message));
  }
};

//update user data
const updateUser = async (req, res, next) => {
  try {
    const { newName, newPassword, newEmail } = req.body;
    if (!newName || !newPassword || !newEmail) {
      return next(new AppError("You must Provide All requirements", 400));
    }
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      name: newName,
      password: newPassword,
      email: newEmail,
    });
    if (!updatedUser) {
      return next(new AppError("User Not Found", 404));
    }
    res.status(200).json({
      message: `update user successfully`,
      data: updateUser,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
// delete user data
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "user deleted successfully",
      data: `deleted user is ${user.email}`,
    });
  } catch (err) {
    next(new AppError(err.message, 505));
  }
};

module.exports = { getAllUsers, createUser, deleteUser, updateUser };
