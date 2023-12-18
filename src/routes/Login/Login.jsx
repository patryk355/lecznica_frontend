import {useContext, useState} from 'react';
import {toast} from 'react-toastify';
import axios from "axios";
import NavBar from '../../components/NavBar/NavBar';
import {AppContext} from '../../context/appContext';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import Input from '../../components/Input/Input';
import {colors} from '../../constants/colors';
import {useUserStore} from "../../store/userStore.js";

import './Login.scss';

const Login = () => {
    const {login, darkMode} = useContext(AppContext);

    const {setUser} = useUserStore(state => state);

    const [data, setData] = useState({login: '', password: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        const _errors = [];

        if (data.login.trim().length === 0) {
            _errors.push('login');
        }

        if (data.password === '') {
            _errors.push('password');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        axios.post(`${import.meta.env.VITE_API_URL}/auth`, {
            login: data.login.trim(),
            password: data.password,
        })
            .then(user => {
                console.debug('Login :: onSubmitHandler', user);
                toast.success('Zalogowano pomyślnie');
                setUser(user.data);
                login(user.data.token);
            })
            .catch(err => {
                toast.error('Nieudane logowanie');
                console.error('Login :: onSubmitHandler', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <NavBar/>
            <main id='login-container'>
                <form
                    onSubmit={onSubmitHandler}
                    className={darkMode ? 'dark-mode' : 'light-mode'}
                >
                    <h2>Lecznica dla zwierząt</h2>
                    <Input
                        id='login'
                        label='Nazwa użytkownika'
                        placeholder='Wpisz nazwę użytkownika'
                        value={data.login}
                        onChange={(e) => setData({...data, login: e.target.value})}
                        hasError={errors.includes('login')}
                        errorText='Nazwa użytkownika nie może być pusta'
                        inputWidth='16rem'
                    />
                    <Input
                        id='password'
                        label='Hasło'
                        type='password'
                        placeholder='Wpisz hasło'
                        value={data.password}
                        onChange={(e) => setData({...data, password: e.target.value})}
                        hasError={errors.includes('password')}
                        errorText='Hasło nie może być puste'
                        inputWidth='16rem'
                    />
                    {isLoading ? (
                        <Loader color={darkMode ? colors.yellow : colors.purple}/>
                    ) : (
                        <Button text='Zaloguj' type='submit'/>
                    )}
                </form>
            </main>
        </>
    );
};

export default Login;
