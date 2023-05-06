const Report = require("../models/report_model");
const Post = require("../models/posts_model");
const Subgreddiit = require("../models/subgreddiits_model");
// A function to report a post
const ReportPost = async (req, res) => {
  const Post_Id = req.params.Post_Id;
  const { Reason } = req.body;
  if (!Post_Id || !Reason) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    console.log(Post_Id);
    const Reported = await Post.findById(Post_Id);
    console.log(Reported);
    const subgreddiit = await Subgreddiit.findById(Reported.Posted_In);
    if(subgreddiit.Moderators.includes(Reported.Posted_By)){
        return res.status(422).json({ error: "You cannot report a moderator" });
    }
    // check if the user has already reported the post
    const reportcheck = await Report.find({Reported_Post: Post_Id, Reported_By: req.user._id});
    if (reportcheck.length > 0) {
        return res.status(422).json({ error: "You have already reported this post" });
    }
    subgreddiit.NoOfReports += 1;
    await subgreddiit.save();
    const report = await Report.create({
        Reported_By: req.user._id,
        Reported_User: Reported.Posted_By,
        Concern: Reason,
        Reported_Post: Post_Id,
        In_Subgreddiit: Reported.Posted_In,
        Reported_Text: Reported.Text,
    });
    res.status(201).json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if the user has already reported the post
const CheckReport = async (req, res) => {
  const Post_Id = req.params.Post_Id;
    if (!Post_Id) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        const report = await Report.find({Reported_Post: Post_Id, Reported_By: req.user._id});
        if (report.length > 0) {
            return res.status(200).json({ isReported: true });
        }
        return res.status(200).json({ isReported: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// A function that gets all reports on posts of a subgreddiit
const getAllReports = async (req, res) => {
  const Subgreddiit_name = req.params.Subgreddiit_name;

  const user_id = req.user._id;
  try {
    const subgreddiit = await Subgreddiit.findOne({ Name: Subgreddiit_name });
    // Check if the user is a moderator of the subgreddiit
    if (!subgreddiit.Moderators.includes(user_id)) {
      res.status(401).json({ error: "You are not authorized to do this" });
    }

    const reports = await Report.find({ In_Subgreddiit: subgreddiit._id });

    const cutoff = 10;
    const newReports = [];
    reports.forEach(async (report) => {
      const date = new Date(report.Date_Reported);
      const today = new Date();
      const diff = Math.abs(today - date);
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (diffDays > cutoff) {
        await Report.findByIdAndDelete(report._id);
      }
      else{
        newReports.push(report);
      }
    });
    res.status(200).json(newReports);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete the post reported
const DeletePost = async (req, res) => {
  const Post_Id = req.params.Post_Id;
  const user_id = req.user._id;
  try {
    const post = await Post.findById(Post_Id);
    const subgreddiit = await Subgreddiit.findById(post.Posted_In);
    subgreddiit.NoOfDeletedPosts += 1;
    // Check if the user is a moderator of the subgreddiit
    if (!subgreddiit.Moderators.includes(user_id)) {
      res.status(401).json({ error: "You are not authorized to do this" });
    }
    await Post.findByIdAndDelete(Post_Id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Block the user who posted the post reported
const BlockUser = async (req, res) => {
  const Post_Id = req.params.Post_Id;
  const user_id = req.user._id;
  const { id } = req.body;
  console.log(id);
  try {
    const post = await Post.findById(Post_Id);
    const subgreddiit = await Subgreddiit.findById(post.Posted_In);
    // Check if the user is a moderator of the subgreddiit
    if (!subgreddiit.Moderators.includes(user_id)) {
      res.status(401).json({ error: "You are not authorized to do this" });
    }
    if(!id){
        return res.status(422).json({ error: "Please add all the fields" });
    }

    // delete the report
    // await Report.findByIdAndDelete(id);
    subgreddiit.Blocked_Users.push(post.Posted_By);
    await subgreddiit.save();
    res.status(200).json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ignore the report
const IgnoreReport = async (req, res) => {
  const Report_Id = req.params.Report_Id;
  const user_id = req.user._id;
  try {
    const report = await Report.findById(Report_Id);
    const subgreddiit = await Subgreddiit.findById(report.In_Subgreddiit);
    // Check if the user is a moderator of the subgreddiit
    if (!subgreddiit.Moderators.includes(user_id)) {
      res.status(401).json({ error: "You are not authorized to do this" });
    }
    report.IsIgnored = true;
    await report.save();
    res.status(200).json({ message: "Report ignored" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    ReportPost,
    CheckReport,
    getAllReports,
    DeletePost,
    BlockUser,
    IgnoreReport
};
