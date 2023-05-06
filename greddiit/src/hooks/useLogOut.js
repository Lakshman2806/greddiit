import { useAuthContext } from "./useAuthcontext";
import { useMysubgreddiitsContext } from "../hooks/useMysubgreddiitscontext";


export const useLogOut = () => {
    const {dispatch} = useAuthContext();
    const {dispatch: mysubgreddiitsdispatch} = useMysubgreddiitsContext();
    const logout = () => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        mysubgreddiitsdispatch({ type: "SET_MYSUBGREDDIITS", payload: null });
    };
    return { logout };
}