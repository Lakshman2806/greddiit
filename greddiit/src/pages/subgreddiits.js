import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

import SubgreddiitCard from "../components/subgredditCard";
import Pageload from "./pageload";
const Subgreddiits = () => {
  const [pageload, setPageload] = useState(true);
  const [subgreddiits, setSubgreddiits] = useState([]);
  const [initialSubgreddiits, setInitialSubgreddiits] = useState([]);
  const [filteredSubgreddiits, setFilteredSubgreddiits] = useState([]);
  const [tobeshown, setTobeshown] = useState([]);
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [tagstext, setTagstext] = useState("");
  const [tags, setTags] = useState([]);
  const fetchSubgreddiits = async () => {
    const res = await fetch(
      "http://localhost:4000/api/subgreddiits/getallsubreddiits",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    setSubgreddiits(data);
    setInitialSubgreddiits(data);
    setFilteredSubgreddiits(data);
  };
  useEffect(() => {
    fetchSubgreddiits();
    setPageload(false);
  }, []);

  const filterSubgreddiits = () => {
    if (search === "") {
      setFilteredSubgreddiits(subgreddiits);
    } else {
      setFilteredSubgreddiits(
        subgreddiits.filter((subgreddiit) =>
          subgreddiit.Name.toLowerCase().match(search.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    filterSubgreddiits();
  }, [search]);

  const filterSubgreddiitsbasedonTags = async (e) => {
    e.preventDefault();
    if (tagstext === "") {
      console.log(initialSubgreddiits);
      setSubgreddiits(initialSubgreddiits);
      setFilteredSubgreddiits(initialSubgreddiits);
      console.log(filteredSubgreddiits);
      return;
    }
    console.log(tagstext.split(","));
    var x = tagstext.split(",");
    // setTags(tagstext.split(","));
    // setTags(x);

    console.log("Tags: " + tags);
    const res = await fetch(
      "http://localhost:4000/api/subgreddiits/getsubreddiitsbytags",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          tags: x,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setSubgreddiits(data);
      setFilteredSubgreddiits(data);
    }
  };
  // Sort the filtered subgreddiits based on number of followers
  const sortByFollowers = (e) => {
    e.preventDefault();
    if (filteredSubgreddiits.length === 0) {
      return;
    }
    const temp = [];
    filteredSubgreddiits.forEach((subgreddiit) => {
      temp.push(subgreddiit);
    });
    temp.sort((a, b) => {
      return b.Joined_Users.length - a.Joined_Users.length;
    });
    setFilteredSubgreddiits(temp);
  };

  // Sort the filtered subgreddiits based on Name
  const sortByName = (e) => {
    e.preventDefault();
    if (filteredSubgreddiits.length === 0) {
      return;
    }
    const temp = [];
    filteredSubgreddiits.forEach((subgreddiit) => {
      temp.push(subgreddiit);
    });
    temp.sort((a, b) => {
      return a.Name.localeCompare(b.Name);
    });
    setFilteredSubgreddiits(temp);
  };

  // Sort the filtered subgreddiits based on creation date
  const sortByDate = (e) => {
    e.preventDefault();
    if (filteredSubgreddiits.length === 0) {
      return;
    }
    const temp = [];
    filteredSubgreddiits.forEach((subgreddiit) => {
      temp.push(subgreddiit);
    });
    temp.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredSubgreddiits(temp);
  };
  const [joinedsubgreddiits, setJoinedsubgreddiits] = useState([]);
  const [notjoinedsubgreddiits, setNotjoinedsubgreddiits] = useState([]);
  useEffect(() => {
    console.log("filteredSubgreddiits");
    // console.log(filteredSubgreddiits);
    const x = [];
    const y = [];
    console.log(user);
    filteredSubgreddiits.map((subgreddiit) => {
      if (subgreddiit.Joined_Users.includes(user.user._id)) {
        x.push(subgreddiit);
      } else {
        y.push(subgreddiit);
      }
    });
    setJoinedsubgreddiits(x);
    setNotjoinedsubgreddiits(y);
  }, [filteredSubgreddiits]);

  return (
    <div>
      {pageload ? (
        <Pageload />
      ) : (
        <div>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Search based on tags"
            variant="outlined"
            onChange={(e) => setTagstext(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={filterSubgreddiitsbasedonTags}
          >
            filter based on tags
          </Button>
          <Button variant="contained" color="primary" onClick={sortByFollowers}>
            Sort by Followers
          </Button>
          <Button variant="contained" color="primary" onClick={sortByName}>
            Sort by Name
          </Button>
          <Button variant="contained" color="primary" onClick={sortByDate}>
            Sort by Date
          </Button>
          <br />
          <Typography
            variant="h3"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            Subgreddiits
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            Joined Subgreddiits
          </Typography>
          <ul>
            {joinedsubgreddiits &&
              joinedsubgreddiits.map((subgreddiit) => (
                <SubgreddiitCard
                  key={subgreddiit._id}
                  subgreddit={subgreddiit}
                />
              ))}
          </ul>
          <Typography
            variant="h5"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            New Subgreddiits
          </Typography>
          <ul>
            {notjoinedsubgreddiits &&
              notjoinedsubgreddiits.map((subgreddiit) => (
                <SubgreddiitCard
                  key={subgreddiit._id}
                  subgreddit={subgreddiit}
                />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Subgreddiits;
