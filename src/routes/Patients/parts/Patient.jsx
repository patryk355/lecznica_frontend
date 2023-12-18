import {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {AppContext} from '../../../context/appContext';
import {usePatientStore} from "../../../store/patientStore.js";
import {useChartStore} from "../../../store/chartStore.js";
import {useClientStore} from "../../../store/clientStore.js";
import axios from "../../../api/axios.js";
import Details from "./Details.jsx";
import Appointments from "../../Appointments/Appointments.jsx";
import Sicknesses from "./Sicknesses.jsx";
import Treatments from "./Treatments.jsx";
import Vaccinations from "./Vaccinations.jsx";
import Prescriptions from "./Prescriptions.jsx";
import Button from "../../../components/Button/Button.jsx";
import Modal from "../../../components/Modal/Modal.jsx";
import ArchiveIcon from "../../../icons/ArchiveIcon.jsx";
import DocumentCheckIcon from "../../../icons/DocumentCheckIcon.jsx";
import {colors} from '../../../constants/colors';

const Patient = () => {
    const {patientId} = useParams();
    const {darkMode} = useContext(AppContext);

    const patient = usePatientStore(state => state.patients).find(p => p.id === parseInt(patientId));
    const chart = useChartStore(state => state.charts).find(c => c.patientId === parseInt(patientId));
    const {editChart} = useChartStore(state => state);
    const client = useClientStore(state => state.clients).find(c => c.id === patient.clientId);

    const [currentTab, setCurrentTab] = useState(0);
    const [showConfirmArchiveModal, setShowConfirmArchiveModal] = useState(false);

    const updateChart = async () => {
        if (!chart.id) return;
        try {
            const result = await axios.put(`/charts/${chart.id}`, {is_active: !chart.is_active});
            console.debug('Patient :: updateChart', result);
            editChart(chart.id, result.data);
        } catch (err) {
            console.error('Patient :: updateChart', err);
            toast.error(chart.is_active ? 'Nie udało się zarchiwizować karty pacjenta' : 'Nie udało się aktywować karty pacjenta');
        } finally {
            setShowConfirmArchiveModal(false);
        }
    }

    return (
        <>
            {showConfirmArchiveModal && <Modal onClose={() => setShowConfirmArchiveModal(false)} width={300}>
                <div className={'archive-chart-modal'}>
                    <h2>{chart.is_active ? 'Potwierdź archiwizację' : 'Potwierdź aktywację'}</h2>
                    <div>
                        <Button text={'Anuluj'} onClick={() => setShowConfirmArchiveModal(false)}/>
                        <Button text={'Potwierdź'} onClick={updateChart} textColor={colors.white}
                                bgColor={chart.is_active ? colors.red : colors.green}/>
                    </div>
                </div>
            </Modal>}
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '2rem', justifyContent: 'space-between'}}>
                <h2 style={{textAlign: 'center'}}>Numer karty pacjenta: {chart?.number}</h2>
                <Button onClick={() => setShowConfirmArchiveModal(true)}
                        text={chart.is_active ? 'Archiwizuj' : 'Aktywuj'} textColor={colors.white}
                        bgColor={chart.is_active ? colors.red : colors.green}
                        icon={chart.is_active ? <ArchiveIcon/> : <DocumentCheckIcon/>}/>
            </div>
            <div className={`patient-container ${darkMode ? 'dark' : 'light'}`}
                 style={{backgroundColor: darkMode ? colors.lightPurple : colors.lightYellow}}>
                <ul className="actions">
                    <li className={currentTab === 0 ? "active" : ''} onClick={() => setCurrentTab(0)}>Dane</li>
                    <li className={currentTab === 1 ? "active" : ''} onClick={() => setCurrentTab(1)}>Historia
                        wizyt
                    </li>
                    <li className={currentTab === 2 ? "active" : ''} onClick={() => setCurrentTab(2)}>Historia
                        chorób
                    </li>
                </ul>
                <div className="content">
                    {currentTab === 0 && <Details patient={patient} client={client}/>}
                    {currentTab === 1 && <Appointments patient={patient}/>}
                    {currentTab === 2 && <Sicknesses/>}
                </div>
            </div>
        </>
    );
};

export default Patient;
