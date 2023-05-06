import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useAuthContext } from "../hooks/useAuthcontext";
import { useNavContext } from "../hooks/useNavcontext";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import * as React from "react";
import JoinedUsers from "../components/Joinedusers";
import JoiningUsers from "../components/Joiningusers";
import Reportingpage from "../components/Reportingpage";
import Stats from "../components/stats";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Mysubgreddiithome = () => {
  // gettting the subgreddiit name from the url
  const { subgreddiitName } = useParams();
  const { user } = useAuthContext();
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { nav, dispatch } = useNavContext();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getSubgreddiit = async () => {
      const res = await fetch(
        `http://localhost:4000/api/subgreddiits/ismoderator/${subgreddiitName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        dispatch({ type: "NAV", payload: subgreddiitName });
      } else {
        navigate("/");
        console.log(data);
      }
    };
    getSubgreddiit();
    setLoading(false);
  }, []);

  return (
    <div>
      {!Loading && (
        <div>
      <Grid style={{margin : "auto"}}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Users" {...a11yProps(0)} />
              <Tab label="Joining Requests" {...a11yProps(1)} />
              <Tab label="Stats" {...a11yProps(2)} />
              <Tab label="Reported page" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <JoinedUsers subgreddiitName={subgreddiitName} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <JoiningUsers subgreddiitName={subgreddiitName} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Stats subgreddiitName={subgreddiitName} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Reportingpage subgreddiitName={subgreddiitName} />
          </TabPanel>
        </Box>
      </Grid>
      <Typography
        variant="h5"
        component="div"
        sx={{ color: "text.primary" }}
        gutterBottom
      >
        {subgreddiitName}
      </Typography>
      
      </div>
      )}
    </div>
    
  );
};

export default Mysubgreddiithome;
