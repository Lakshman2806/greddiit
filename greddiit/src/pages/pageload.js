import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import Typography from "@mui/material/Typography";




const Pageload = () => {

    return (
        <div>
            <Typography variant="h1" color="text.primary" align="center" sx={{marginTop: "10%"}}>
                Loading...
            </Typography>
        </div>
    );
};

export default Pageload;