import {
  HashRouter as BrowserRouter,
  Routes,
  Route,
  Navigate,
  Router,
  useParams,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import NavBar from "./components/navbar";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Combined from "./pages/combined";
import Mysubgreddiitspage from "./pages/mysubgreddiitspage";
import Mysubgreddiithome from "./pages/mysubgreddiithome";
import Subgreddiithome from "./pages/subgreddiitshome";
import Subgreddiits from "./pages/subgreddiits";
import Savedposts from "./pages/savedposts";
import Chat from "./pages/chat";
import { useAuthContext } from "./hooks/useAuthcontext";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { user, authLoading, isAuthenticated } = useAuthContext();

  // Solved the problem of reloading the page and loosing the path by not rendering the app until the user is authenticated

  // setNav(false)
  // const {nav, dispatch} = useNavContext();

  // dispatch({type:"NO_NAV", payload:"Home"})
  useEffect(() => {
    if (!authLoading) {
      console.log("user is authenticated");
      console.log("fyu")
    }
  }, [authLoading]);

  return (
    <div className="App">
      {authLoading && <div>Loading...</div>}
      {!authLoading && (
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <NavBar/>
          <div className="pages" style={{marginLeft:0,paddingLeft:0,paddingRight:0}}>
            <Routes>
              <Route
                exact
                path="/profile"
                element={user ? <Profile /> : <Navigate to="/register" />}
              />
              <Route
                exact
                path="/register"
                element={user ? <Navigate to="/" /> : <Combined />}
              />
              <Route
                exact
                path="/mysubgreddiits"
                element={user ? <Mysubgreddiitspage /> : <Navigate to="/register" />}
              />
              <Route
                exact
                path="/mysubgreddiit/:subgreddiitName"
                element={user ?  <Mysubgreddiithome/>: <Navigate to="/register" />}
              />
              <Route
                exact
                path="/subgreddiit"
                element={user ? <Subgreddiits /> : <Navigate to="/register" />}
              />
              <Route
                exact
                path="/subgreddiit/:subgreddiitName"
                element={user ?  <Subgreddiithome/>: <Navigate to="/register" />}
              />
              <Route
                exact
                path="/savedposts"
                element={user ? <Savedposts /> : <Navigate to="/register" />}
              />
              <Route
                exact
                path="/chat"
                element={user ? <Chat /> : <Navigate to="/register" />}
              />
              <Route
                exact
                path="/"
                element={user ? <Home /> : <Navigate to="/register" />}
              />
            </Routes>
            
          </div>
        </BrowserRouter>
      </ThemeProvider>
      )}
    </div>
  );
}

export default App;
