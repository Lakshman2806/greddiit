import { createContext, useReducer,useEffect } from "react";

export const AuthContext = createContext();

export const authreducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                authLoading: false,
                isAuthenticated: true,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                authLoading: false,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authreducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
    
        console.log("checking login");
        console.log(user);
        if (user) {
            dispatch({ type: "LOGIN", payload: user });
            // console.log("in login" + authState)
        }
        else {
            dispatch({ type: "LOGOUT" });
            // console.log("in logout" + authState)
        }
    }, []);

    console.log("state", authState)

    return (
        <AuthContext.Provider value={{ ...authState, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};