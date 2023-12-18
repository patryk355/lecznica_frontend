import {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import {AppContext} from "../../../context/appContext.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Select from "../../../components/Select/Select.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import {useAppointmentStore} from "../../../store/appointmentStore.js";
import axios from "../../../api/axios.js";
import {colors} from "../../../constants/colors.js";

const types = [
    {value: 'konsultacja', label: 'konsultacja'},
    {value: 'szczepienie', label: 'szczepienie'},
    {value: 'zabieg', label: 'zabieg'},
];

const AddAppointment = ({patient, doctors, onClose, currentRow}) => {
    const {darkMode} = useContext(AppContext);

    const doctorOptions = doctors.map(d => ({value: d.id, label: d?.first_name + ' ' + d?.last_name}));
    const {addAppointment, editAppointment} = useAppointmentStore(state => state);

    const [date, setDate] = useState(currentRow ? new Date(currentRow.date) : new Date());
    const [notes, setNotes] = useState(currentRow ? currentRow.notes : '');
    const [type, setType] = useState(types[0]);
    const [doctor, setDoctor] = useState(doctorOptions[0]);
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!currentRow) return;
        if (currentRow.doctorId) {
            const _doctor = doctorOptions.find(d => d.value === currentRow.doctorId);
            if (_doctor) {
                setDoctor(_doctor);
            }
        }
        if (currentRow.type) {
            const _type = types.find(t => t.value === currentRow.type);
            if (_type) {
                setType(_type);
            }
        }

    }, [currentRow, types]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const _errors = [];

        if (!date) {
            _errors.push('date');
        }

        if (!type.value) {
            _errors.push('type');
        }

        if (!parseInt(doctor.value)) {
            _errors.push('doctor');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        const data = {
            date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
            type: type.value,
            notes: notes.trim(),
            doctorId: parseInt(doctor.value),
            patientId: patient.id,
        }

        if (currentRow && currentRow.id) {
            delete data.patientId;
            try {
                const result = await axios.put(`/appointments/${currentRow.id}`, data);
                editAppointment(currentRow.id, result.data);
                console.debug('AddAppointment :: submitHandler', result);
                toast.success('Dane wizyty zostały zaktualizowane');
                onClose && onClose();
            } catch (err) {
                console.error('AddAppointment :: submitHandler', err);
                toast.error('Nie udało się zaktualizować danych wizyty');
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const result = await axios.post(`/appointments`, data);
                console.debug('AddAppointment :: submitHandler', result);
                toast.success('Nowa wizyta została utworzona');
                addAppointment(result.data);
                onClose && onClose();
            } catch (err) {
                console.error('AddAppointment :: submitHandler', err);
                toast.error('Nie udało się dodać nowej wizyty');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return <Modal onClose={onClose} width={500} disableOverlayOnClose={true}>
        <div className={"add-appointment"}>
            <h2>{currentRow ? 'Edytuj wizytę' : 'Dodaj wizytę'}</h2>
            <form onSubmit={submitHandler}>
                <div>
                    <Input id={'date'} type={'datetime'} label={'Data'} value={date} onChange={date => setDate(date)}
                           hasError={errors.includes('date')} errorText={'Niepoprawna data'}/>
                    <Select id={'type'} value={type ? type : null} label={'Rodzaj'} options={types}
                            onChange={(e) => {
                                const _type = types.find(d => d.value === e.target.selectedOptions[0].value);
                                setType(_type);
                            }}
                            hasError={errors.includes('type')} errorText={'Pole wymagane'}/>
                    {doctorOptions && <Select id={'doctor'} label={'Lekarz'} value={doctor ? doctor : null}
                                              options={doctorOptions}
                                              onChange={(e) => {
                                                  const option = doctorOptions.find(d => d.value === parseInt(e.target.selectedOptions[0].value));
                                                  setDoctor(option);
                                              }} hasError={errors.includes('doctor')} errorText={'Pole wymagane'}/>}
                    <Input type={'textarea'} label={'Uwagi'} value={notes} onChange={(e) => setNotes(e.target.value)}/>
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

export default AddAppointment;
