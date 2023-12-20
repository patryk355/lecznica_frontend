import {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import Input from "../../../components/Input/Input.jsx";
import Select from "../../../components/Select/Select.jsx";
import {AppContext} from "../../../context/appContext.jsx";
import {useClientStore} from "../../../store/clientStore.js";
import {usePatientStore} from "../../../store/patientStore.js";
import {useChartStore} from "../../../store/chartStore.js";
import {colors} from "../../../constants/colors.js";
import {dateValidator, phoneValidator, stringRequiredValidator} from "../../../utils/validators.js";
import axios from "../../../api/axios.js";

import './AddPatient.scss';

const AddPatient = ({onClose}) => {
    const {darkMode} = useContext(AppContext);

    const {clients, addClient, removeClient} = useClientStore(state => state);
    const {addPatient} = usePatientStore(state => state);
    const {addChart} = useChartStore(state => state);

    const [chartNumber, setChartNumber] = useState('');
    const [patientData, setPatientData] = useState({
        name: '',
        species: '',
        strain: '',
        coloration: '',
        birth_date: null,
        weight: 1,
        drugs: '',
        allergies: '',
    });
    const [clientData, setClientData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        city: '',
        postcode: '',
        street: '',
        street_number: '',
    });
    const [errors, setErrors] = useState([]);
    const [clientOptions, setClientOptions] = useState();
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!clients) return;
        const options = clients.map(c => ({value: c.id, label: c?.first_name + ' ' + c?.last_name}));
        options.unshift({value: 0, label: 'Nowy klient'});
        setClientOptions(options);
        setClient({value: 0, label: 'Nowy klient'});
    }, [clients]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        const _errors = [];

        const birth_date = dayjs(patientData.birth_date).format('YYYY-MM-DD');

        !stringRequiredValidator(patientData.name) && _errors.push('name');
        !stringRequiredValidator(patientData.species) && _errors.push('species');
        !stringRequiredValidator(patientData.strain) && _errors.push('strain');
        !stringRequiredValidator(patientData.coloration) && _errors.push('coloration');
        !dateValidator(birth_date) && _errors.push('birth_date');
        parseFloat(patientData.weight < 0) && _errors.push('weight');

        !stringRequiredValidator(chartNumber) && _errors.push('chartNumber');

        if (client && client.value === 0) {
            !stringRequiredValidator(clientData.first_name) && _errors.push('first_name');
            !stringRequiredValidator(clientData.last_name) && _errors.push('last_name');
            !stringRequiredValidator(clientData.city) && _errors.push('city');
            !stringRequiredValidator(clientData.postcode) && _errors.push('postcode');
            !stringRequiredValidator(clientData.street) && _errors.push('street');
            !stringRequiredValidator(clientData.street_number) && _errors.push('street_number');
            (!clientData.phone_number || !phoneValidator(clientData.phone_number)) && _errors.push('phone_number');
        }

        if (_errors.length > 0) {
            setErrors(_errors);
            setIsLoading(false);
            return;
        }

        let isClientRequestOk = true;
        let isPatientRequestOk = false;

        let clientId;
        if (client && client.value === 0) {
            try {
                const result = await axios.post('/clients', clientData);
                addClient(result.data);
                clientId = result.data.id;
            } catch (error) {
                console.error('AddPatient :: submitHandler', error);
                isClientRequestOk = false;
            }
        } else {
            clientId = client.value;
        }

        let patientId;
        if (isClientRequestOk) {
            try {
                const _data = {...patientData};
                _data.birth_date = birth_date;
                _data.clientId = parseInt(clientId);
                _data.weight = parseFloat(patientData.weight)
                const result = await axios.post('/patients', _data);
                addPatient(result.data);
                isPatientRequestOk = true;
                patientId = result.data.id;
            } catch (error) {
                console.error('AddPatient :: submitHandler', error);
                isPatientRequestOk = false;
            }
        }

        if (isClientRequestOk && isPatientRequestOk && patientId && clientId) {
            try {
                const result = await axios.post('/charts', {
                    number: chartNumber.trim(),
                    patientId: patientId,
                    clientId: clientId
                });

                addChart(result.data);

                toast.success('Karta pacjenta została utworzona');
            } catch (error) {
                console.error('AddPatient :: submitHandler', error);
                toast.error('Karta pacjenta nie została utworzona. Spróbuj ponownie')
            }
            onClose();
        } else if (isClientRequestOk && !isPatientRequestOk && client.value === 0) {
            toast.error('Karta pacjenta nie została utworzona. Spróbuj ponownie')
            try {
                await axios.delete(`/clients/${clientId}`);
                removeClient(clientId);
            } catch (error) {
                console.error('AddPatient :: submitHandler', error);
            }
        }

        setIsLoading(false);
    }

    const onChangePatientDataHandler = (e) => {
        const {name, value} = e.target;
        setPatientData(prev => ({...prev, [name]: value}));
    }

    const onChangeClientDataHandler = (e) => {
        const {name, value} = e.target;
        setClientData(prev => ({...prev, [name]: value}));
    }


    return <Modal onClose={onClose} disableOverlayOnClose={true} width={800}>
        <div id="add-client">
            <h2>Utwórz kartę pacjenta</h2>
            <form onSubmit={submitHandler}>
                <h3 style={{color: darkMode ? colors.yellow : colors.purple}}>Numer karty pacjenta</h3>
                <div className="chart-number">
                    <Input id={'chartNumber'} value={chartNumber}
                           onChange={(e) => setChartNumber(e.target.value)}
                           hasError={errors.includes('chartNumber')}
                           errorText={'Pole wymagane'}/>
                </div>
                <h3 style={{color: darkMode ? colors.yellow : colors.purple}}>Pacjent</h3>
                <div className="patient">
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
                    <Input type={'date'} required label={'Data urodzenia'} value={patientData.birth_date}
                           onChange={(date) => setPatientData(prev => ({
                               ...prev, birth_date: date
                           }))} hasError={errors.includes('birth_date')}
                           errorText={'Niepoprawna data'}/>
                    <Input required id={'weight'} label={'Waga (kg)'} type={'number'} value={patientData.weight}
                           onChange={onChangePatientDataHandler} hasError={errors.includes('weight')}
                           errorText={'Niepoprawna wartość'} min={0} step={0.5}/>
                    <Input type={'textarea'} id={'drugs'} label={'Leki'} value={patientData.drugs}
                           onChange={onChangePatientDataHandler}/>
                    <Input type={'textarea'} id={'allergies'} label={'Alergie'} value={patientData.allergies}
                           onChange={onChangePatientDataHandler}/>
                </div>

                <h3 style={{color: darkMode ? colors.yellow : colors.purple}}>Klient</h3>
                {clientOptions && <Select id={'selectedClient'} value={client ? client : null}
                                          options={clientOptions}
                                          onChange={(e) => {
                                              const _client = clientOptions.find(o => o.value === parseInt(e.target.selectedOptions[0].value));
                                              setClient(_client);
                                          }}
                />}
                <div className="client">
                    {client && client.value === 0 && <>
                        <Input required id={'first_name'} name={'first_name'} label={'Imię'}
                               value={clientData.first_name}
                               onChange={onChangeClientDataHandler} hasError={errors.includes('first_name')}
                               errorText={'Pole wymagane'}/>
                        <Input required id={'last_name'} name={'last_name'} label={'Nazwisko'}
                               value={clientData.last_name}
                               onChange={onChangeClientDataHandler} hasError={errors.includes('last_name')}
                               errorText={'Pole wymagane'}/>
                        <Input required id={'phone_number'} label={'Numer telefonu'} value={clientData.phone_number}
                               onChange={onChangeClientDataHandler} hasError={errors.includes('phone_number')}
                               errorText={'Wymagany format: +XXYYYYYYYYY'}/>
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
                    </>}
                </div>

                <div className="actions">
                    {!isLoading ? <>
                            <Button text={'Anuluj'} onClick={onClose}/>
                            <Button text={'Zatwierdź'} type={'submit'} onClick={submitHandler} textColor={colors.white}
                                    bgColor={colors.green}/>
                        </> :
                        <Loader color={darkMode ? colors.yellow : colors.purple}/>
                    }
                </div>
            </form>
        </div>
    </Modal>
}

export default AddPatient;
