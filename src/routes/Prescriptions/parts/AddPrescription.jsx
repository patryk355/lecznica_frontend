import {useContext, useState} from "react";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import {usePrescriptionStore} from "../../../store/prescriptionStore.js";
import {
    dateValidator,
    numberValidator, onlyDigitsValidator,
    stringRequiredValidator,
} from "../../../utils/validators.js";
import axios from "../../../api/axios.js";
import {colors} from "../../../constants/colors.js";

const AddPrescription = ({appointment, onClose, currentRow}) => {
    const {darkMode} = useContext(AppContext);

    const {addPrescription, editPrescription} = usePrescriptionStore(state => state);

    const initialData = {
        number: currentRow ? currentRow.number : '',
        date: currentRow ? new Date(currentRow.date) : null,
        drug_name: currentRow ? currentRow.drug_name : '',
        dose: currentRow ? currentRow.dose : 0,
        packages_amount: currentRow ? currentRow.packages_amount : 1,
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

        const _data = {
            number: data.number.trim(),
            date: dayjs(data.date).format('YYYY-MM-DD'),
            drug_name: data.drug_name.trim(),
            dose: parseFloat(data.dose),
            packages_amount: parseInt(data.packages_amount),
            appointmentId: appointment.id,
        }

        if (!dateValidator(_data.date)) {
            _errors.push('date');
        }

        if (!stringRequiredValidator(_data.drug_name)) {
            _errors.push('drug_name');
        }

        if (!stringRequiredValidator(_data.number) || !onlyDigitsValidator(_data.number)) {
            _errors.push('number');
        }

        if (!numberValidator(_data.dose) || _data.dose <= 0) {
            _errors.push('dose');
        }

        if (!numberValidator(_data.packages_amount) || _data.packages_amount <= 0) {
            _errors.push('packages_amount');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        setErrors([]);

        if (currentRow && currentRow.id) {
            delete _data.appointmentId;
            try {
                const result = await axios.put(`/prescriptions/${currentRow.id}`, _data);
                editPrescription(currentRow.id, result.data);
                console.debug('AddPrescription :: submitHandler', result);
                toast.success('Dane recepty zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddPrescription :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych recepty');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/prescriptions`, _data);
                console.debug('AddPrescription :: submitHandler', result);
                toast.success('Dane recepty zostały dodane');
                addPrescription(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddPrescription :: submitHandler', err);
                toast.error('Nie udało się dodać danych recepty');
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
            <h2>{currentRow ? 'Edytuj dane recepty' : 'Dodaj dane recepty'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input required={true} label={'Numer'} id={'number'} value={data.number}
                           onChange={onChangeHandler} hasError={errors.includes('number')} errorText={'Numer recepty może się składać tylko z cyfr'}/>
                    <Input required={true} id={'date'} type={'date'} label={'Data'}
                           value={data.date}
                           onChange={date => setData(prev => ({
                               ...prev, date: date,
                           }))}
                           hasError={errors.includes('date')} errorText={'Niepoprawna data'}/>
                    <Input required={true} label={'Nazwa leku'} id={'drug_name'} value={data.drug_name}
                           onChange={onChangeHandler} hasError={errors.includes('drug_name')} errorText={'Pole wymagane'}/>
                    <Input required={true} label={'Dawka (mg)'} type={'number'} min={0} step={0.05} id={'dose'} value={data.dose}
                           onChange={onChangeHandler} hasError={errors.includes('dose')} errorText={'Nieprawidłowa wartość'}/>
                    <Input required={true} label={'Ilość'} type={'number'} min={1} step={1} id={'packages_amount'} value={data.packages_amount}
                           onChange={onChangeHandler} hasError={errors.includes('packages_amount')} errorText={'Nieprawidłowa ilość'}/>

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

export default AddPrescription;
