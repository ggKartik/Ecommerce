const { find } = require("../models/productModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const { findByIdAndUpdate } = require("../models/userModel");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");
//register a user
exports.signUp = async (req, res, next) => {
  try {
    const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      crop: "scale",
      width: 150,
    });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      res.cookie("token", token, {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "User created successfully",
        user,
      });
    } else {
      res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//login
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    } else {
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res.cookie("token", token, {
          httpOnly: true,
          expiresIn: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          success: true,
          message: "User logged in successfully",
          user,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//logout
exports.logOut = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.status(200).json({
      success: true,
      message: "You are succesfully logged out",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//forgot password
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({ success: false, message: "User not found" });
  } else {
    //get reset password token
    const resetpasstoken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    user.resetPasswordToken = resetpasstoken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetPasswordURL = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetpasstoken}`;
    const message = `This Is Your Password Reset Token Is \n\n Reset Password Url : ${resetPasswordURL} \n\n If You Have Not Requested For A Reset Password,You Can Ignore It`;

    try {
      await sendMail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: error.message });
    }
  }
};

//Reset password
exports.resetPassword = async (req, res) => {
  const resetPasswordToken = req.params.token;
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res
      .status(400)
      .json({ message: "Password Reset Token Is Invalid Or Has Expired" });
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).json({ message: "Password Does Not Match" });
  } else {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    res.cookie("token", token, {
      httpOnly: true,
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  }
};

//user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isPasswordMatched) {
      res.status(400).json({ message: "Old Password Is Incorrect" });
    } else {
      if (req.body.newPassword !== req.body.confirmPassword) {
        res.status(400).json({ message: "Password Does Not Match" });
      } else {
        user.password = req.body.newPassword;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res.cookie("token", token, {
          httpOnly: true,
          expiresIn: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          success: true,
          message: "Password Updated Successfully",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//update profile except password
exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    //we will add avatar change
    if (req.body.avatar !== "") {
      const user = await User.findById(req.user.id);
      const image_id = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(image_id);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: "true", message: "Profile Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all users for admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get single users for admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, users: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update role by admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: "true", message: "Role Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
    } else {
      const image_id = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(image_id);

      await user.remove();

      res
        .status(200)
        .json({ success: "true", message: "User Deleted Succesfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
