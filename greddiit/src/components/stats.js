// A stats page of a subgreddiit, Should use chart.js to display the data
import {useState, useEffect} from 'react';
import {useAuthContext} from '../hooks/useAuthcontext';
import { Typography } from '@mui/material';
import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { style } from '@mui/system';
// import { canvas } from 'chart.js/dist/helpers/helpers.canvas';
const Stats=({subgreddiitName})=>{
    const {user} = useAuthContext();

    const [growth, setGrowth] = useState([]);
    const [postsgrowth, setPostGrowth] = useState([]);
    const [usersgrowth, setUsersGrowth] = useState([]);
    const [NoOfReports, setNoOfReports] = useState(0);
    const [NoOfDeletedPosts, setNoOfDeletedPosts] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const fetchStats = async () => {

        const res1 = await fetch(`http://localhost:4000/api/subgreddiits/getsubgreddiitgrowth/${subgreddiitName}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`
            }

        });

        const data1 = await res1.json();
        if (res1.ok) {
            setGrowth(data1);
        }
        else{
            console.log("data1.err")
            console.log(data1.error);
        }

        const res2 = await fetch(`http://localhost:4000/api/subgreddiits/getsubgreddiitpostgrowth/${subgreddiitName}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`
            }

        });

        const data2 = await res2.json();
        if (res2.ok) {
            setPostGrowth(data2);
        }
        else{
            console.log("data2.err")
            console.log(data2.error);
        }

        const res3 = await fetch(`http://localhost:4000/api/subgreddiits/getsubgreddiitvisitors/${subgreddiitName}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`
            }

        });

        const data3 = await res3.json();
        if (res3.ok) {
            setUsersGrowth(data3);
        }
        else{
            console.log("data3.err")
            console.log(data3.error);
        }

        const res4 = await fetch(`http://localhost:4000/api/subgreddiits/getreportedpostsno/${subgreddiitName}`, {
    
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`
            }

        });

        const data4 = await res4.json();
        if (res4.ok) {
            setNoOfReports(data4.TotalReports);
            setNoOfDeletedPosts(data4.TotalDeleted);
        }
        else{
            console.log("data4.err")
            console.log(data4.error);
        }

    };

    useEffect(() => {
        if (user) {
            fetchStats();
            setIsLoaded(true);
        }
    }
    , [user]);

    const data = {
        labels: growth.map((item)=>item.date),
        datasets: [
            {
                label: 'members',
                data: growth.map((item)=>item.members),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        style:{
            width: '100%',
            height: '100%',
        }
    };

    const data2 = {
        labels: postsgrowth.map((item)=>item.date),
        datasets: [
            {
                label: 'Posts',
                data: postsgrowth.map((item)=>item.posts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };


    const data3 = {
        labels: usersgrowth.map((item)=>item.date),
        datasets: [
            {
                label: 'Users',
                data: usersgrowth.map((item)=>item.visitors),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };


    return (
        <>
        {isLoaded && (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <Typography variant="h4" className="text-center mt-3 mb-3">
                        {subgreddiitName}
                    </Typography>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Typography variant="h6" className="text-center mt-3 mb-3">
                        Subscribers Growth
                    </Typography>
                    <Line data={data} options={options}/>
                    
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Typography variant="h6" className="text-center mt-3 mb-3">
                        Posts Growth
                    </Typography>
                    {/* decrease the size of the chart */}
                    <Bar data={data2} className="bar"/>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Typography variant="h6" className="text-center mt-3 mb-3">
                        Users Growth
                    </Typography>
                    <Bar data={data3}/>
                </div>
            </div>
        </div>
        )}
        </>
    );
}

export default Stats;


