import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

const JoiningUsers = ({ subgreddiitName }) => {
  const [joiningUsers, setJoiningUsers] = useState([]);
  const { user } = useAuthContext();
  const fetchJoiningUsers = async () => {
    console.log("fetching joining users");
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/getmodsubreddiitpendingusers/${subgreddiitName}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      setJoiningUsers(data);
    } else {
      console.log(data.err);
    }
  };
  useEffect(() => {
    fetchJoiningUsers();
  }, []);

  const acceptUser = async (acceptid) => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/acceptuser/${subgreddiitName}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ acceptid }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      // filter out the user from the joiningUsers array
      setJoiningUsers(
        joiningUsers.filter((joiningUser) => joiningUser._id !== acceptid)
      );
    } else {
      console.log(data.err);
    }
  };

  const rejectUser = async (acceptid) => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/rejectuser/${subgreddiitName}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ acceptid }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      // filter out the user from the joiningUsers array
      setJoiningUsers(
        joiningUsers.filter((joiningUser) => joiningUser._id !== acceptid)
      );
    } else {
      console.log(data.err);
    }
  };

  return (
    <div>
      {joiningUsers.map((user) => (
        <div key={user._id}>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            <p>{user.Username}</p>
          </Typography>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              acceptUser(user._id);
            }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              rejectUser(user._id);
            }}
          >
            Reject
          </Button>
        </div>
      ))}
    </div>
  );
};

export default JoiningUsers;
