const express = require("express");

const requireAuth = require("../middleware/requireAuth");

const {
    createpost,
    getposts,
    upvote,
    downvote,
    removeupvote,
    removedownvote,
    addcomment,
    getcomments,
    checkupvote,
    checkdownvote,
} = require("../controllers/postsController");

const router = express.Router();

router.use(requireAuth);

router.post("/create",createpost);

router.get("/getposts/:name",getposts);

router.post("/upvote/:postid",upvote);

router.post("/downvote/:postid",downvote);

router.post("/removeupvote/:postid",removeupvote);

router.post("/removedownvote/:postid",removedownvote);

router.post("/addcomment/:postid",addcomment);

router.get("/getcomments/:postid",getcomments);

router.get("/checkupvote/:postid",checkupvote);

router.get("/checkdownvote/:postid",checkdownvote);
module.exports = router;
