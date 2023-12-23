import {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import LogoIcon from '../../icons/LogoIcon';
import {LogoutIcon} from '../../icons/LogoutIcon';
import {AppContext} from '../../context/appContext';
import ThemeModeSwitch from '../ThemeModeSwitch/ThemeModeSwitch';

import './NavBar.scss';

const NavBar = () => {
    const {darkMode, isLogged, logout} = useContext(AppContext);

    return (
        <nav className={isLogged ? 'is-logged' : ''}>
            <NavLink to='/'>
                <LogoIcon darkMode={darkMode}/>
            </NavLink>
            {isLogged && (
                <>
                    <ul>
                        <li>
                            <NavLink
                                to='/patients'
                                className={({isActive}) => (isActive ? 'active' : undefined)}
                            >
                                Karty pacjentów
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/clients'
                                className={({isActive}) => (isActive ? 'active' : undefined)}
                            >
                                Klienci
                            </NavLink>
                        </li>
                    </ul>
                </>
            )}
            <div className='icons-container'>
                {isLogged && (
                    <span title='Wyloguj' onClick={logout}>
            <LogoutIcon/>
          </span>
                )}
                <ThemeModeSwitch/>
            </div>
        </nav>
    );
};

export default NavBar;
