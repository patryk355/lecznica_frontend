import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import EditIcon from "../../../icons/EditIcon.jsx";
import {AppContext} from "../../../context/appContext.jsx";
import {usePatientStore} from "../../../store/patientStore.js";
import {useClientStore} from "../../../store/clientStore.js";
import axios from "../../../api/axios.js";
import {dateValidator, numberValidator, phoneValidator, stringRequiredValidator} from "../../../utils/validators.js";
import {colors} from "../../../constants/colors.js";
import Select from "../../../components/Select/Select.jsx";

import './Details.scss';

const Details = ({patient, client}) => {
    const {darkMode} = useContext(AppContext);

    const {editPatient} = usePatientStore(state => state);
    const {editClient, clients} = useClientStore(state => state);

    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState([]);
    const [date, setDate] = useState(patient.birth_date ? new Date(patient.birth_date) : new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientOptions, setClientOptions] = useState(null);

    const [patientData, setPatientData] = useState({
        name: patient?.name,
        species: patient?.species || '',
        strain: patient?.strain || '',
        coloration: patient?.coloration || '',
        weight: patient.weight ? parseFloat(patient.weight) : 0,
        drugs: patient?.drugs || '',
        allergies: patient?.allergies || '',
    });

    const initialClientData = {
        first_name: client?.first_name || '',
        last_name: client?.last_name || '',
        phone_number: client?.phone_number || '',
        city: client?.city || '',
        postcode: client?.postcode || '',
        street: client?.street || '',
        street_number: client?.street_number || '',
    }

    const [clientData, setClientData] = useState(initialClientData);

    useEffect(() => {
        if (patient && patient.clientId && !clients) return;
        const options = clients.map(c => ({value: c.id, label: c?.first_name + ' ' + c?.last_name}));
        options.unshift({value: '', label: ''});
        setClientOptions(options);
    }, [patient, clients])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!editMode) return;
        setIsLoading(true);

        const _errors = [];

        !stringRequiredValidator(patientData.name) && _errors.push('name');
        !stringRequiredValidator(patientData.species) && _errors.push('species');
        !stringRequiredValidator(patientData.strain) && _errors.push('strain');
        !stringRequiredValidator(patientData.coloration) && _errors.push('coloration');
        (patientData.weight < 0) && _errors.push('weight');

        if (patient.clientId) {
            !stringRequiredValidator(clientData.first_name) && _errors.push('first_name');
            !stringRequiredValidator(clientData.last_name) && _errors.push('last_name');
            !stringRequiredValidator(clientData.city) && _errors.push('city');
            !stringRequiredValidator(clientData.postcode) && _errors.push('postcode');
            !stringRequiredValidator(clientData.street) && _errors.push('street');
            !stringRequiredValidator(clientData.street_number) && _errors.push('street_number');
            (!clientData.phone_number || !phoneValidator(clientData.phone_number)) && _errors.push('phone_number');
        }

        const birth_date = dayjs(date).format('YYYY-MM-DD');

        if (!dateValidator(birth_date)) {
            _errors.push('birth_date');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }
        setErrors([]);

        let isClientRequestError = false;
        let isPatientRequestError = false;

        if (patient.id) {
            try {
                const _data = {
                    ...patientData,
                    birth_date,
                    weight: parseFloat(patientData.weight)
                };
                if (!patient.clientId && selectedClient && numberValidator(selectedClient.value)) {
                    _data.clientId = selectedClient.value;
                }
                const result = await axios.put(`/patients/${patient.id}`, _data);
                editPatient(patient.id, result.data);
                if (result.data.clientId) {
                    const client = clients.find(c => c.id === result.data.clientId);
                    setClientData(client);
                }
                console.debug('Details :: submitHandler', result);
            } catch (err) {
                console.error('Details :: submitHandler', err);
                isPatientRequestError = true;
            }
        }

        if (patient.clientId && client.id) {
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
                    <dt>Imię</dt>
                    <dd>{patient?.name || '--'}</dd>
                </dl>
                <dl>
                    <dt>Gatunek</dt>
                    <dd>{patient?.species || '--'}</dd>
                </dl>
                <dl>
                    <dt>Rasa</dt>
                    <dd>{patient?.strain || '--'}</dd>
                </dl>
                <dl>
                    <dt>Umaszczenie</dt>
                    <dd>{patient?.coloration || '--'}</dd>
                </dl>
                <dl>
                    <dt>Data urodzenia</dt>
                    <dd>{patient.birth_date ? dayjs(patient.birth_date).format('YYYY-MM-DD') : '--'}</dd>
                </dl>
                <dl>
                    <dt>Waga</dt>
                    <dd>{patient?.weight || 0} kg</dd>
                </dl>
                <dl style={{alignItems: 'flex-start'}}>
                    <dt>Leki: <br/> <br/>{patient?.drugs || 'Brak'}</dt>
                </dl>
                <dl style={{alignItems: 'flex-start'}}>
                    <dt>Alergie: <br/> <br/> {patient?.allergies || 'Brak'}</dt>
                </dl>
            </div>}
        </div>
        <div className="client">
            <p>Klient</p>
            {editMode && patient.clientId && <div className="fields">
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

            {editMode && !patient.clientId && <div className="no-client-info">
                <p>
                    {clients && clients.length > 0 ? 'Wybierz klienta z listy lub utwórz nowego w zakładce ' : 'Utwórz klienta w zakładce '}
                    <Link style={{color: darkMode ? colors.yellow : colors.purple}} to={'/clients'}>Klienci</Link></p>
                {clients && clients.length > 0 &&
                    <Select id={'selectedClient'} value={selectedClient ? selectedClient : null}
                            options={clientOptions}
                            onChange={(e) => {
                                const _client = clientOptions.find(o => o.value === parseInt(e.target.selectedOptions[0].value));
                                setSelectedClient(_client);
                            }}
                    />}
            </div>}

            {!editMode && !patient.clientId && <div className="no-client-info">
                <p style={{color: colors.red}}>Pacjent nie ma przypisanego klienta (właściciela)</p>
            </div>}
            {!editMode && patient.clientId && <div className={`fields ${darkMode ? 'dark' : 'light'}`}>
                <dl>
                    <dt>Imię</dt>
                    <dd>{client?.first_name || '--'}</dd>
                </dl>
                <dl>
                    <dt>Nazwisko</dt>
                    <dd>{client?.last_name || '--'}</dd>
                </dl>
                <dl>
                    <dt>Miejscowość</dt>
                    <dd>{client?.city || '--'}</dd>
                </dl>
                <dl>
                    <dt>Kod pocztowy</dt>
                    <dd>{client?.postcode || '--'}</dd>
                </dl>
                <dl>
                    <dt>Ulica</dt>
                    <dd>{client?.street || '--'}</dd>
                </dl>
                <dl>
                    <dt>Numer domu</dt>
                    <dd>{client?.street_number || '--'}</dd>
                </dl>
                <dl>
                    <dt>Telefon</dt>
                    <dd>{client?.phone_number || '--'}</dd>
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
