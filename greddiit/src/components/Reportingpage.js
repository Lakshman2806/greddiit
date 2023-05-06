import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import ReportedPost from "./reportedpost";

const Reportingpage = ({subgreddiitName}) => {
    console.log("Reporting page");
    const [reportedPosts, setReportedPosts] = useState([]);
    const { user } = useAuthContext();  
    const fetchReportedPosts = async () => {
        console.log("fetching reported posts")
        const res = await fetch(`http://localhost:4000/api/report/getallreports/${subgreddiitName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const data = await res.json();
        if (res.ok) {
            console.log(data);
            setReportedPosts(data);
        }
        else {
            console.log(data.err);
        }
    }


    useEffect(() => {
        fetchReportedPosts();
    }
    , []);

    return (
        <div>
            <Typography variant="h4" component="h4" gutterBottom>
                Reported Posts
            </Typography>
            {reportedPosts.map((report) => (
                <ReportedPost report={report} />
            ))}
        </div>

    );
}

export default Reportingpage;

