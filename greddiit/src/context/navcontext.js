import { createContext, useReducer,useEffect } from "react";

export const NavContext = createContext();

export const navreducer = (state, action) => {
    switch (action.type) {
        case "NAV":
            return {
                nav: true
            };
        case "NO_NAV":
            return {
                nav: false
            };
        default:
            return state;
    }
}

export const NavContextProvider = ({ children }) => {
    const [navState, dispatch] = useReducer(navreducer, {
        nav: false
    });

    return (
        <NavContext.Provider value={{ ...navState, dispatch }}>
            {children}
        </NavContext.Provider>
    );
}
