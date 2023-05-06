
import { Typography } from "@mui/material";

import { useNavContext } from "../hooks/useNavcontext";
import { useEffect } from "react";
const Home = () => {
  const {nav, dispatch} = useNavContext();
  // dispatch({type:"NO_NAV", payload:"Home"})
  useEffect(() => {
    dispatch({type:"NO_NAV", payload:"Home"})
  }, [])
  return (
    <div>
      {/* <h1>Home</h1> */}
      <Typography variant="h1" component="div" sx={{color:"text.primary"}} gutterBottom>
        Home
      </Typography>
    </div>
  );
};


export default Home;