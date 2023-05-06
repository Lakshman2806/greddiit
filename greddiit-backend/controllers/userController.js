const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Post = require("../models/posts_model");
// creating a new token
// MongoDB stores the _id as an ObjectId
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 365,
  });
};

// register a new user

const register = async (req, res) => {
  try {
    const {
      First_name,
      Last_name,
      Username,
      Email,
      Age,
      Contact_number,
      Password,
    } = req.body;
    const user = await User.signUp(
      First_name,
      Last_name,
      Username,
      Email,
      Age,
      Contact_number,
      Password
    );
    const token = createToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// login a user

const login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await User.login(Email, Password);
    const token = createToken(user._id);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// get user details
const GetDetails = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  const user = await User.findById(id);
  if (!user) return res.status(404).send("No user with that id");

  res.status(200).json(user);
};

// update user details
const UpdateDetails = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  // new true returns the updated user

  if (!user) return res.status(404).send("No user with that id");

  res.status(200).json(user);
};

// Add a follower
const AddFollower = async (req, res) => {
  const id = req.user._id;
  const { followerId } = req.params;
  if (followerId === id)
    return res.status(400).send("You cannot follow yourself");
  console.log(followerId);
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  if (!mongoose.Types.ObjectId.isValid(followerId))
    return res.status(404).send("No follower with that id");

  const user = await User.findById(id);
  const follower = await User.findById(followerId);

  if (!user) return res.status(404).send("No user with that id");
  if (!follower) return res.status(404).send("No user with that id");

  // check if user is already following the user
  const isFollower = user.Followers.includes(followerId);
  if (isFollower) return res.status(400).send("Already following");

  const updated = await User.findByIdAndUpdate(
    id,
    { $push: { Followers: followerId } },
    { new: true }
  );

  const updatedFollower = await User.findByIdAndUpdate(
    followerId,
    { $push: { Following: id } },
    { new: true }
  );

  res.status(200).json(updated);
};

// follow a user
const FollowUser = async (req, res) => {
  const id = req.user._id;
  const { userId } = req.params;
  if (userId === id) return res.status(400).send("You cannot follow yourself");
  console.log(userId);
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(404).send("No user with that id");

  const user = await User.findById(id);
  const userToFollow = await User.findById(userId);

  if (!user) return res.status(404).send("No user with that id");
  if (!userToFollow) return res.status(404).send("No user with that id");

  // check if user is already following the user
  const isFollowing = user.Following.includes(userId);
  if (isFollowing) return res.status(400).send("Already following user");

  const updated = await User.findByIdAndUpdate(
    id,
    { $push: { Following: userId } },
    { new: true }
  );
  const updated2 = await User.findByIdAndUpdate(
    userId,
    { $push: { Followers: id } },
    { new: true }
  );

  res.status(200).json(updated);
};

// remove a follower
const RemoveFollower = async (req, res) => {
  const id = req.user._id;
  const { followerId } = req.params;
  console.log(followerId);
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  if (!mongoose.Types.ObjectId.isValid(followerId))
    return res.status(404).send("No follower with that id");

  const user = await User.findById(id);
  const follower = await User.findById(followerId);

  if (!user) return res.status(404).send("No user with that id");
  if (!follower) return res.status(404).send("No user with that id");

  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { Followers: followerId } },
    { new: true }
  );

  const updated2 = await User.findByIdAndUpdate(
    followerId,
    { $pull: { Following: id } },
    { new: true }
  );

  res.status(200).json(updated);
};

// unfollow a user
const UnfollowUser = async (req, res) => {
  const id = req.user._id;
  const { userId } = req.params;
  console.log(userId);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(404).send("No user with that id");

  const user = await User.findById(id);
  const userToUnfollow = await User.findById(userId);
  console.log(user.Following.length);
  if (!user) return res.status(404).send("No user with that id");
  if (!userToUnfollow) return res.status(404).send("No user with that id");

  const updated = await User.findByIdAndUpdate(
    id,
    { $pull: { Following: userId } },
    { new: true }
  );

  const updated2 = await User.findByIdAndUpdate(
    userId,
    { $pull: { Followers: id } },
    { new: true }
  );

  res.status(200).json(updated);
};

// details of other user
const OtherUserDetails = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(404).send("No user with that id");

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("No user with that id");
  // const updateuser = JSON.stringify(user);
  res.status(200).json({ Username: user["Username"], Email: user["Email"] });
};

// A function to check if you are following a user
const CheckFollowing = async (req, res) => {
  const id = req.user._id;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(404).send("No user with that id");

  const user = await User.findById(id);
  if (!user) return res.status(404).send("No user with that id");

  if (user.Following.includes(userId))
    return res.status(200).json({ Following: true });

  return res.status(200).json({ Following: false });
};

// A function to add a saved post to the user
const AddSavedPost = async (req, res) => {
  const id = req.user._id;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");
  const user = await User.findById(id);

  if (!user) return res.status(404).send("No user with that id");

  user.Saved_Posts.push(postId);

  user.save();

  // User.findByIdAndUpdate(id,)

  res.status(200).json(user);
};

// A function to remove a saved post from the user
const RemoveSavedPost = async (req, res) => {
  const id = req.user._id;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");

  const user = await User.findById(id);

  if (!user) return res.status(404).send("No user with that id");

  user.Saved_Posts.pull(postId);
  await user.save();

  res.status(200).json(user);
};

const isSavedPost = async (req, res) => {
  const id = req.user._id;
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send("No post with that id");

  const user = await User.findById(id);

  if (!user) return res.status(404).send("No user with that id");

  if (user.Saved_Posts.includes(postId))
    return res.status(200).json({ Saved: true });

  return res.status(200).json({ Saved: false });
};

// A function to get all the saved posts
const GetSavedPosts = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");

  const user = await User.findById(id);

  if (!user) return res.status(404).send("No user with that id");
  const savedposts = [];
  for (let i = 0; i < user.Saved_Posts.length; i++) {
    const post = await Post.findById(user.Saved_Posts[i]);
    if (post) savedposts.push(post);
    else{
      user.Saved_Posts.pull(user.Saved_Posts[i]);
      await user.save();
    }
  }
  res.status(200).json(savedposts);
  // res.status(200).json(user.Saved_Posts);
};

module.exports = {
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
};
