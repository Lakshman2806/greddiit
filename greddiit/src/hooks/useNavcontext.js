import {useContext} from 'react';
import {NavContext} from '../context/navcontext';

export const useNavContext = () => {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error('useNavContext must be used within NavContextProvider');
    }
    return context;
}