const express = require("express");
const { signUp, logIn, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getUser, updateUserRole, deleteUser } = require("../controller/userController");
const {isAuthenticated,authorisedRoles} = require("../middleware/auth");

const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);
userRouter.route("/password/forgot").post(forgotPassword);
userRouter.route("/password/reset/:token").put(resetPassword);
userRouter.route("/logout").get(logOut);
userRouter.route("/me").get(isAuthenticated,getUserDetails);
userRouter.route("/password/update").put(isAuthenticated,updatePassword);
userRouter.route("/me/update").put(isAuthenticated,updateProfile);
userRouter.route("/admin/allusers").get(isAuthenticated,authorisedRoles("admin"),getAllUsers);

userRouter.route("/admin/user/:id")
.get(isAuthenticated,authorisedRoles("admin"),getUser)
.put(isAuthenticated,authorisedRoles("admin"),updateUserRole)
.delete(isAuthenticated,authorisedRoles("admin"),deleteUser)

module.exports=userRouter;