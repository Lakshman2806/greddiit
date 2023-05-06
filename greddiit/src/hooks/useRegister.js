import { useState } from "react";
import { useAuthContext } from "./useAuthcontext";

export const useSignup = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const signup = async (First_name, Last_name, Username, Email, Age, Contact_number, Password) => {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:4000/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ First_name, Last_name, Username, Email, Age, Contact_number, Password}),
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.err);
            setLoading(false);
            return;
        }

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data));

            dispatch({ type: "LOGIN", payload: data });
            setLoading(false);
        }
    };

    return { signup, error, loading };
}