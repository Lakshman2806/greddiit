import Post from "../components/posts";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Typography } from "@mui/material";
import Pageload from "./pageload";
const Savedposts = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthContext();
  const [pageload, setPageload] = useState(true);
  const fetchPosts = async () => {
    const res = await fetch(`http://localhost:4000/api/user/getsavedposts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data);
    }
    if (res.ok) {
      console.log(data);
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
    setPageload(false);
  }, []);

  return (
    <>
      {pageload && <Pageload />}
      {!pageload && 
        <div>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Saved Posts
          </Typography>
          {posts && posts.map((post) => <Post post={post} posts={posts} />)}
        </div>
      }
    </>
  );
};

export default Savedposts;
