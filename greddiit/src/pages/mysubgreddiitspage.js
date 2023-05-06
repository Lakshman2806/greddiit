import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { useMysubgreddiitsContext } from "../hooks/useMysubgreddiitscontext";
import Mysubgreddiit from "../components/mysubgreddiit";
import { TextField } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { useNavContext } from "../hooks/useNavcontext";
import Pageload from "./pageload";

const Mysubgreddiitspage = () => {
  const { user } = useAuthContext();
  const [pageload, setPageload] = useState(true);
  const { mysubgreddiits, dispatch } = useMysubgreddiitsContext();
  const { nav, dispatch: dispatchnav } = useNavContext();

  // dispatchnav({ type: "NO_NAV", payload: "My Subgreddiits" });
  useEffect(() => {
    const fetchmysubgreddiits = async () => {
      const res = await fetch("http://localhost:4000/api/subgreddiits/get", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      const { subgreddiits } = data;
      if (res.ok) {
        dispatch({ type: "SET_MYSUBGREDDIITS", payload: subgreddiits });
      }
    };
    if (user) {
      fetchmysubgreddiits();
      setPageload(false);
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatchnav({ type: "NO_NAV", payload: "My Subgreddiits" });
  }, []);

  const [open, setOpen] = useState(false);
  const handleClicknew = () => {
    setOpen(true);
  };
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [tags, setTags] = useState(null);
  const [banned_Keywords, setBanned_Keywords] = useState(null);
  const [unseperated_tags, setunseperated_tags] = useState("");
  const [unseperated_banned_keywords, setunseperated_banned_keywords] =
    useState();
  const [Loading, setLoading] = useState(false);
  const Submitnewgreddit = (e) => {
    e.preventDefault();
    console.log("hello");
    setLoading(true);
    // console.log(unseperated_tags.split(","));
    var Tags = unseperated_tags.split(",");

    var Banned_Keywords = unseperated_banned_keywords.split(",");
    setBanned_Keywords(unseperated_banned_keywords.split(","));
    const fetchdata = async () => {
      const res = await fetch("http://localhost:4000/api/subgreddiits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          Name,
          Description,
          Tags,
          Banned_Keywords,
        }),
      });
      const data = await res.json();
      const { subgreddiit } = data;
      if (res.ok) {
        console.log(subgreddiit);
        dispatch({ type: "ADD_MYSUBGREDDIIT", payload: subgreddiit });
      } else {
        console.log(data.err);
      }
      setLoading(false);
    };
    setunseperated_banned_keywords("");
    setunseperated_tags("");
    setName("");
    setDescription("");
    setTags([]);
    setBanned_Keywords([]);
    setOpen(false);
    if (user) {
      fetchdata();
      
    }
  };

  return (
    <div>
      {pageload ? (<Pageload />) : (
        <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a new Subgreddiit</DialogTitle>
        <DialogContent>
          <form onSubmit={Submitnewgreddit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              // autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Description"
              label="Description"
              name="Description"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              // autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Tags"
              label="Tags"
              name="Tags"
              value={unseperated_tags}
              onChange={(e) => setunseperated_tags(e.target.value)}
              // autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Banned_Keywords"
              label="Banned_Keywords"
              name="Banned_Keywords"
              value={unseperated_banned_keywords}
              onChange={(e) => setunseperated_banned_keywords(e.target.value)}
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
              <Button type="submit" disabled ={!Name || !Description || !unseperated_banned_keywords|| !unseperated_tags || Loading}>Create</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <div>
        <Typography
          variant="h5"
          component="div"
          sx={{ color: "text.primary" }}
          gutterBottom
        >
          Home
        </Typography>
        <div>
          <Button onClick={handleClicknew}>New Sub Reddiit</Button>
        </div>
        {mysubgreddiits &&
          mysubgreddiits.map((subgreddiit) => (
            <Grid >
              <Grid item xs={12} sm={6}>
                <Mysubgreddiit subgreddiit={subgreddiit} />
              </Grid>
              <br/>
            </Grid>
          ))}
      </div>
      </div>
      )}
    </div>
  );
};

export default Mysubgreddiitspage;
