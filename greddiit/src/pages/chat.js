import { Grid, TextField, Typography } from "@mui/material";

import { useEffect, useState, useRef } from "react";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { margin } from "@mui/system";
import { useAuthContext } from "../hooks/useAuthcontext";
import ConversationBox from "../components/conversation";
import ChatBox from "../components/chatBox";
import { io } from "socket.io-client";

const Chat = () => {
  const [newfriend, setNewfriend] = useState("");
  const [conversations, setConversations] = useState([]);
  const [TobeShown, setTobeShown] = useState(null);
  const socket = useRef(io("ws://localhost:8900"));
  const { user } = useAuthContext();

  console.log(socket);
  useEffect(() => {
    socket.current.emit("addUser", user.user._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      const res = await fetch(
        "http://localhost:4000/api/conversation/getconversations",
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
        setConversations(data);
      }
    };
    getConversations();
  }, []);

  const newConversation = async () => {
    const res = await fetch(
      "http://localhost:4000/api/conversation/newconversation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify({ sender: newfriend }),
      }
    );
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      alert("Conversation created");
      setConversations([...conversations, data]);
    } else {
      alert("Conversation not created");
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            component="div"
            sx={{ color: "text.primary" }}
            gutterBottom
          >
            Conversations
          </Typography>
          <TextField
            id="outlined-basic"
            label="New Friend"
            variant="outlined"
            value={newfriend}
            onChange={(e) => setNewfriend(e.target.value)}
          ></TextField>
          <PersonSearchIcon
            sx={{ color: "text.primary", margin: "auto" }}
            onClick={(e) => {
              e.preventDefault();
              newConversation();
            }}
          />
          {conversations &&
            conversations.map((conversation) => (
              <div>
                <ConversationBox
                  conversation={conversation}
                  TobeShown={TobeShown}
                  setTobeShown={setTobeShown}
                />
              </div>
            ))}
        </Grid>
        {TobeShown && (
          <Grid item xs={12} md={6}>
            <ChatBox TobeShown={TobeShown} socket={socket}/>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Chat;
