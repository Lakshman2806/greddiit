import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Typography } from "@mui/material";
const JoinedUsers = ({ subgreddiitName }) => {
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const { user } = useAuthContext();
  const fetchJoinedUsers = async () => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/getmodsubreddiitjoinedusers/${subgreddiitName}`,
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
      setJoinedUsers(data);
    } else {
      console.log(data.err);
    }
  };

  const fetchBlockedUsers = async () => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/getmodsubreddiitblockedusers/${subgreddiitName}`,
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
      setBlockedUsers(data);
    } else {
      console.log(data.err);
    }
  };

  useEffect(() => {
    fetchJoinedUsers();
    fetchBlockedUsers();
  }, []);

  return (
    <div>
      {joinedUsers.map((user) => (
        <div key={user._id}>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            <p>{user.Username}</p>
            <p>Followers: {user.Followers}</p>
            <p>Following: {user.Following}</p>
          </Typography>
        </div>
      ))}

      <Typography
        variant="h5"
        component="div"
        sx={{ color: "text.primary" }}
        gutterBottom
      >
        Blocked Users
      </Typography>
      {blockedUsers.map((user) => (
        <div key={user._id}>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            <p>{user.Username}</p>
            <p>Followers: {user.Followers}</p>
            <p>Following: {user.Following}</p>
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default JoinedUsers;
