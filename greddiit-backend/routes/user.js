const express = require("express");

const requireAuth = require("../middleware/requireAuth");

const {
  register,
  login,
  GetDetails,
  UpdateDetails,
  AddFollower,
  FollowUser,
  RemoveFollower,
  UnfollowUser,
  OtherUserDetails,
  CheckFollowing,
  AddSavedPost,
  RemoveSavedPost,
  isSavedPost,
  GetSavedPosts,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", register);

router.post("/login", login);

router.use(requireAuth);

router.get("/profile", GetDetails);

router.patch("/profile", UpdateDetails);

router.patch("/follower/:followerId", AddFollower);

router.patch("/follow/:userId", FollowUser);

router.patch("/unfollow/:userId", UnfollowUser);

router.patch("/removefollower/:followerId", RemoveFollower);

router.get("/otheruser/:userId", OtherUserDetails);

router.get("/checkfollowing/:userId", CheckFollowing);

router.patch("/addsavedpost/:postId", AddSavedPost);

router.patch("/removesavedpost/:postId", RemoveSavedPost);

router.get("/issavedpost/:postId", isSavedPost);

router.get("/getsavedposts", GetSavedPosts);
module.exports = router;
