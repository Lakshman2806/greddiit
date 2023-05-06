import { useState, useEffect } from "react";

import { useAuthContext } from "../hooks/useAuthcontext";

import { Grid, TextField, Typography, Card, Button } from "@mui/material";

const ConversationBox = ({ conversation,TobeShown,setTobeShown }) => {
  const { user } = useAuthContext();
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const userid = user.user._id;
  useEffect(() => {
    const fetchUser = async () => {
      const id = conversation.participants.find((m) => m !== userid);
      const res = await fetch(
        `http://localhost:4000/api/user/otheruser/${id}`,
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
    fetchUser();
  }, []);
  return (
    <div>
      <Card sx={{ margin: "10px", padding: "10px",color:"text.primary" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{Username}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{Email}</Typography>
          </Grid>
        </Grid>
        <Button>
            <Typography
                variant="body2"
                onClick={() => {
                    setTobeShown(conversation);
                }}
            >
                Open
            </Typography>
        </Button>
      </Card>
    </div>
  );
};

export default ConversationBox;
