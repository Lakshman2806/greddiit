import { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthcontext";

const ReportedPost = ({ report }) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isignored, setIsIgnored] = useState(false);


  const { user } = useAuthContext();
  const DeletePost = async (e) => {
    e.preventDefault();
    console.log("deleting post");
    const res = await fetch(
      `http://localhost:4000/api/report/deletepost/${report.Reported_Post}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      console.log("Successfully deleted post");
      console.log(data);
    } else {
      console.log(data.err);
    }
  };

  const BlockUser = async () => {
    // e.preventDefault();
    console.log("blocking user");
    const res = await fetch(
      `http://localhost:4000/api/report/blockuser/${report.Reported_Post}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          id: report._id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      console.log("Successfully blocked user");
      console.log(data);
    } else {
      console.log(data.err);
    }
  };
  useEffect(() => {
    if (remainingTime > 0 && !isCancelled) {
      const timer = setInterval(() => {
        setRemainingTime((remainingTime) => remainingTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (remainingTime == 0 && !isCancelled) {
      const asyncfunc = async () => {
        console.log("blocking user lessgo");
        await BlockUser();
      };
        asyncfunc();
    }
  }, [remainingTime, isCancelled]);

  useEffect(() => {
    setIsIgnored(report.IsIgnored);
  },[]);

  const TimeoutBlockUser = (e) => {
    e.preventDefault();
    setIsCancelled(false);
    setRemainingTime(3);
  };

  const IgnoreReport = async (e) => {
    e.preventDefault();
    console.log("ignoring report");
    const res = await fetch(
      `http://localhost:4000/api/report/ignorereport/${report._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      console.log("Successfully ignored report");
      console.log(data);
      setIsIgnored(true);
    } else {
      console.log(data.error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {report.Concern}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {report.Text}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Delete</Button> */}
        {/* <Button size="small">Ignore</Button> */}
        <Button size="small" onClick={DeletePost} disabled={isignored}>
          Delete Post
        </Button>
        {remainingTime == 0 && (
          <Button size="small" onClick={TimeoutBlockUser} disabled={isignored}>
            Block Report
          </Button>
        )}
        {remainingTime > 0 && (
          <Button
            size="small"
            onClick={(e) => {
              setRemainingTime(0);
              setIsCancelled(true);
            }}
          >
            Cancel Block in {remainingTime}
          </Button>
        )}
        <Button size="small" onClick={IgnoreReport}>Ignore</Button>
      </CardActions>
    </Card>
  );
};

export default ReportedPost;
