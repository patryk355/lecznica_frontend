import {useContext, useState} from "react";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import axios from "../../../api/axios.js";
import {colors} from "../../../constants/colors.js";
import {phoneValidator, stringRequiredValidator} from "../../../utils/validators.js";
import {useClientStore} from "../../../store/clientStore.js";

import '../../Appointments/Appointments.scss';

const AddClient = ({client, onClose}) => {
    const {darkMode} = useContext(AppContext);

    const {addClient, editClient} = useClientStore(state => state);

    const initialData = {
        first_name: client ? client.first_name : '',
        last_name: client ? client.last_name : '',
        phone_number: client ? client.phone_number : '',
        city: client ? client.city : '',
        postcode: client ? client.postcode : '',
        street: client ? client.street : '',
        street_number: client ? client.street_number : '',
    };

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const _data = {
            first_name: data.first_name.trim(),
            last_name: data.last_name.trim(),
            city: data.city.trim(),
            postcode: data.postcode.trim(),
            street: data.street.trim(),
            street_number: data.street_number.trim(),
            phone_number: data.phone_number.trim(),
        };

        const _errors = [];

        if (!stringRequiredValidator(_data.first_name)) {
            _errors.push('first_name');
        }
        if (!stringRequiredValidator(_data.last_name)) {
            _errors.push('last_name');
        }
        if (!stringRequiredValidator(_data.city)) {
            _errors.push('city');
        }
        if (!stringRequiredValidator(_data.postcode)) {
            _errors.push('postcode');
        }
        if (!stringRequiredValidator(_data.street)) {
            _errors.push('street');
        }
        if (!stringRequiredValidator(_data.street_number)) {
            _errors.push('street_number');
        }
        if (!phoneValidator(_data.phone_number)) {
            _errors.push('phone_number');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        if (client && client.id) {
            try {
                const result = await axios.put(`/clients/${client.id}`, _data);
                editClient(client.id, result.data);
                console.debug('AddClient :: submitHandler', result);
                toast.success('Dane klienta zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddClient :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych klienta');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/clients`, _data);
                console.debug('AddClient :: submitHandler', result);
                toast.success('Nowy klient został utworzony');
                addClient(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddClient :: submitHandler', err);
                toast.error('Nie udało się dodać nowego klienta');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const onChangeHandler = (e) => {
        const {name, value} = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return <Modal onClose={onClose} width={500} disableOverlayOnClose={true}>
        <div className={"add-appointment"}>
            <h2>{client ? 'Edytuj klienta' : 'Dodaj klienta'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input id={'first_name'} label={'Imię'} value={data.first_name} onChange={onChangeHandler}
                           hasError={errors.includes('first_name')} errorText={'Pole wymagane'}/>
                    <Input id={'last_name'} label={'Nazwisko'} value={data.last_name} onChange={onChangeHandler}
                           hasError={errors.includes('last_name')} errorText={'Pole wymagane'}/>
                    <Input id={'city'} label={'Miejscowość'} value={data.city} onChange={onChangeHandler}
                           hasError={errors.includes('city')} errorText={'Pole wymagane'}/>
                    <Input id={'postcode'} label={'Kod pocztowy'} value={data.postcode} onChange={onChangeHandler}
                           hasError={errors.includes('postcode')} errorText={'Pole wymagane'}/>
                    <Input id={'street'} label={'Ulica'} value={data.street} onChange={onChangeHandler}
                           hasError={errors.includes('street')} errorText={'Pole wymagane'}/>
                    <Input id={'street_number'} label={'Numer domu'} value={data.street_number}
                           onChange={onChangeHandler}
                           hasError={errors.includes('street_number')} errorText={'Pole wymagane'}/>
                    <Input id={'phone_number'} label={'Numer telefonu'} value={data.phone_number}
                           onChange={onChangeHandler}
                           hasError={errors.includes('phone_number')} errorText={'Nieprawidłowy numer telefonu'}/>
                </div>
                {isLoading ? <div className="centered-loader">
                    <Loader color={darkMode ? colors.yellow : colors.purple}/>
                </div> : <div className="buttons">
                    <Button text={'Anuluj'} onClick={onClose}/>
                    <Button text={'Zatwierdź'} type={'submit'} bgColor={colors.green} textColor={colors.white}/>
                </div>}
            </form>
        </div>
    </Modal>
}

export default AddClient;
