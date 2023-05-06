import { useState, useEffect } from "react";

import { useAuthContext } from "../hooks/useAuthcontext";

import { Grid, TextField, Typography, Card, Button } from "@mui/material";

const ChatBox = ({ TobeShown, socket }) => {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [userid, setUserId] = useState(user.user._id);
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const id = TobeShown.participants.find((m) => m !== userid);
      setReceiverId(id);
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
  }, [TobeShown]);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      TobeShown.participants.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, TobeShown]);

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch(
        `http://localhost:4000/api/conversation/getmessages/${TobeShown._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMessages(data);
      }
    };
    getMessages();
  }, [TobeShown]);

  const sendMessage = async (e) => {
    e.preventDefault();
    socket.current.emit("sendMessage", {
      senderId: userid,
      receiverId,
      text: message,
    });
    const res = await fetch(
      "http://localhost:4000/api/conversation/sendmessage",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({
          receiverId,
          text: message,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setMessages([...messages, data]);
      setMessage("");
    }
  };
  return (
    <div>
      <Card sx={{ margin: "10px", padding: "10px", color: "text.primary" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{Username}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{Email}</Typography>
          </Grid>
        </Grid>
      </Card>
      <div>
        {messages.map((m) => (
          <div>
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              {m.sender === userid ? "You" : Username}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {m.text}
            </Typography>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="message"
          label="Message"
          name="message"
          autoComplete="message"
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
