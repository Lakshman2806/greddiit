const Post = require("../models/posts_model");
const User = require("../models/user_model");
const mongoose = require("mongoose");
const Subgreddiits = require("../models/subgreddiits_model");

const createpost = async (req, res) => {
  const { Text, Posted_In } = req.body;
  console.log(req.body);
  if (!Text || !Posted_In) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // check if the user is part of the subgreddit
  const subgreddiitarr = await Subgreddiits.find({ Name: Posted_In });
  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal Server error" });
  }
  if (subgreddiitarr.length === 0) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }
  const subgreddiit = subgreddiitarr[0]._id;

  const ispart = subgreddiitarr[0].Joined_Users.includes(req.user._id);
  if (!ispart) {
    return res
      .status(401)
      .json({ error: "You are not part of this subgreddit" });
  }
  const isBlocked = subgreddiitarr[0].Blocked_Users.includes(req.user._id);
  if (isBlocked) {
    return res
      .status(401)
      .json({ error: "You are blocked from this subgreddit" });
  }

  try {
    const post = await Post.create({
      Text,
      Posted_In: subgreddiit,
      Posted_By: req.user._id,
    });
    // replacing the banned words with ****
    const bannedwords = subgreddiitarr[0].Banned_Keywords;
    let text = post.Text;
    for (let i = 0; i < bannedwords.length; i++) {
      const word = bannedwords[i];
      const regex = new RegExp("\\b"+word+"\\b", "gi");
      text = text.replace(regex, "*".repeat(word.length));
    }
    post.Text = text;

    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// A function to get all the posts in a subgreddiit
const getposts = async (req, res) => {
  try {
    const name = req.params.name;
    const subgreddiitarr = await Subgreddiits.find({ Name: name });

    if (subgreddiitarr.length > 1) {
      return res.status(500).json({ error: "Internal Server error" });
    }
    if (subgreddiitarr.length === 0) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }
    const subgreddiit = subgreddiitarr[0]._id;
    if (!subgreddiit) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    const ispart = subgreddiitarr[0].Joined_Users.includes(req.user._id);

    const isBlocked = subgreddiitarr[0].Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    // if (!ispart) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not part of this subgreddit" });
    // }
    const posts = await Post.find({ Posted_In: subgreddiit });
    // Check if the user is blocked and if he is blocked then delete the post
    const newposts = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const subg = await Subgreddiits.findById(post.Posted_In);
      if (!subg) {
        return res.status(500).json({ error: "Internal Server error" });
      }
      const bannedwords = subg.Banned_Keywords;
      let text = post.Text;
      for (let i = 0; i < bannedwords.length; i++) {
        const word = bannedwords[i];

        const regex = new RegExp("\\b" + word + "\\b", "gi");
        text = text.replace(regex, "*".repeat(word.length));
        console.log("very important")
        console.log(text)
      }
      post.Text = text;
      // await post.save();
      const isblocked = subg.Blocked_Users.includes(post.Posted_By);
      if (isblocked) {
        // post.Posted_By = "0" ;
        // Using regex replacing all the banned words with asterisks

        var x = post;
        x.IsBlocked = true;
        console.log("lessgo")
        console.log(x);
        newposts.push(x);
      } else {
        newposts.push(post);
      }
    }

    res.status(200).json({ posts: newposts, subgreddiit: subgreddiitarr[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upvote a post
const upvote = async (req, res) => {
  try {
    const postid = req.params.postid;
    // finding the post
    const post = await Post.findById(postid);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ error: "Post not found" });
    }
    console.log(post.Posted_In);
    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    if (!subgreddiit) {
      console.log("Subgreddiit not found");
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    if (!ispart) {
      return res
        .status(401)
        .json({ error: "You are not part of this subgreddit" });
    }
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    if (post.Upvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already upvoted this post" });
    }
    if (post.Downvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already downvoted this post" });
    }
    post.Upvotes.push(req.user._id);
    await post.save();
    res.status(200).json({ message: "Upvoted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// downvote a post
const downvote = async (req, res) => {
  try {
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    if (!ispart) {
      return res
        .status(401)
        .json({ error: "You are not part of this subgreddit" });
    }
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    if (post.Upvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already upvoted this post" });
    }
    if (post.Downvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already downvoted this post" });
    }
    post.Downvotes.push(req.user._id);
    await post.save();
    res.status(200).json({ message: "Downvoted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// remove upvote
const removeupvote = async (req, res) => {
  try {
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    if (!ispart) {
      return res
        .status(401)
        .json({ error: "You are not part of this subgreddit" });
    }

    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }

    if (!post.Upvotes.includes(req.user._id)) {
      return res.status(401).json({ error: "You have not upvoted this post" });
    }
    if (post.Downvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already downvoted this post" });
    }
    post.Upvotes.pull(req.user._id);
    await post.save();
    res.status(200).json({ message: "Upvote removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removedownvote = async (req, res) => {
  try {
    const postid = req.params.postid;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }
    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    if (!ispart) {
      return res
        .status(401)
        .json({ error: "You are not part of this subgreddit" });
    }
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    if (post.Upvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have already upvoted this post" });
    }
    if (!post.Downvotes.includes(req.user._id)) {
      return res
        .status(401)
        .json({ error: "You have not downvoted this post" });
    }
    post.Downvotes.pull(req.user._id);
    await post.save();
    res.status(200).json({ message: "Downvote removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment to a post
const addcomment = async (req, res) => {
  try {
    const postid = req.params.postid;

    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    if (!ispart) {
      return res
        .status(401)
        .json({ error: "You are not part of this subgreddit" });
    }
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    const comment = req.body.comment;

    post.Comments.push(comment);
    await post.save();
    res.status(200).json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// A function that gets all the comments of a post
const getcomments = async (req, res) => {
  try {
    const postid = req.params.postid;

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    return res.status(200).json(post.Comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// A function that checks if a user has upvoted a post
const checkupvote = async (req, res) => {
  try {
    const postid = req.params.postid;

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const subgreddiit = await Subgreddiits.findById(post.Posted_In);

    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    // if (!ispart) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not part of this subgreddit" });
    // }

    if (post.Upvotes.includes(req.user._id)) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(200).json({ message: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// A function that checks if a user has downvoted a post
const checkdownvote = async (req, res) => {
  try {
    const postid = req.params.postid;

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const subgreddiit = await Subgreddiits.findById(post.Posted_In);
    const isBlocked = subgreddiit.Blocked_Users.includes(req.user._id);
    if (isBlocked) {
      return res
        .status(401)
        .json({ error: "You are blocked from this subgreddit" });
    }
    if (!subgreddiit) {
      return res.status(404).json({ error: "Subgreddiit not found" });
    }

    const ispart = subgreddiit.Joined_Users.includes(req.user._id);

    // if (!ispart) {
    //   return res
    //     .status(401)
    //     .json({ error: "You are not part of this subgreddit" });
    // }

    if (post.Downvotes.includes(req.user._id)) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(200).json({ message: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
