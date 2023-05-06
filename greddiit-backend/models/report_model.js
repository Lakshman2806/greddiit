const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    Reported_By: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Reported_User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Concern: {
        type: String,
        required: true
    },
    Reported_Post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    Date_Reported: {
        type: Date,
        default: Date.now
    },
    In_Subgreddiit: {
        type: Schema.Types.ObjectId,
        ref: "Subgreddiit"
    },
    Reported_Text:{
        type: String,
        required: true
    },
    IsIgnored:{
        type : Boolean,
        default: false
    }
});

module.exports = mongoose.model("Report", reportSchema);