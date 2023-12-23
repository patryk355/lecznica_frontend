import {useState} from "react";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.jsx";
import {CenteredLoader} from "../../components/Loader/Loader.jsx";
import {useAppointmentStore} from "../../store/appointmentStore.js";
import {useDoctorStore} from "../../store/doctorStore.js";
import AddIcon from "../../icons/AddIcon.jsx";
import AddAppointment from "./parts/AddAppointment.jsx";
import Appointment from "./parts/Appointment.jsx";
import {colors} from "../../constants/colors.js";

import './Appointments.scss';

const Appointments = ({patient}) => {
    const {appointments: allAppointments} = useAppointmentStore(state => state);
    const {doctors} = useDoctorStore(state => state);

    const appointments = allAppointments
        .filter(a => a.patientId === patient.id)
        .sort((a, b) => {
            const aTs = dayjs(a.date).unix();
            const bTs = dayjs(b.date).unix();

            if (aTs < bTs) {
                return 1;
            } else if (aTs > bTs) {
                return -1;
            }
            return 0;
        });

    const [addMode, setAddMode] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    return <>
        {addMode && <AddAppointment patient={patient} doctors={doctors} currentRow={currentRow} onClose={() => {
            setAddMode(false);
            setCurrentRow(null);
        }}/>}
        {!currentRow && <div className="appointments">
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Data</th>
                        <th>Rodzaj</th>
                        <th>Lekarz</th>
                        <th>Uwagi</th>
                    </tr>
                    </thead>
                    <tbody>

                    {appointments && doctors && appointments.map(a => {
                        const doctor = doctors.find(d => d.id === a.doctorId);

                        return <tr key={a.id} onClick={() => setCurrentRow(a)}>
                            <td>{a.date ? dayjs(a.date).format('YYYY-MM-DD HH:mm') : '--'}</td>
                            <td>{a?.type || '--'}</td>
                            <td>{doctor && doctor.first_name && doctor.last_name ? doctor.first_name + ' ' + doctor.last_name : '--'}</td>
                            <td style={{overflowX: 'hidden'}}>{a?.notes.slice(0, 255) || 'Brak'}</td>
                        </tr>
                    })}
                    {appointments && appointments.length === 0 && <tr className={'no-data'}>
                        <td colSpan={4}>Brak danych.</td>
                    </tr>}
                    </tbody>
                </table>
                {!appointments && <CenteredLoader/>}
            </div>
            <div className="buttons">
                <Button text={'Dodaj'} onClick={() => setAddMode(true)} bgColor={colors.green} textColor={colors.white}
                        icon={<AddIcon/>}/>
            </div>
        </div>}
        {currentRow && <Appointment patient={patient} doctors={doctors} appointment={currentRow}
                                    onClose={() => setCurrentRow(null)}/>}
    </>
}

export default Appointments;
