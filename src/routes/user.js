const express = require("express");
const userAuth = require("../middlewares/auth");
const connectionRequest = require("../Models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_DATA_TO_SHOW = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_DATA_TO_SHOW);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        fromUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("toUserId", USER_DATA_TO_SHOW);
    const data = connectionRequests.map((row) => {
      return row.toUserId;
    });
    res.json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_DATA_TO_SHOW)
      .populate("toUserId", USER_DATA_TO_SHOW);
    let data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId ");
    const hasHideUser = new Set();
    connectionRequests.forEach((row) => {
      hasHideUser.add(row.fromUserId.toString());
      hasHideUser.add(row.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hasHideUser) } },
      ],
    })
      .select(USER_DATA_TO_SHOW)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
module.exports = userRouter;
