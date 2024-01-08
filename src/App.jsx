import {useCallback, useContext, useEffect, lazy, Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {AppContext} from './context/appContext';
import Login from './routes/Login/Login';
import {CenteredLoader} from "./components/Loader/Loader.jsx";
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

const ProtectedLayout = lazy(() => import('./routes/ProtectedLayout/ProtectedLayout'));
const Patients = lazy(() => import('./routes/Patients/Patients'));
const Patient = lazy(() => import('./routes/Patients/parts/Patient.jsx'));
const Clients = lazy(() => import('./routes/Clients/Clients'));

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
            const chartsResponse = await axios.get('/charts')
            setCharts(chartsResponse.data);
            const patientsResponse = await axios.get('/patients')
            setPatients(patientsResponse.data);
            const clientsResponse = await axios.get('/clients')
            setClients(clientsResponse.data);
            const appointmentsResponse = await axios.get('/appointments')
            setAppointments(appointmentsResponse.data)
            const doctorsResponse = await axios.get('/doctors')
            setDoctors(doctorsResponse.data);
            const sicknessesResponse = await axios.get('/sicknesses')
            setSicknesses(sicknessesResponse.data);
            const prescriptionsResponse = await axios.get('/prescriptions')
            setPrescriptions(prescriptionsResponse.data);
            const treatmentsResponse = await axios.get('/treatments')
            setTreatments(treatmentsResponse.data);
            const vaccinationsResponse = await axios.get('/vaccinations')
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
                    <Route path='/' element={<Suspense fallback={<CenteredLoader/>}>
                        <ProtectedLayout/>
                    </Suspense>}>
                        <Route path='patients' index element={<Suspense fallback={<CenteredLoader/>}>
                            <Patients/>
                        </Suspense>}/>
                        <Route path='patients/:patientId' index element={<Suspense fallback={<CenteredLoader/>}>
                            <Patient/>
                        </Suspense>}/>
                        <Route path='clients' index element={<Suspense fallback={<CenteredLoader/>}>
                            <Clients/>
                        </Suspense>}/>
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
