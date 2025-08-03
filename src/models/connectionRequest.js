const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      message: `{values} is incorrect status type`,
    },
  },
  { timestamps: true }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  //chekc is fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You Cannot send connection request to yourself");
  }
  next();
});

// const ConnectionRequestModel = new mongoose.model(
//   "ConnectionRequest",
//   connectionRequestSchema
// );
// module.exports = {
//   ConnectionRequestModel,
// };
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
