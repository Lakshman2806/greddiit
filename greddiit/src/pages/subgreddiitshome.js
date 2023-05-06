import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Avatar, Card, Grid } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import img from "./tichnas.png";
import coverimg from "./cover.jpeg";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import Pageload from "./pageload";
import Post from "../components/posts";
import { Box, positions } from "@mui/system";
const Subgreddiithome = () => {
  const navigate = useNavigate();
  const { subgreddiitName } = useParams();
  const [posts, setPosts] = useState([]);
  const { user } = useAuthContext();
  const [text, setText] = useState("");
  const [subgreddiit, setSubgreddiit] = useState({});
  const [NoOfVisits, setNoOfVisits] = useState(0);
  const [idk, setIdk] = useState(false);
  const [pageload, setPageload] = useState(true);
  const fetchVisits = async () => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/newvisit/${subgreddiitName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setNoOfVisits(data.NumberofVisits);
      setIdk(true);
    }
  };

  useEffect(() => {
    if (!idk) {
      fetchVisits();
    }
  }, []);
  const fetchPosts = async () => {
    const res = await fetch(
      `http://localhost:4000/api/posts/getposts/${subgreddiitName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setPosts(data.posts);
      setSubgreddiit(data.subgreddiit);
    } else {
      alert(data.error);
      navigate("/");
    }
    setPageload(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [open, setOpen] = useState(false);

  const Submitnewpost = async (e) => {
    e.preventDefault();
    //
    console.log(subgreddiit);
    if(subgreddiit)
    {
      // check if text includes subgreddiit banned words
      const bannedwords = subgreddiit.Banned_Keywords;      ;
      if(bannedwords)
      {
        console.log(bannedwords);
        const bannedwordsarray = bannedwords
        bannedwordsarray.forEach((word) => {
          if(text.includes(word))
          {
            var x = window.confirm("Your post contains a" + word + "banned word. Do you want to continue?");
            if(x)
            {
              return;
            }
            // return;
          }
        });
      }
    }
    const res = await fetch(`http://localhost:4000/api/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        Text: text,
        Posted_In: subgreddiitName,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      setOpen(false);
      setPosts([data.post, ...posts]);
    } else {
      console.log(data.err);
    }
  };

  return (
    <>
      {pageload ? (
        <Pageload />
      ) : (
        <div className="page">
          <div className="subgreddiit-cover">
            <img
              src={coverimg}
              alt="subgreddiit cover"
              className="subgreddiit-cover-img"
              width="80%"
              height={150}
            />
          </div>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Create a new Subgreddiit</DialogTitle>
            <DialogContent>
              <form onSubmit={Submitnewpost}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="text"
                  label="text"
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
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
          {/* <h1>{subgreddiitName}</h1> */}
          {/*Question: How to add a circular picture on the card whose position in fixed and a liitle bit above the card */}
          {/* Answer: Use the Avatar component from material-ui */}
          {/* Question: But a part of the avatar that should come out of the card */}

          <Card sx={{ width: "100%", zIndex: -100 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  zIndex: 100,
                  position: "absolute",
                  // top: 10,
                  left: "10%",
                  transform: "translate(-50%, -50%)",
                }}
                alt="Remy Sharp"
                src={img}
              />
              <Typography
                gutterBottom
                variant="h3"
                component="div"
                textAlign={"center"}
              >
                {subgreddiitName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"center"}
              >
                {NoOfVisits} members
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subgreddiit.Description}
              </Typography>
            </CardContent>
          </Card>
          <Button onClick={() => setOpen(true)}>Create a new post</Button>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              {posts.map((post) => (
                <Post post={post} posts={posts} />
              ))}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {subgreddiitName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subgreddiit.Description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default Subgreddiithome;
