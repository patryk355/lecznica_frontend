import {useContext, useState} from "react";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import {useVaccinationStore} from "../../../store/vaccinationStore.js";
import {
    dateValidator,
    onlyDigitsValidator,
    stringRequiredValidator,
    stringValidator
} from "../../../utils/validators.js";
import axios from "../../../api/axios.js";
import {colors} from "../../../constants/colors.js";

const AddVaccination = ({appointment, onClose, currentRow}) => {
    const {darkMode} = useContext(AppContext);

    const {addVaccination, editVaccination} = useVaccinationStore(state => state);

    const initialData = {
        type: currentRow ? currentRow.type : '',
        serial_number: currentRow ? currentRow.serial_number : '',
        apply_date: currentRow ? new Date(currentRow.apply_date) : null,
        expiration_date: currentRow ? new Date(currentRow.expiration_date) : null,
        notes: currentRow ? currentRow.notes : '',
    }

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!appointment.id) {
            return;
        }
        setIsLoading(true);

        const _errors = [];

        const apply_date = dayjs(data.apply_date).format('YYYY-MM-DD');
        const expiration_date = dayjs(data.expiration_date).format('YYYY-MM-DD');

        if (!dateValidator(apply_date)) {
            _errors.push('apply_date');
        }

        if (!dateValidator(expiration_date)) {
            _errors.push('expiration_date');
        }

        if (!stringRequiredValidator(data.type)) {
            _errors.push('type');
        }

        if (!stringRequiredValidator(data.serial_number) || !onlyDigitsValidator(data.serial_number)) {
            _errors.push('serial_number');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        if (dayjs(data.apply_date).unix() > dayjs(data.expiration_date).unix()) {
            toast.info('Data podania nie może być późniejsza niż data wygaśnięcia');
            setIsLoading(false);
            return;
        }

        setErrors([]);

        const _data = {
            type: data.type.trim(),
            serial_number: data.serial_number,
            apply_date: apply_date,
            expiration_date: expiration_date,
            appointmentId: appointment.id,
        }

        if (data.notes && stringValidator(data.notes)) {
            _data.notes = data.notes.trim()
        }

        if (currentRow && currentRow.id) {
            delete _data.appointmentId;
            try {
                const result = await axios.put(`/vaccinations/${currentRow.id}`, _data);
                editVaccination(currentRow.id, result.data);
                console.debug('AddVaccination :: submitHandler', result);
                toast.success('Dane szczepionki zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddVaccination :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych szczepionki');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/vaccinations`, _data);
                console.debug('AddVaccination :: submitHandler', result);
                toast.success('Dane nowej szczepionki zostały dodane');
                addVaccination(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddVaccination :: submitHandler', err);
                toast.error('Nie udało się dodać danych nowej szczepionki');
            } finally {
                setIsLoading(false);
            }
        }
    }

    const onChangeHandler = (e) => {
        const {name, value} = e.target;

        setData(prev => ({
            ...prev, [name]: value
        }));
    }

    return <Modal onClose={onClose} width={500} disableOverlayOnClose={true}>
        <div className={"add-sickness"}>
            <h2>{currentRow ? 'Edytuj dane szczepionki' : 'Dodaj dane szczepionki'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input required={true} label={'Typ'} id={'type'} value={data.type}
                           onChange={onChangeHandler} hasError={errors.includes('type')} errorText={'Pole wymagane'}/>
                    <Input required={true} label={'Numer seryjny'} id={'serial_number'} value={data.serial_number}
                           onChange={onChangeHandler} hasError={errors.includes('serial_number')}
                           errorText={'Numer seryjny może się składać tylko z cyfr'}/>
                    <Input required={true} id={'apply_date'} type={'date'} label={'Data podania'}
                           value={data.apply_date}
                           onChange={date => setData(prev => ({
                               ...prev, apply_date: date,
                           }))}
                           hasError={errors.includes('apply_date')} errorText={'Niepoprawna data'}/>
                    <Input required={true} id={'expiration_date'} type={'date'} label={'Data wygaśnięcia'}
                           value={data.expiration_date}
                           onChange={date => setData(prev => ({
                               ...prev, expiration_date: date,
                           }))}
                           hasError={errors.includes('expiration_date')} errorText={'Niepoprawna data'}/>
                    <Input type={'textarea'} label={'Uwagi'} id={'notes'} value={data.notes}
                           onChange={onChangeHandler}/>
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

export default AddVaccination;
