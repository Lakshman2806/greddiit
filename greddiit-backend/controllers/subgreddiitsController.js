const Subgreddiit = require("../models/subgreddiits_model");
const Post = require("../models/posts_model");
const User = require("../models/user_model");
const Report = require("../models/report_model");
const mongoose = require("mongoose");
const createmysubreddiiit = async (req, res) => {
  try {
    const { Name, Description, Tags, Banned_Keywords } = req.body;
    if (!Name || !Description || !Tags || !Banned_Keywords) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    const subgreddiit = new Subgreddiit({
      Name,
      Description,
      Tags,
      Banned_Keywords,
      Created_By: req.user._id,
      Moderators: [req.user._id],
      Joined_Users: [req.user._id],
      Joined_Users_Time: [Date.now()],
      Pending_Users: [],
      Blocked_Users: [],
    });

    const savedsubgreddiit = await subgreddiit.save();
    res.status(201).json({ subgreddiit: savedsubgreddiit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const newvisit = async (req, res) => {
  const name = req.params.name;
  console.log(name);
  const subgreddiit = await Subgreddiit.findOne({ Name: name });
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  subgreddiit.NoOfVisits.push(Date.now());
  await subgreddiit.save();
  res.status(200).json({ NumberofVisits: subgreddiit.NoOfVisits.length });
};

const getmysubreddiits = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({ error: "Invalid ID" });
  }
  console.log(id);
  // get all the subgreddiits that the user is a moderator of
  const subgreddiits = await Subgreddiit.find({ Created_By: id });
  res.status(200).json({ subgreddiits });
};

const deletemysubreddiit = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({ error: "Invalid ID" });
  }

  const subgreddiit = await Subgreddiit.findById(id);
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (subgreddiit.Created_By.toString() !== req.user._id.toString()) {
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this subgreddiit" });
  }

  //delete the posts in the subgreddiit
  const posts = await Post.find({ Posted_In: id });
  posts.forEach(async (post) => {
    await Post.findByIdAndDelete(post._id);
  });
  // delete the reports in the subgreddiit
  const reports = await Report.find({ In_Subgreddiit: id });
  reports.forEach(async (report) => {
    await Report.findByIdAndDelete(report._id);
  });
  await Subgreddiit.findByIdAndDelete(id);
  res.status(200).json({ message: "Subgreddiit deleted successfully" });
};

// A function that gives the info of a subgreddiit I am moderating
const getmodsubreddiitJoinedusers = async (req, res) => {
  // The name of the subgreddiit is passed as a parameter
  const name = req.params.name;
  // Find the subgreddiit with the given name
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }
  // Get the subgreddiit from the array
  const subgreddiit = subgreddiitarr[0];
  // If the subgreddiit is not found, return an error
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }
  // If the subgreddiit is found, check if the user is a moderator
  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this subgreddiit" });
  }

  // If the user is a moderator, return the subgreddiit info
  const users = await User.find({ _id: { $in: subgreddiit.Joined_Users } });
  // get all the usernames pushed into an array
  const usernames = [];
  users.forEach((user) => {
    usernames.push({
      Username: user.Username,
      _id: user._id,
      Following: user.Following.length,
      Followers: user.Followers.length,
    });
  });
  res.status(200).json(usernames);
};

// A function that gives the info of a subgreddiit I am moderating
const getmodsubreddiitBlockedusers = async (req, res) => {
  // The name of the subgreddiit is passed as a parameter
  const name = req.params.name;
  // Find the subgreddiit with the given name
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }
  // Get the subgreddiit from the array
  const subgreddiit = subgreddiitarr[0];
  // If the subgreddiit is not found, return an error
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }
  // If the subgreddiit is found, check if the user is a moderator
  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this subgreddiit" });
  }

  const users = await User.find({ _id: { $in: subgreddiit.Blocked_Users } });

  // get all the usernames pushed into an array
  const usernames = [];
  users.forEach((user) => {
    usernames.push({
      Username: user.Username,
      _id: user._id,
      Following: user.Following.length,
      Followers: user.Followers.length,
    });
  });
  res.status(200).json(usernames);
};

