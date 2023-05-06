import { createContext, useReducer } from "react";

export const MysubgreddiitsContext = createContext();

export const MysubgreddiitsReducer = (state, action) => {
    switch (action.type) {
        case "SET_MYSUBGREDDIITS":
            return {
                mysubgreddiits: action.payload,
            };
        case "ADD_MYSUBGREDDIIT":
            return {
                mysubgreddiits: [action.payload, ...state.mysubgreddiits],
            };
        case "DELETE_MYSUBGREDDIIT":
            return {
                mysubgreddiits: state.mysubgreddiits.filter(
                    (subgreddiit) => subgreddiit._id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export const MysubgreddiitsContextProvider = ({ children }) => {
  const [mysubgreddiits, dispatch] = useReducer(MysubgreddiitsReducer, {
    mysubgreddiits: null,
  });
  return (
    <MysubgreddiitsContext.Provider value={{...mysubgreddiits, dispatch }}>
      {children}
    </MysubgreddiitsContext.Provider>
  );
};
