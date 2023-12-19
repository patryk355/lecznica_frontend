import {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AppContext} from '../../context/appContext';
import Loader from '../../components/Loader/Loader';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import AddIcon from '../../icons/AddIcon';
import {useClientStore} from "../../store/clientStore.js";
import {colors} from '../../constants/colors';

import './Clients.scss';
import UserIcon from "../../icons/UserIcon.jsx";
import EditIcon from "../../icons/EditIcon.jsx";
import DeleteIcon from "../../icons/DeleteIcon.jsx";
import DeleteClient from "./parts/DeleteClient.jsx";
import AddClient from "./parts/AddClient.jsx";

const Clients = () => {
    const {darkMode} = useContext(AppContext);

    const {clients} = useClientStore((state) => state);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [addMode, setAddMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

    useEffect(() => {
        if (!clients) return;
        setIsLoading(true);
        let filteredData = [];
        if (searchValue) {
            filteredData = clients.filter((client) =>
                client.first_name.toLowerCase().includes(searchValue.toLowerCase()) || client.last_name.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.phone_number.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.city.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.postcode.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.street.toLowerCase().includes(searchValue.toLowerCase()) ||
                client.street_number.toLowerCase().includes(searchValue.toLowerCase())
            );
        } else {
            filteredData = clients;
        }

        setData(filteredData);
        setIsLoading(false);
    }, [searchValue, clients]);

    return <>
        <div id='clients'>
            <div className='actions'>
                <Input
                    placeholder='Wyszukaj klienta...'
                    inputWidth='30rem'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                    text='Dodaj klienta'
                    color={darkMode ? 'light' : 'dark'}
                    icon={<AddIcon/>}
                    bgColor={colors.green}
                    textColor={colors.white}
                    onClick={() => setAddMode(true)}
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
                <div className='clients-container'>
                    {data.map((client) => {
                        return (
                            <Card
                                key={client.id}
                                bgColor={darkMode ? colors.lightPurple : colors.lightYellow}
                                className='client'
                            >
                                <div className="content">
                                    <span>
                                        <UserIcon/>
                                    </span>
                                    <div className="client-data">
                                        <dl>
                                            <dt>Imię i nazwisko:</dt>
                                            <dd
                                                style={{
                                                    color: darkMode ? colors.yellow : colors.purple,
                                                    fontSize: '1.6rem',
                                                }}
                                            >
                                                {`${client?.first_name || ''} ${client?.last_name || ''}`}
                                            </dd>
                                        </dl>
                                        <dl>
                                            <dt>Numer telefonu:</dt>
                                            <dd>
                                                {client.phone_number ?
                                                    <a href={`tel:${client.phone_number}`}>{client.phone_number}</a>
                                                    :
                                                    '--'
                                                }
                                            </dd>
                                        </dl>
                                        <dl>
                                            <dt>Adres:</dt>
                                            <dd>
                                                {`${client?.city || ''} ${client?.postcode || ''}, ${client?.street || ''} ${client?.street_number || ''}`}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="actions">
                                    <Button
                                        onClick={() => {
                                            setEditMode(true);
                                            setSelectedClient(client);
                                        }}
                                        bgColor={darkMode ? colors.yellow : colors.white}
                                        text={'Edytuj'}
                                        icon={<EditIcon/>}
                                    />
                                    <Button
                                        onClick={() => {
                                            setDeleteMode(true);
                                            setSelectedClient(client);
                                        }}
                                        bgColor={colors.red}
                                        textColor={colors.white}
                                        text={'Usuń'}
                                        icon={<DeleteIcon/>}
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
        {deleteMode && selectedClient !== null && <DeleteClient
            clientId={selectedClient.id}
            onClose={() => {
                setSelectedClient(null);
                setDeleteMode(false);
            }}
        />}
        {addMode && selectedClient === null && <AddClient onClose={() => setAddMode(false)}/>}
        {editMode && selectedClient !== null && <AddClient onClose={() => {
            setSelectedClient(null);
            setEditMode(false);
        }} client={selectedClient}/>}
    </>
};

export default Clients;