// A function that gives the pending users of a subgreddiit I am moderating
const getmodsubreddiitPendingusers = async (req, res) => {
  // The name of the subgreddiit is passed as a parameter
  const name = req.params.name;
  // Find the subgreddiit with the given name
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  // Get the subgreddiit from the array
  const subgreddiit = subgreddiitarr[0];
  // If the subgreddiit is not found, return an error
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }

  // If the subgreddiit is found, check if the user is a moderator
  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this subgreddiit" });
  }

  const users = await User.find({ _id: { $in: subgreddiit.Pending_Users } });

  // get all the usernames pushed into an array
  const usernames = [];
  users.forEach((user) => {
    usernames.push({
      Username: user.Username,
      _id: user._id,
      Following: user.Following.length,
      Followers: user.Followers.length,
    });
  });
  res.status(200).json(usernames);
};

// A function that checks if a user is a moderator of a subgreddiit
const ismoderator = async (req, res) => {
  // The name of the subgreddiit is passed as a parameter
  const name = req.params.name;
  // Find the subgreddiit with the given name
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }
  // Get the subgreddiit from the array
  const subgreddiit = subgreddiitarr[0];
  // If the subgreddiit is not found, return an error
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }

  // If the subgreddiit is found, check if the user is a moderator
  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res
      .status(401)
      .json({ error: "You are not authorized to access this subgreddiit" });
  }

  res.status(200).json({ message: "You are a moderator of this subgreddiit" });
};

// A function that accepts a user to a subgreddiit
const acceptuser = async (req, res) => {
  const name = req.params.name;

  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const subgreddiit = subgreddiitarr[0];

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }
  console.log(subgreddiit.Moderators);
  console.log(req.user._id);
  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res.status(401).json({
      error: "You are not authorized to accept users to this subgreddiit",
    });
  }

  const acceptid = req.body.acceptid;

  if (!acceptid) {
    return res
      .status(400)
      .json({ error: "Please provide the id of the user you want to accept" });
  }

  if (!subgreddiit.Pending_Users.includes(acceptid)) {
    return res
      .status(400)
      .json({ error: "The user is not in the pending users list" });
  }

  // if(subgreddiit.Joined_Users.includes(acceptid)){
  //     return res.status(400).json({error:"The user is already a member of the subgreddiit"})
  // }

  // const newpending = subgreddiit.Pending_Users.filter((id) => id !== acceptid)
  // subgreddiit.Pending_Users = newpending
  // subgreddiit.Joined_Users.push(acceptid)

  // await subgreddiit.save()
  // The n
  // Also log the time of the user joining the subgreddiit
  // const updated = await Subgreddiit.findOneAndUpdate({Name:name},{$pull:{Pending_Users:acceptid},$push:{Joined_Users:acceptid}},{new:true})
  const updated = await Subgreddiit.findOneAndUpdate(
    { Name: name },
    {
      $pull: { Pending_Users: acceptid },
      $push: { Joined_Users: acceptid, Joined_Users_Time: Date.now() },
    },
    { new: true }
  );

  res.status(200).json({ message: "User accepted successfully" });
};

// A function that rejects a user to a subgreddiit
const rejectuser = async (req, res) => {
  const name = req.params.name;

  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const subgreddiit = subgreddiitarr[0];

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Moderators) {
    return res.status(404).json({ error: "Subgreddiiti not found" });
  }

  if (!subgreddiit.Moderators.includes(req.user._id)) {
    return res.status(401).json({
      error: "You are not authorized to accept users to this subgreddiit",
    });
  }

  const acceptid = req.body.acceptid;

  if (!acceptid) {
    return res
      .status(400)
      .json({ error: "Please provide the id of the user you want to accept" });
  }

  if (!subgreddiit.Pending_Users.includes(acceptid)) {
    return res
      .status(400)
      .json({ error: "The user is not in the pending users list" });
  }
  // Also log the time of acceptance
  for (let i = 0; i < subgreddiit.Rejected_Users.length; i++) {
    if (subgreddiit.Rejected_Users[i].user.equals(acceptid)) {
      return res
        .status(400)
        .json({ error: "The user has already been rejected" });
    }
  }
  const time = Date.now();

  const user = acceptid;
  // Should push the user,time at which the user was rejected to the rejected users list
  const updated = await Subgreddiit.findOneAndUpdate(
    { Name: name },
    {
      $pull: { Pending_Users: acceptid },
      $push: { Rejected_Users: { user, time } },
    },
    { new: true }
  );
  // const updated = await Subgreddiit.findOneAndUpdate({Name:name},{$pull:{Pending_Users:acceptid, $push:{Rejected_Users:{acceptid,time}}}},{new:true})
  // const
  res.status(200).json({ message: "User rejected successfully" });
};

