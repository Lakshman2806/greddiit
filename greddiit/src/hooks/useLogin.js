import { useState } from "react";
import { useAuthContext } from "./useAuthcontext";

export const useLogin = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {dispatch} = useAuthContext();
    const login = async (Email, Password) => {
        setLoading(true);
        setError("");
        // console.log("Hi"")
        const response = await fetch("http://localhost:4000/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email, Password }),
        });

        const data = await response.json();
        if(!response.ok) {
            console.log("Hi")
            console.log(data.err);
            setError(data.err);
            setLoading(false);
            return;
        }

        if(response.ok) {
            localStorage.setItem("user", JSON.stringify(data));

            dispatch({ type: "LOGIN", payload: data });
            setLoading(false);
        }
    };

    return { login, error, loading };
};