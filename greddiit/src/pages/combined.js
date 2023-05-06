import { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import { Container } from "@mui/material";
import { Button } from "@mui/material";
import { red } from "@mui/material/colors";

// a function that combines both the login and signup pages into one page

const Combined = () => {
  const [form, setform] = useState("login");

  return (
    <div className="">
      <Container>
      <div className="contained">
        <div className="SignupLogin">
          <Button onClick={() => setform("signup")} className="Button">Signup</Button>
        </div>
        <div className="SignupLogin">
          <Button onClick={() => setform("login")} className="Button">Login</Button>
        </div>
      </div>
      </Container>

      <Container>{form === "login" ? <Login /> : <Signup />}</Container>
    </div>
  );
};

export default Combined;
