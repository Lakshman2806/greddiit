import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useAuthContext } from "../hooks/useAuthcontext";
// import { useMysubgreddiitsContext } from "../hooks/useMysubgreddiitscontext";
import { useMysubgreddiitsContext } from "../hooks/useMysubgreddiitscontext";
import Pageload from "./pageload";
const Mysubgreddiits = () => {
  // const [mysubgreddiits, setMysubgreddiits] = useState([]);
  const { mysubgreddiits, dispatch } = useMysubgreddiitsContext();
  const { user } = useAuthContext();
  const [pageload, setPageload] = useState(true);
  const getdata = () => {
    const fetchdata = async () => {
      const res = await fetch("http://localhost:4000/api/subgreddiits/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      const { subgreddiits } = data;
      console.log(data);

      if (res.ok) {
        dispatch({ type: "SET_MYSUBGREDDIITS", payload: subgreddiits });
      } else {
        console.log(data.ere);
      }
    };

    if (user) {
      console.log("");
      fetchdata();
      setPageload(false);
    }
  };

  useEffect(() => {
    getdata();
  }, [dispatch, user]);
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
  const [isloading, setisloading] = useState(false);
  const Submitnewgreddit = (e) => {
    e.preventDefault();
    setisloading(true);
    console.log("hello");
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
    setisloading(false);
  };

  return (
    <>
      {pageload && <Pageload />}
      {!pageload && (
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
                  onChange={(e) =>
                    setunseperated_banned_keywords(e.target.value)
                  }
                  // autoComplete="email"
                  autoFocus
                />
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                    disabled={isloading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isloading || !Name || !Description || !unseperated_tags || !unseperated_banned_keywords}>Create</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
          <h1>My Subgreddiits</h1>
          <div>
            <Button onClick={handleClicknew}>New Sub Reddiit</Button>
          </div>
          {mysubgreddiits &&
            mysubgreddiits.map((subgreddiit) => (
              <div key={subgreddiit._id}>
                <h2>{subgreddiit.Name}</h2>
                <p>{subgreddiit.Description}</p>
                <h4>Tags</h4>

                <p>
                  {subgreddiit.Tags.map((tags) => (
                    <p>{tags}</p>
                  ))}
                </p>
                <h4>Banned_Keywords</h4>
                <p>
                  {subgreddiit.Banned_Keywords.map((tags) => (
                    <p>{tags}</p>
                  ))}
                </p>
                <Button onClick={console.log("wy")}>Delete Subgreddiit</Button>
              </div>
            ))}
          ;
        </div>
      )}
    </>
  );
};

export default Mysubgreddiits;
