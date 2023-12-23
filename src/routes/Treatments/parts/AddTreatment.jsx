import {useContext, useState} from "react";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import axios from "../../../api/axios.js";
import {useTreatmentStore} from "../../../store/treatmentStore.js";
import {
    dateTimeValidator,
    stringRequiredValidator,
    stringValidator
} from "../../../utils/validators.js";
import {colors} from "../../../constants/colors.js";

const AddTreatment = ({appointment, onClose, currentRow}) => {
    const {darkMode} = useContext(AppContext);

    const {addTreatment, editTreatment} = useTreatmentStore(state => state);

    const initialData = {
        type: currentRow ? currentRow.type : '',
        date: currentRow ? new Date(currentRow.date) : null,
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

        const date = dayjs(data.date).format('YYYY-MM-DD HH:mm');

        if (!dateTimeValidator(date)) {
            _errors.push('date');
        }

        if (!stringRequiredValidator(data.type)) {
            _errors.push('type');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        setErrors([]);

        const _data = {
            type: data.type.trim(),
            date: date,
            appointmentId: appointment.id,
        }

        if (data.notes && stringValidator(data.notes)) {
            _data.notes = data.notes.trim()
        }

        if (currentRow && currentRow.id) {
            delete _data.appointmentId;
            try {
                const result = await axios.put(`/treatments/${currentRow.id}`, _data);
                editTreatment(currentRow.id, result.data);
                console.debug('AddTreatment :: submitHandler', result);
                toast.success('Dane zabiegu zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddTreatment :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych zabiegu');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/treatments`, _data);
                console.debug('AddTreatment :: submitHandler', result);
                toast.success('Dane nowego zabiegu zostały dodane');
                addTreatment(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddTreatment :: submitHandler', err);
                toast.error('Nie udało się dodać danych nowego zabiegu');
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
            <h2>{currentRow ? 'Edytuj dane zabiegu' : 'Dodaj dane zabiegu'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input required={true} label={'Typ'} id={'type'} value={data.type}
                           onChange={onChangeHandler} hasError={errors.includes('type')} errorText={'Pole wymagane'}/>
                    <Input required={true} id={'date'} type={'datetime'} label={'Data'}
                           value={data.date}
                           onChange={date => setData(prev => ({
                               ...prev, date: date,
                           }))}
                           hasError={errors.includes('date')} errorText={'Niepoprawna data'}/>
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

export default AddTreatment;
