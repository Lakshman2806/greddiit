const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// enable timestamps
const postsSchema = new Schema({
    Text:{
        type: String,
        required: true,
    },
    Posted_By:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    Posted_In:{
        type: Schema.Types.ObjectId,
        ref: "Subgreddiit",
    },
    Upvotes:[
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    Downvotes:[
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    Comments:{
        type: [String],
        default: [],
    },
    IsBlocked:{
        type: Boolean,
        default: false,
    },
}  , { timestamps: true });


module.exports = mongoose.model("Post", postsSchema);
