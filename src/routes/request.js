const express = require("express");
const requestAuth = express.Router();
const userAuth = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestAuth.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status", success: false });
      }

      const existingRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Connection request already exists");
      }

      const connectionReq = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionReq.save();

      res.status(200).json({
        message: user.firstName + " is " + status + " in " + toUser.firstName,
        data,
        success: true,
      });
    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
);
requestAuth.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status type:" + status);
      }
      console.log(status, requestId, loggedInUser);
      const connectionReq = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionReq) {
        return res.status(404).json({
          message: "Connection request not found ",
          success: false,
        });
      }
      connectionReq.status = status;
      const data = await connectionReq.save();
      res.status(200).json({
        message: "Connection request " + status,
        data,
        success: true,
      });
    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
);

module.exports = requestAuth;
