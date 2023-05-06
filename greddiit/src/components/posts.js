import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Card, Grid } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { TextField } from "@mui/material";
import { DialogActions } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import React from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import CommentIcon from "@mui/icons-material/Comment";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { Collapse } from "@mui/material";

const Post = ({ post, posts }) => {
  const { user } = useAuthContext();
  const [upvotes, setUpvotes] = useState(post.Upvotes.length);
  const [downvotes, setDownvotes] = useState(post.Downvotes.length);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Following, setFollowing] = useState(false);
  const [Saved, setSaved] = useState(false);
  const [Reported, setReported] = useState(false);
  const [Reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const openNavMenu = Boolean(anchorElNav);
  const openUserMenu = Boolean(anchorElUser);

  // Comments
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [openComment, setOpenComment] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  useEffect(() => {
    if (post) {
      setUpvotes(post.Upvotes.length);
      setDownvotes(post.Downvotes.length);
    }
  }, [post, posts]);

  const fetchUser = async () => {
    if (post.IsBlocked) {
      setUsername("Blocked User");
      setEmail("Blocked User");
      return;
    }
    const res = await fetch(
      `http://localhost:4000/api/user/otheruser/${post.Posted_By}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setEmail(data.Email);
      setUsername(data.Username);
    } else {
      console.log(data.err);
    }
  };
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  const checkUpvotes = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/checkupvote/${post._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      if (data.message) {
        setUpvoted(true);
      } else {
        setUpvoted(false);
      }
    } else {
      console.log(data.err);
    }

    const res2 = await fetch(
      `http://localhost:4000/api/posts/checkdownvote/${post._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data2 = await res2.json();
    if (res2.ok) {
      if (data2.message) {
        setDownvoted(true);
      } else {
        setDownvoted(false);
      }
    } else {
      console.log(data2.err);
    }
  };

  useEffect(() => {
    if (post) {
      checkUpvotes();
      console.log(post.Text);
    }
  }, [posts]);

  const upvote = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/upvote/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUpvotes(upvotes + 1);
      setUpvoted(true);
    }
    else{
      alert(data.error)
    }
    console.log(data);
  };

  const downvote = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/downvote/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setDownvotes(downvotes + 1);
      setDownvoted(true);
    }
    else{
      alert(data.error)
    }

    console.log(data);
  };

  const removeupvote = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/removeupvote/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setUpvotes(upvotes - 1);
      setUpvoted(false);
    }
    else{
      alert(data.error)
    }

    console.log(data);
  };

  const removedownvote = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/removedownvote/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setDownvotes(downvotes - 1);
      setDownvoted(false);
    }
    else{
      alert(data.error)
    }
    console.log(data);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const checkfollowing = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/checkfollowing/${post.Posted_By}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      if (data.Following) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    } else {
      console.log(data.err);
      alert(data.err);
    }
  };

  useEffect(() => {
    if (user) {
      checkfollowing();
    }
  }, [user, posts]);

  const followUser = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/follow/${post.Posted_By}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setFollowing(true);
    } else {
      console.log(data.err);
      setFollowing(true);
    }
  };

  const unfollowUser = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/unfollow/${post.Posted_By}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setFollowing(false);
    } else {
      console.log(data.err);
      setFollowing(false);
    }
  };

  const checkSaved = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/issavedpost/${post._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      if (data.Saved) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } else {
      console.log(data.err);
    }
  };

  useEffect(() => {
    if (user) {
      checkSaved();
    }
  }, [user, posts]);

  const removeSaved = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/removesavedpost/${post._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setSaved(false);
    } else {
      console.log(data.err);
      setSaved(true);
    }
  };

  const savepost = async () => {
    const res = await fetch(
      `http://localhost:4000/api/user/addsavedpost/${post._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setSaved(true);
    } else {
      console.log(data.err);
      setSaved(false);
    }
  };

  // Question : When do we use content type application/json ?
  // Answer : When we are sending data to the server in the body of the request, we need to specify the content type as application/json.

  const ReportPost = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:4000/api/report/reportpost/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Reason: Reason,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setReported(true);
    } else {
      console.log(data.err);
      setReported(false);
    }
  };

  const isReported = async () => {
    const res = await fetch(
      `http://localhost:4000/api/report/checkreport/${post._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      if (data.isReported) {
        setReported(true);
      } else {
        setReported(false);
      }
    } else {
      console.log(data.err);
    }
  };

  useEffect(() => {
    if (user) {
      isReported();
    }
  }, [user, posts]);

  const handleUpvote = async (e) => {
    e.preventDefault();
    const tempupvote = upvoted;
    const tempdownvote = downvoted;
    console.log("please");
    console.log(tempupvote);
    console.log(tempdownvote);
    if (tempdownvote) {
      await removedownvote();
      await upvote();
    } else if (tempupvote) {
      await removeupvote();
    } else {
      await upvote();
    }
  };

  const handleDownvote = async (e) => {
    e.preventDefault();
    const tempupvote = upvoted;
    const tempdownvote = downvoted;
    console.log("please");
    console.log(tempupvote);
    console.log(tempdownvote);
    if (tempupvote) {
      await removeupvote();
      await downvote();
    } else if (tempdownvote) {
      await removedownvote();
    } else {
      await downvote();
    }
  };

  // comments
  const getComments = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/getcomments/${post._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setComments(data);
    } else {
      console.log(data.err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:4000/api/posts/addcomment/${post._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: comment,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setComment("");
      getComments();
    } else {
      console.log(data.err);
    }
  };

  useEffect(() => {
    if (user && openComment) {
      getComments();
    }
  }, [user, posts,openComment]);

  return (
    <div className="post">
      <Card sx={{ maxWidth: "100%" }}>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create a new Subgreddiit</DialogTitle>
          <DialogContent>
            <form onSubmit={ReportPost}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="text"
                name="text"
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
                // autoComplete="email"
                autoFocus
              />
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={0.5} sx={{ margin: "auto" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {upvoted && (
                  <ThumbUpIcon
                    sx={{ color: "green" }}
                    onClick={(e) => {
                      handleUpvote(e);
                    }}
                  />
                )}
                {!upvoted && (
                  <ThumbUpIcon
                    onClick={(e) => {
                      handleUpvote(e);
                    }}
                  />
                )}

                <Typography gutterBottom variant="h5" component="div">
                  {upvotes - downvotes}
                </Typography>
              </Box>
              {downvoted && (
                <ThumbDownIcon
                  sx={{ color: "red" }}
                  onClick={(e) => {
                    handleDownvote(e);
                  }}
                />
              )}
              {!downvoted && (
                <ThumbDownIcon
                  onClick={(e) => {
                    handleDownvote(e);
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={11.5} sx={{ margin: "auto" }}>
              <Typography variant="body2" color="text.secondary">
                Posted By {Username}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {post.Text}
              </Typography>
              {/* text field for comments */}

              {/* comments */}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setOpenComment(!openComment)}>
            {openComment ? "Hide Comments" : "Show Comments"}
          </Button>

          {/* <Button size="small" onClick={upvote} disabled={upvoted}>
            Upvote
          </Button>
          <Button size="small" onClick={downvote} disabled={downvoted}>
            Downvote
          </Button>
          <Button size="small" onClick={removeupvote} disabled={!upvoted}>
            Remove Upvote
          </Button>
          <Button size="small" onClick={removedownvote} disabled={!downvoted}>
            Remove Downvote
          </Button> */}

          {!Following && (
            // <Button size="small" onClick={followUser}>
            //   Follow User
            // </Button>
            <>
              {/* <Typography variant="body2" color="text.secondary">
                <PersonAddAlt1Icon onClick={followUser} />Follow User
              </Typography> */}
              <Button
                size="small"
                onClick={followUser}
                startIcon={<PersonAddAlt1Icon />}
              >
                Follow User
              </Button>
            </>
          )}
          {Following && (
            <Button
              size="small"
              onClick={unfollowUser}
              startIcon={<PersonAddDisabledIcon />}
            >
              Unfollow User
            </Button>
          )}
          {!Saved && (
            <Button
              size="small"
              onClick={savepost}
              startIcon={<BookmarkAddIcon />}
            >
              Save Post
            </Button>
          )}

          {Saved && (
            <Button
              size="small"
              onClick={removeSaved}
              startIcon={<BookmarkRemoveIcon />}
            >
              Unsave Post
            </Button>
          )}
          {!Reported && (
            // <Button
            //   size="small"
            //   onClick={(e) => {
            //     e.preventDefault();
            //     setOpen(true);
            //   }}
            // >
            //   Report Post
            // </Button>
            <Button
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setOpen(true);
              }}
              startIcon={<ReportProblemIcon />}
            >
              Report Post
            </Button>
          )}
          {Reported && (
            <Button
              size="small"
              onClick={() => {alert("You have already reported this post")}}
              startIcon={<ReportProblemIcon sx={{ color: "red" }} />}
            >
              Unreport Post
            </Button>
          )}
        </CardActions>
        <Collapse in={openComment} timeout="auto" unmountOnExit>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="comment"
                name="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                // autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={addComment}
              >
                Add Comment
              </Button>
            </Box>
            <Typography paragraph>Comments:</Typography>
            {comments.map((comment) => (
              <Typography paragraph key={comment._id}>
                {comment}
              </Typography>
            ))}
          </CardContent>
        </Collapse>
      </Card>
      <br />
    </div>
  );
};

export default Post;