// A function that adds a user to the pending users list
const addpendinguser = async (req, res) => {
  const name = req.params.name;
  console.log(name);
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const subgreddiit = subgreddiitarr[0];
  console.log(subgreddiit);
  const userid = req.user._id;
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Pending_Users) {
    subgreddiit.Pending_Users = [];
  }

  if (subgreddiit.Pending_Users.includes(userid)) {
    return res
      .status(400)
      .json({ error: "User is already in the pending users list" });
  }

  if (subgreddiit.Joined_Users.includes(userid)) {
    return res
      .status(400)
      .json({ error: "User is already a member of the subgreddiit" });
  }
  const no_of_days = 2;

  for (let i = 0; i < subgreddiit.Rejected_Users.length; i++) {
    const x = subgreddiit.Rejected_Users[i];
    console.log(x.user.equals(userid));
    if (x.user.equals(userid)) {
      const time = x.time;
      const current_time = Date.now();
      const diff = current_time - time;
      const days = diff / (1000 * 60 * 60 * 24);
      if (days < no_of_days) {
        return res.status(400).json({
          error:
            "You have been rejected from this subgreddiit recently. Please wait for some time before applying again",
        });
      } else {
        subgreddiit.Rejected_Users.splice(i, 1);
        await subgreddiit.save();
        break;
      }
    }
  }
  const no_of_days_left = 2;
  for (let i = 0; i < subgreddiit.Left_Users.length; i++) {
    const x = subgreddiit.Left_Users[i];
    console.log(x.user.equals(userid));
    if (x.user.equals(userid)) {
      const time = x.time;
      const current_time = Date.now();
      const diff = current_time - time;
      const days = diff / (1000 * 60 * 60 * 24);
      if (days < no_of_days_left) {
        return res.status(400).json({
          error:
            "You have been left subgreddiit recently. Please wait for" +
            days +
            " day(s) before applying again",
        });
      } else {
        subgreddiit.Left_Users.splice(i, 1);
        await subgreddiit.save();
        break;
      }
    }
  }

  // Also log the time of acceptance
  subgreddiit.Pending_Users.push(userid);
  await subgreddiit.save();
  res
    .status(200)
    .json({ message: "User added to pending users list successfully" });
};

// A function that returns all the subgreddiits formed by all the users
const getallsubreddiits = async (req, res) => {
  const subgreddiits = await Subgreddiit.find({});
  res.status(200).json(subgreddiits);
};

// A function that filters and returns the subgreddiits that the given tags
const getsubreddiitsbytags = async (req, res) => {
  console.log("here tags" + req.body.tags);
  const tags = req.body.tags;
  const subgreddiits = await Subgreddiit.find({ Tags: { $in: tags } });
  res.status(200).json(subgreddiits);
};

// A function that returns info about a subgreddiit given its name
const getsubreddiitinfo = async (req, res) => {
  const name = req.params.name;
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const subgreddiit = subgreddiitarr[0];

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  res.status(200).json(subgreddiit);
};

const leaveSubgreddiit = async (req, res) => {
  const name = req.params.name;
  const subgreddiitarr = await Subgreddiit.find({ Name: name });

  if (subgreddiitarr.length > 1) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const subgreddiit = subgreddiitarr[0];

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Joined_Users) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  if (!subgreddiit.Joined_Users.includes(req.user._id)) {
    return res
      .status(401)
      .json({ error: "You are not a member of this subgreddiit" });
  }

  if (subgreddiit.Moderators.includes(req.user._id)) {
    return res.status(401).json({
      error: "You are a moderator of this subgreddiit. You cannot leave",
    });
  }
  const user = req.user._id;
  const time = Date.now();
  const updated = await Subgreddiit.findOneAndUpdate(
    { Name: name },
    {
      $pull: { Joined_Users: req.user._id },
      $push: { Left_Users: { user, time } },
    },
    { new: true }
  );
  res.status(200).json({ message: "User left subgreddiit successfully" });
};

