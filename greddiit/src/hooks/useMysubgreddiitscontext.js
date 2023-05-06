import {useContext} from 'react';
import {MysubgreddiitsContext} from '../context/mysubgreddiitscontext';

export const useMysubgreddiitsContext = () => {
    const context = useContext(MysubgreddiitsContext);

    if(!context) {
        throw new Error('useMysubgreddiitsContext must be used within a mysubgreddiitsContextProvider');
    }

    return context;
}