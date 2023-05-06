const Conversation = require("../models/conversation_model");
const Message = require("../models/message_model");
const User = require("../models/user_model");
// Creating a new conversation
const newConversation = async (req, res) => {
    const senderId = req.user._id;
    const sender = req.body.sender;

    const receiver = await User.findOne({Username: sender});
    if(!receiver) {
        return res.status(400).json({message: "Bavvd request"});
    }
    const receiverId = receiver._id;
    if(!senderId || !receiverId) {
        return res.status(400).json({message: "Bad request"});
    }

    try {
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
            },
        });

        if(conversation) {
            return res.status(400).json({error: "Conversation already exists"});
        }

        const newConversation = new Conversation({
            participants: [senderId, receiverId],
        });

        const savedConversation = await newConversation.save();

        return res.status(200).json(savedConversation);
    }
    catch(err) {
        return res.status(500).json({message: err.message});
    }
}

// Getting all the conversations of a user
const getConversations = async (req, res) => {
    const userId = req.user._id
    if(!userId) {
        return res.status(400).json({message: "Bad request"});
    }
    try {
        const conversations = await Conversation.find({
            participants: {
                $in: [userId],
            },
        });

        return res.status(200).json(conversations);
    }
    catch(err) {
        return res.status(500).json({message: err.message});
    }
}

// sending a message to a user
const sendMessage = async (req, res) => {
    const userId = req.user._id;
    const receiverId = req.body.receiverId;
    const text = req.body.text;
    if(!userId || !receiverId || !text) {
        return res.status(400).json({message: "Bad request"});
    }

    try{
        const conversation = await Conversation.findOne({
            participants: {
                $all: [userId, receiverId],
            },
        });

        if(!conversation) {
            return res.status(400).json({message: "Bad request"});
        }

        const message = new Message({
            conversationId: conversation._id,
            sender: userId,
            text,
        });

        const savedMessage = await message.save();

        return res.status(200).json(savedMessage);
    }
    catch(err) {
        return res.status(500).json({message: err.message});
    }
}

// getting all the messages of a conversation
const getMessages = async (req, res) => {
    const userId = req.user._id;
    const conversationId = req.params.conversationId;
    if(!userId || !conversationId) {
        return res.status(400).json({message: "Bad request"});
    }
    const conversation = await Conversation.findById(conversationId);
    if(!conversation) {
        return res.status(400).json({message: "No conversation found"});
    }

    if(!conversation.participants.includes(userId)) {
        return res.status(401).json({message: "Not part of the conversation"});
    }

    try {
        const messages = await Message.find({
            conversationId
        });

        return res.status(200).json(messages);
    }
    catch(err) {
        return res.status(500).json({message: err.message});
    }
}


module.exports = {
    newConversation,
    getConversations,
    sendMessage,
    getMessages,
}
