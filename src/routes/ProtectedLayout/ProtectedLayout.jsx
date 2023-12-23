import {Outlet} from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';

const ProtectedLayout = () => {
    return (
        <>
            <NavBar/>
            <main>
                <Outlet/>
            </main>
        </>
    );
};

export default ProtectedLayout;
