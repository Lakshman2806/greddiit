import { useMysubgreddiitsContext } from "../hooks/useMysubgreddiitscontext";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { useAuthContext } from "../hooks/useAuthcontext";
import { useNavigate } from "react-router-dom";

const Mysubgreddiit = ({ subgreddiit }) => {
  const { dispatch } = useMysubgreddiitsContext();
  const { user } = useAuthContext();
    const navigate = useNavigate();
  const deleteSubgreddit = async () => {
    const res = await fetch(
      `http://localhost:4000/api/subgreddiits/delete/${subgreddiit._id}`,
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
      console.log(data);
      dispatch({ type: "DELETE_MYSUBGREDDIIT", payload: subgreddiit._id });
    } else {
      console.log(data);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader title={subgreddiit.Name} onClick={()=>{navigate(`/mysubgreddiit/${subgreddiit.Name}`)}}/>
        <CardContent sx={{paddingTop:0,marginTop:0}}>
          <Typography variant="body2" color="text.secondary" >
            {subgreddiit.Description}
          </Typography>
            <Button onClick={deleteSubgreddit}>Delete</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mysubgreddiit;
