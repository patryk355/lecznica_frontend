import { createContext, useEffect, useState } from 'react';
import {useUserStore} from "../store/userStore.js";

const initialValues = {
  darkMode: true,
  onChangeThemeMode: () => {},
  isLogged: false,
  login: () => {},
  logout: () => {},
};

export const AppContext = createContext(initialValues);

export function AppContextProvider({ children }) {
  const [darkMode, setDarkMode] = useState(initialValues.darkMode);
  const [isLogged, setIsLogged] = useState(initialValues.isLogged);

  const {setUser} = useUserStore(state => state);

  useEffect(() => {
    const theme = sessionStorage.getItem('theme');

    if (theme === 'light') {
      onChangeThemeMode(false);
    } else {
      onChangeThemeMode(true);
    }
  }, []);

  const onChangeThemeMode = (value) => {
    if (value) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDarkMode(true);
      sessionStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setDarkMode(false);
      sessionStorage.setItem('theme', 'light');
    }
  };

  const login = (token) => {
    setIsLogged(true);
    sessionStorage.setItem('token', token);
  };

  const logout = () => {
    setIsLogged(false);
    sessionStorage.setItem('token', '');
    setUser({
      id: null,
      login: '',
      is_admin: null,
      token: ''
    });
  };

  return (
    <AppContext.Provider
      value={{
        darkMode: darkMode,
        onChangeThemeMode,
        isLogged,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
