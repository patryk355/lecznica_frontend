import {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AppContext} from '../../context/appContext';
import Loader from '../../components/Loader/Loader';
import {colors} from '../../constants/colors';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import AddIcon from '../../icons/AddIcon';
import Card from '../../components/Card/Card';
import {usePatientStore} from '../../store/patientStore';
import {useChartStore} from "../../store/chartStore.js";
import {useClientStore} from "../../store/clientStore.js";

import './Patients.scss';

const Patients = () => {
    const navigate = useNavigate();

    const {darkMode} = useContext(AppContext);

    const {patients} = usePatientStore((state) => state);
    const {charts} = useChartStore((state) => state);
    const {clients} = useClientStore((state) => state);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [fullData, setFullData] = useState(null);
    const [filter, setFilter] = useState('active');

    useEffect(() => {
        if (!charts || !patients || !clients) return;
        const _data = charts.map(chart => {
            const patient = patients.find(patient => patient.id === chart.patientId) || null;
            const client = clients.find(client => client.id === patient.clientId) || null;
            return {...chart, patient, client};
        });
        setFullData(_data);
    }, [charts, patients, clients]);

    useEffect(() => {
        if (!fullData) return;
        setIsLoading(true);
        let filteredData = [];
        if (searchValue) {
            filteredData = fullData.filter((chart) =>
                chart.number.toLowerCase().includes(searchValue.toLowerCase()) || chart.patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                chart.client.first_name.toLowerCase().includes(searchValue.toLowerCase()) || chart.client.last_name.toLowerCase().includes(searchValue.toLowerCase())
            );
        } else {
            filteredData = fullData;
        }

        if (filter === 'active') {
            filteredData = filteredData.filter(chart => chart.is_active);
        } else {
            filteredData = filteredData.filter(chart => !chart.is_active);
        }

        setData(filteredData);
        setIsLoading(false);
    }, [searchValue, fullData, filter]);

    return (
        <div id='patients'>
            <div className='actions'>
                <div className={`filter ${darkMode ? 'light' : 'dark'}`}>
                    <Button text='Aktywne' onClick={() => setFilter('active')}
                            className={filter === 'active' ? 'active' : null}/>
                    <Button text='Nieaktywne' onClick={() => setFilter('inactive')}
                            className={filter === 'inactive' ? 'active' : null}/>
                </div>
                <Input
                    placeholder='Wyszukaj kartę pacjenta...'
                    inputWidth='30rem'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                    text='Utwórz kartę pacjenta'
                    color={darkMode ? 'light' : 'dark'}
                    icon={<AddIcon/>}
                    bgColor={colors.green}
                    textColor={colors.white}
                />
            </div>

            {isLoading && (
                <div className='centered-loader'>
                    <Loader color={darkMode ? colors.yellow : colors.purple}/>
                </div>
            )}
            {!isLoading && data && data.length === 0 && (
                <p className='center'>Brak danych.</p>
            )}
            {!isLoading && data && data.length > 0 && (
                <div className='patients-container'>
                    {data.map((chart) => {
                        return (
                            <Card
                                key={chart.id}
                                bgColor={darkMode ? colors.lightPurple : colors.lightYellow}
                                className='patient'
                                onClick={() => {
                                    navigate(`/patients/${chart.patient.id}`)
                                }}
                            >
                                <dl>
                                    <dt>Numer karty:</dt>
                                    <dd
                                        style={{
                                            color: darkMode ? colors.yellow : colors.purple,
                                            fontSize: '1.6rem',
                                        }}
                                    >
                                        {chart?.number}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>Imię:</dt>
                                    <dd>{chart.patient?.name || '--'}</dd>
                                </dl>
                                <dl>
                                    <dt>Imię i nazwisko klienta:</dt>
                                    <dd>
                                        {chart.client && chart.client.first_name && chart.client.last_name
                                            ? chart.client.first_name + ' ' + chart.client.last_name
                                            : '--'}
                                    </dd>
                                </dl>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Patients;
