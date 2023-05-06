const express = require("express");

const requireAuth = require("../middleware/requireAuth");

const {
    newConversation,
    getConversations,
    sendMessage,
    getMessages
} = require("../controllers/conversationController");


const router = express.Router();

router.use(requireAuth);

router.post("/newconversation", newConversation);

router.get("/getconversations", getConversations);

router.post("/sendmessage", sendMessage);

router.get("/getmessages/:conversationId", getMessages);


module.exports = router;