import {useContext, useState} from "react";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import axios from "../../../api/axios.js";
import {colors} from "../../../constants/colors.js";
import {dateValidator, stringRequiredValidator} from "../../../utils/validators.js";
import {useSicknessStore} from "../../../store/sicknessStore.js";

const AddSickness = ({patient, onClose, currentRow}) => {
    const {darkMode} = useContext(AppContext);

    const {addSickness, editSickness} = useSicknessStore(state => state);

    const initialData = {
        name: currentRow ? currentRow.name : '',
        notes: currentRow ? currentRow.notes : '',
        date: currentRow ? new Date(currentRow.date) : null
    }

    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!patient.id) {
            return;
        }
        setIsLoading(true);
        setErrors([]);

        const _errors = [];

        const date = dayjs(data.date).format('YYYY-MM-DD');

        if (!dateValidator(date)) {
            _errors.push('date');
        }

        if (!stringRequiredValidator(data.name)) {
            _errors.push('name');
        }

        if (!stringRequiredValidator(data.notes)) {
            _errors.push('notes');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        const _data = {
            name: data.name.trim(),
            notes: data.notes.trim(),
            date: date,
            patientId: patient.id,
        }

        if (currentRow && currentRow.id) {
            delete _data.patientId;
            try {
                const result = await axios.put(`/sicknesses/${currentRow.id}`, _data);
                editSickness(currentRow.id, result.data);
                console.debug('AddSickness :: submitHandler', result);
                toast.success('Dane choroby zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddSickness :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych choroby');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/sicknesses`, _data);
                console.debug('AddSickness :: submitHandler', result);
                toast.success('Dane nowej choroby została dodana');
                addSickness(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddSickness :: submitHandler', err);
                toast.error('Nie udało się dodać danych nowej choroby');
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
            <h2>{currentRow ? 'Edytuj dane choroby' : 'Dodaj dane wizyty'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input required={true} label={'Nazwa choroby'} id={'name'} value={data.name}
                           onChange={onChangeHandler} hasError={errors.includes('name')} errorText={'Pole wymagane'}/>
                    <Input required={true} id={'date'} type={'date'} label={'Data'} value={data.date}
                           onChange={date => setData(prev => ({
                               ...prev, date: date,
                           }))}
                           hasError={errors.includes('date')} errorText={'Niepoprawna data'}/>
                    <Input required={true} type={'textarea'} label={'Opis'} id={'notes'} value={data.notes}
                           onChange={onChangeHandler} hasError={errors.includes('notes')} errorText={'Pole wymagane'}/>
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

export default AddSickness;
