import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
const FollowingUI = ({ id }) => {
  const [Email, setEmail] = useState("email");
  const [Username, setUsername] = useState("username");
  const { user } = useAuthContext();
  const fetchUser = async () => {
    const res = await fetch(`http://localhost:4000/api/user/otheruser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`
      },
    });
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



    const [f, setF] = useState(true);

    const handleClick = async () => {
        const res = await fetch(`http://localhost:4000/api/user/unfollow/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        });
        const data = await res.json();
        if (res.ok) {
            setF(false);
            console.log(data);
        } else {
            console.log(data.err);
        }
    };
    

  return (
    <div>
      {f && (
        <div>
          <Typography>
            {Email} : {Username}
          </Typography>
        </div>
      )}
      <Button onClick={handleClick}>Delete</Button>
    </div>
  );
};

export default FollowingUI;
