const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
      }],
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  {
    timestamps: true,
  },
  {
    // collection :  "Users",
    versionKey: false,
  }
);

module.exports = mongoose.model("Message", messageSchema);