// A function that returns the growth of the subgreddiit in terms of members over time
const getsubgreddiitgrowth = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide the name of the subgreddiit" });
  }

  const subgreddiit = await Subgreddiit.findOne({ Name: name });
  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  const ismoderator = subgreddiit.Moderators.includes(req.user._id);
  if (!ismoderator) {
    return res
      .status(401)
      .json({ error: "You are not a moderator of this subgreddiit" });
  }

  var currentMembers = subgreddiit.Joined_Users.length;
  const dates = subgreddiit.Joined_Users_Time;

  const growth = [];
  for (let i = dates.length - 1; i >= 0; i--) {
    growth.push({ date: dates[i], members: currentMembers });
    currentMembers--;
  }

  res.status(200).json(growth);
};

// A function that returns the no of posts vs date for a given subgreddiit
const getsubgreddiitpostgrowth = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide the name of the subgreddiit" });
  }

  const subgreddiit = await Subgreddiit.findOne({ Name: name });

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  const ismoderator = subgreddiit.Moderators.includes(req.user._id);
  if (!ismoderator) {
    return res
      .status(401)
      .json({ error: "You are not a moderator of this subgreddiit" });
  }

  const posts = await Post.find({ Posted_In: subgreddiit._id });
  const dates = [];

  for (let i = 0; i < posts.length; i++) {
    if (!dates.includes(posts[i].createdAt.getDate()))
      dates.push(posts[i].createdAt.getDate());
  }
  console.log(dates);
  const growth = [];

  // Findings the no of posts for each date
  for (let i = 0; i < dates.length; i++) {
    let count = 0;
    for (let j = 0; j < posts.length; j++) {
      if (posts[j].createdAt.getDate() === dates[i]) {
        count++;
      }
    }
    growth.push({ date: dates[i], posts: count });
  }

  res.status(200).json(growth);
};

// A function that returns the daily visitors of a subgreddiit
const getsubgreddiitvisitors = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide the name of the subgreddiit" });
  }

  const subgreddiit = await Subgreddiit.findOne({ Name: name });

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  const ismoderator = subgreddiit.Moderators.includes(req.user._id);
  if (!ismoderator) {
    return res
      .status(401)
      .json({ error: "You are not a moderator of this subgreddiit" });
  }

  const Visitors = subgreddiit.NoOfVisits;

  const dates = [];
  for (let i = 0; i < Visitors.length; i++) {
    if (!dates.includes(Visitors[i].getDate())) {
      dates.push(Visitors[i].getDate());
    }
  }

  const growth = [];

  for (let i = 0; i < dates.length; i++) {
    let count = 0;
    for (let j = 0; j < Visitors.length; j++) {
      if (Visitors[j].getDate() === dates[i]) {
        count++;
      }
    }
    growth.push({ date: dates[i], visitors: count });
  }

  res.status(200).json(growth);
};

const getreportedpostsno = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res
      .status(400)
      .json({ error: "Please provide the name of the subgreddiit" });
  }

  const subgreddiit = await Subgreddiit.findOne({ Name: name });

  if (!subgreddiit) {
    return res.status(404).json({ error: "Subgreddiit not found" });
  }

  const ismoderator = subgreddiit.Moderators.includes(req.user._id);
  if (!ismoderator) {
    return res
      .status(401)
      .json({ error: "You are not a moderator of this subgreddiit" });
  }

  return res.status(200).json({
    TotalReports: subgreddiit.NoOfReports,
    TotalDeleted: subgreddiit.NoOfDeletedPosts,
  });
};

module.exports = {
  createmysubreddiiit,
  newvisit,
  getmysubreddiits,
  deletemysubreddiit,
  getmodsubreddiitJoinedusers,
  getmodsubreddiitBlockedusers,
  getmodsubreddiitPendingusers,
  ismoderator,
  acceptuser,
  rejectuser,
  addpendinguser,
  getallsubreddiits,
  getsubreddiitsbytags,
  getsubreddiitinfo,
  leaveSubgreddiit,
  getsubgreddiitgrowth,
  getsubgreddiitpostgrowth,
  getsubgreddiitvisitors,
  getreportedpostsno,
};
