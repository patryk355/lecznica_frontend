import {useCallback, useContext, useEffect} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {AppContext} from './context/appContext';
import Login from './routes/Login/Login';
import ProtectedLayout from './routes/ProtectedLayout/ProtectedLayout';
import Patients from './routes/Patients/Patients';
import Patient from "./routes/Patients/parts/Patient.jsx";
import Clients from './routes/Clients/Clients';
import {usePatientStore} from './store/patientStore';
import {useAppointmentStore} from './store/appointmentStore';
import {useChartStore} from './store/chartStore';
import {useClientStore} from './store/clientStore';
import {useDoctorStore} from './store/doctorStore';
import {usePrescriptionStore} from "./store/prescriptionStore.js";
import {useTreatmentStore} from "./store/treatmentStore.js";
import {useVaccinationStore} from "./store/vaccinationStore.js";
import {useSicknessStore} from "./store/sicknessStore.js";
import {useUserStore} from "./store/userStore.js";
import axios from "./api/axios.js";

import "react-datepicker/dist/react-datepicker.css";
import 'dayjs/locale/pl';

const App = () => {
        const {isLogged} = useContext(AppContext);
        const {user} = useUserStore((state) => state);
        const {setPatients} = usePatientStore((state) => state);
        const {setAppointments} = useAppointmentStore((state) => state);
        const {setCharts} = useChartStore((state) => state);
        const {setClients} = useClientStore((state) => state);
        const {setDoctors} = useDoctorStore((state) => state);
        const {setPrescriptions} = usePrescriptionStore((state) => state);
        const {setTreatments} = useTreatmentStore((state) => state);
        const {setVaccinations} = useVaccinationStore((state) => state);
        const {setSicknesses} = useSicknessStore((state) => state);

        const fetchData = useCallback(async () => {
            const clientsResponse = await axios.get('/clients')
            const patientsResponse = await axios.get('/patients')
            const chartsResponse = await axios.get('/charts')
            const appointmentsResponse = await axios.get('/appointments')
            const doctorsResponse = await axios.get('/doctors')
            const sicknessesResponse = await axios.get('/sicknesses')
            const prescriptionsResponse = await axios.get('/prescriptions')
            const treatmentsResponse = await axios.get('/treatments')
            const vaccinationsResponse = await axios.get('/vaccinations')

            setClients(clientsResponse.data);
            setPatients(patientsResponse.data);
            setCharts(chartsResponse.data);
            setAppointments(appointmentsResponse.data)
            setDoctors(doctorsResponse.data);
            setSicknesses(sicknessesResponse.data);
            setPrescriptions(prescriptionsResponse.data);
            setTreatments(treatmentsResponse.data);
            setVaccinations(vaccinationsResponse.data);
        }, [setClients, setPatients, setCharts, setAppointments, setDoctors, setSicknesses, setPrescriptions, setTreatments, setVaccinations]);

        useEffect(() => {
            if (isLogged) {
                fetchData();
            }
        }, [isLogged, fetchData]);

        useEffect(() => {
            if (!user) return;
            if (isLogged) {
                document.title = `Lecznica dla zwierząt :: ${user.is_admin ? 'Recepcjonista' : 'Lekarz'}`
            } else {
                document.title = 'Lecznica dla zwierząt';
            }
        }, [isLogged, user]);

        return (
            <Routes>
                {isLogged && (
                    <Route path='/' element={<ProtectedLayout/>}>
                        <Route path='patients' index element={<Patients/>}/>
                        <Route path='patients/:patientId' index element={<Patient/>}/>
                        <Route path='clients' index element={<Clients/>}/>
                        <Route index element={<Navigate to='patients' replace/>}/>
                        <Route path='*' element={<Navigate to='patients' replace/>}/>
                    </Route>
                )}
                {!isLogged && <Route>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='*' element={<Navigate to='login' replace/>}/>
                </Route>}
            </Routes>
        );
    }
;

export default App;
