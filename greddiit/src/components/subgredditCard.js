import { useAuthContext } from "../hooks/useAuthcontext";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {Avatar} from "@mui/material";

const SubgreddiitCard = ({ subgreddit }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  useEffect(() => {
    if (user) {
      setIsMember(subgreddit.Joined_Users.includes(user.user._id));
      setIsModerator(subgreddit.Moderators.includes(user.user._id));
      setIsPending(subgreddit.Pending_Users.includes(user.user._id));
      setIsBanned(subgreddit.Blocked_Users.includes(user.user._id));
    }
  }, [user, subgreddit]);

  const joinSubgreddit = async () => {
    if (isBanned) {
      alert("You are banned from this subgreddit");
      return;
    }
    if (isPending) {
      alert("You have already sent a request to join this subgreddit");
      return;
    }
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/addpendinguser/${subgreddit.Name}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      alert("Request sent to join subgreddit");
    } else {
      console.log(data);
      alert(data.error);
    }
  };

  const leaveSubgreddit = async () => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/leaveSubgreddiit/${subgreddit.Name}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log(data);
      alert("Left subgreddit");
    } else {
      console.log(data);
      alert(data.error);
    }
  };

  return (
    <div>
      <Card sx={{ padding: 0 }}>
        <CardHeader title={subgreddit.Name} />
        <CardContent sx={{ paddingTop: 0, marginTop: 0 }}>
          <Typography variant="body2" color="text.secondary" component="p">
            {subgreddit.Description}
          </Typography>
          <br />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subgreddit.Tags.map((tag) => (
              <Chip label={tag} sx={{ marginRight: 1 }} />
            ))}
          </Typography>
          <br />
          {isMember ? (
            <Button onClick={leaveSubgreddit} disabled={isModerator}>
              Leave
            </Button>
          ) : (
            <Button onClick={joinSubgreddit}>Join</Button>
          )}
          <Button
            onClick={() => {
              if (isBanned) {
                alert("You are banned from this subgreddit");
                return;
              }
              navigate(`/subgreddiit/${subgreddit.Name}`);
            }}
          >
            View
          </Button>
        </CardContent>
      </Card>
      <br />
    </div>
  );
};

export default SubgreddiitCard;
