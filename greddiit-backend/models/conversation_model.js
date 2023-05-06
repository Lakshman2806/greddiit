const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {timestamps: true});

module.exports = mongoose.model("Conversation", conversationSchema);