import {useContext, useState} from "react";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import EditIcon from "../../../icons/EditIcon.jsx";
import {AppContext} from "../../../context/appContext.jsx";
import {usePatientStore} from "../../../store/patientStore.js";
import {useClientStore} from "../../../store/clientStore.js";
import axios from "../../../api/axios.js";
import {phoneValidator} from "../../../utils/validator.js";
import {colors} from "../../../constants/colors.js";

import './Details.scss';

const Details = ({patient, client}) => {
    const {darkMode} = useContext(AppContext);

    const {editPatient} = usePatientStore(state => state);
    const {editClient} = useClientStore(state => state);

    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState([]);
    const [date, setDate] = useState(patient.birth_date ? new Date(patient.birth_date) : new Date());
    const [isLoading, setIsLoading] = useState(false);

    const [patientData, setPatientData] = useState({
        name: patient?.name,
        species: patient?.species || '',
        strain: patient?.strain || '',
        coloration: patient?.coloration || '',
        weight: patient.weight ? parseFloat(patient.weight) : 0,
        drugs: patient?.drugs || '',
        allergies: patient?.allergies || '',
    });

    const [clientData, setClientData] = useState({
        first_name: client?.first_name || '',
        last_name: client?.last_name || '',
        phone_number: client?.phone_number || '',
        city: client?.city || '',
        postcode: client?.postcode || '',
        street: client?.street || '',
        street_number: client?.street_number || '',
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!editMode) return;
        setIsLoading(true);

        const _errors = [];

        patientData.name.length === 0 && _errors.push('name');
        patientData.species.length === 0 && _errors.push('species');
        patientData.strain.length === 0 && _errors.push('strain');
        patientData.coloration.length === 0 && _errors.push('coloration');
        patientData.weight < 0 && _errors.push('weight');

        clientData.first_name.length === 0 && _errors.push('first_name');
        clientData.last_name.length === 0 && _errors.push('last_name');
        clientData.city.length === 0 && _errors.push('city');
        clientData.postcode.length === 0 && _errors.push('postcode');
        clientData.street.length === 0 && _errors.push('street');
        clientData.street_number.length === 0 && _errors.push('street_number');
        (!clientData.phone_number || !phoneValidator(clientData.phone_number)) && _errors.push('phone_number');

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }
        setErrors([]);

        let isClientRequestError = false;
        let isPatientRequestError = false;

        const birth_date = dayjs(date).format('YYYY-MM-DD');

        if (patient.id) {
            try {
                const result = await axios.put(`/patients/${patient.id}`, {
                    ...patientData,
                    birth_date,
                    weight: parseFloat(patientData.weight)
                });
                editPatient(patient.id, {...patientData, birth_date});
                console.debug('Details :: submitHandler', result);
            } catch (err) {
                console.error('Details :: submitHandler', err);
                isPatientRequestError = true;
            }
        }

        if (client.id) {
            try {
                const result = await axios.put(`/clients/${client.id}`, clientData);
                editClient(client.id, result.data);
                console.debug('Details :: submitHandler', result);
            } catch (err) {
                console.error('Details :: submitHandler', err);
                isClientRequestError = true;
            }
        }

        if (isClientRequestError) {
            toast.error('Nie udało się zaktualizować danych klienta');
        }

        if (isPatientRequestError) {
            toast.error('Nie udało się zaktualizować danych pacjenta');
        }

        if (!isPatientRequestError && !isPatientRequestError) {
            toast.success('Dane zostały zaktualizowane');
        } else if (isPatientRequestError && !isClientRequestError) {
            toast.success('Dane klienta zostały zaktualizowane');
        } else if (!isPatientRequestError && isClientRequestError) {
            toast.success('Dane pacjenta zostały zaktualizowane');
        }

        setIsLoading(false);
        setEditMode(false);
    }

    const onChangePatientDataHandler = (e) => {
        const {name, value} = e.target;
        setPatientData(prev => ({...prev, [name]: value}));
    }

    const onChangeClientDataHandler = (e) => {
        const {name, value} = e.target;
        setClientData(prev => ({...prev, [name]: value}));
    }

    return <form className="details">
        <div className="patient">
            <p>Pacjent</p>
            {editMode && <div className="fields">
                <Input required id={'name'} label={'Imię'} value={patientData.name}
                       onChange={onChangePatientDataHandler}
                       hasError={errors.includes('name')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'species'} label={'Gatunek'} value={patientData.species}
                       onChange={onChangePatientDataHandler} hasError={errors.includes('species')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'strain'} label={'Rasa'} value={patientData.strain}
                       onChange={onChangePatientDataHandler}
                       hasError={errors.includes('strain')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'coloration'} label={'Umaszczenie'} value={patientData.coloration}
                       onChange={onChangePatientDataHandler} hasError={errors.includes('coloration')}
                       errorText={'Pole wymagane'}/>
                <Input type={'date'} required label={'Data urodzenia'} value={date}
                       onChange={(date) => setDate(date)} hasError={errors.includes('birth_date')}
                       errorText={'Niepoprawna data'}/>
                <Input required id={'weight'} label={'Waga (kg)'} type={'number'} value={patientData.weight}
                       onChange={onChangePatientDataHandler} hasError={errors.includes('weight')}
                       errorText={'Niepoprawna wartość'} min={0} step={0.5}/>
                <Input type={'textarea'} id={'drugs'} label={'Leki'} value={patientData.drugs}
                       onChange={onChangePatientDataHandler}/>
                <Input type={'textarea'} id={'allergies'} label={'Alergie'} value={patientData.allergies}
                       onChange={onChangePatientDataHandler}/>
            </div>}
            {!editMode && <div className={`fields ${darkMode ? 'dark' : 'light'}`}>
                <dl>
                    <dd>Imię</dd>
                    <dt>{patient?.name || '--'}</dt>
                </dl>
                <dl>
                    <dd>Gatunek</dd>
                    <dt>{patient?.species || '--'}</dt>
                </dl>
                <dl>
                    <dd>Rasa</dd>
                    <dt>{patient?.strain || '--'}</dt>
                </dl>
                <dl>
                    <dd>Umaszczenie</dd>
                    <dt>{patient?.coloration || '--'}</dt>
                </dl>
                <dl>
                    <dd>Data urodzenia</dd>
                    <dt>{patient.birth_date ? dayjs(patient.birth_date).format('YYYY-MM-DD') : '--'}</dt>
                </dl>
                <dl>
                    <dd>Waga</dd>
                    <dt>{patient?.weight || 0} kg</dt>
                </dl>
                <dl style={{alignItems: 'flex-start'}}>
                    <dd>Leki: <br/> <br/>{patient?.drugs || 'Brak'}</dd>
                </dl>
                <dl style={{alignItems: 'flex-start'}}>
                    <dd>Alergie: <br/> <br/> {patient?.allergies || 'Brak'}</dd>
                </dl>
            </div>}
        </div>
        <div className="client">
            <p>Klient</p>
            {editMode && <div className="fields">
                <Input required id={'first_name'} name={'first_name'} label={'Imię'} value={clientData.first_name}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('first_name')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'last_name'} name={'last_name'} label={'Nazwisko'} value={clientData.last_name}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('last_name')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'city'} label={'Miejscowość'} value={clientData.city}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('city')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'postcode'} label={'Kod pocztowy'} value={clientData.postcode}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('postcode')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'street'} label={'Ulica'} value={clientData.street}
                       onChange={onChangeClientDataHandler}
                       hasError={errors.includes('street')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'street_number'} label={'Numer domu'} value={clientData.street_number}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('street_number')}
                       errorText={'Pole wymagane'}/>
                <Input required id={'phone_number'} label={'Numer telefonu'} value={clientData.phone_number}
                       onChange={onChangeClientDataHandler} hasError={errors.includes('phone_number')}
                       errorText={'Wymagany format: +XXYYYYYYYYY'}/>
            </div>}

            {!editMode && <div className={`fields ${darkMode ? 'dark' : 'light'}`}>
                <dl>
                    <dd>Imię</dd>
                    <dt>{client?.first_name || '--'}</dt>
                </dl>
                <dl>
                    <dd>Nazwisko</dd>
                    <dt>{client?.last_name || '--'}</dt>
                </dl>
                <dl>
                    <dd>Miejscowość</dd>
                    <dt>{client?.city || '--'}</dt>
                </dl>
                <dl>
                    <dd>Kod pocztowy</dd>
                    <dt>{client?.postcode || '--'}</dt>
                </dl>
                <dl>
                    <dd>Ulica</dd>
                    <dt>{client?.street || '--'}</dt>
                </dl>
                <dl>
                    <dd>Numer domu</dd>
                    <dt>{client?.street_number || '--'}</dt>
                </dl>
                <dl>
                    <dd>Telefon</dd>
                    <dt>{client?.phone_number || '--'}</dt>
                </dl>
            </div>}
        </div>
        {!isLoading && <div className={'edit-btn'}>
            {!editMode && <Button text={'Edytuj'} icon={<EditIcon/>} onClick={() => setEditMode(true)}/>}
            {editMode && <>
                <Button text={'Anuluj'} onClick={() => setEditMode(false)}/>
                <Button type={'submit'} onClick={submitHandler} text={'Zatwierdź'} textColor={colors.white}
                        bgColor={colors.green}
                        icon={<EditIcon/>}/>
            </>}
        </div>}
        {isLoading && <div style={{margin: 'auto', gridColumn: '1 / 3'}}>
            <Loader color={darkMode ? colors.yellow : colors.purple}/>
        </div>}
    </form>
}

export default Details;
