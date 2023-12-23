import {useContext, useState} from "react";
import AddAppointment from "./AddAppointment.jsx";
import dayjs from "dayjs";
import Button from "../../../components/Button/Button.jsx";
import EditIcon from "../../../icons/EditIcon.jsx";
import {useAppointmentStore} from "../../../store/appointmentStore.js";
import {useDoctorStore} from "../../../store/doctorStore.js";
import {colors} from "../../../constants/colors.js";
import {AppContext} from "../../../context/appContext.jsx";

const AppointmentDetails = ({currentRow, patient, doctors}) => {
    const {darkMode} = useContext(AppContext);

    const [editMode, setEditMode] = useState(false);

    const appointment = useAppointmentStore(state => state.appointments).find(a => a.id === currentRow.id);
    const doctor = useDoctorStore(state => state.doctors).find(d => d.id === appointment.doctorId);

    return <>
        {editMode && appointment &&
            <AddAppointment patient={patient} doctors={doctors} onClose={() => setEditMode(false)}
                            currentRow={appointment}/>}
        <div className={'appointment-details'}>
            <div>
                <p style={{color: darkMode ? colors.yellow : colors.purple, fontWeight: 500}}>{appointment?.type || ''}</p>
                <p>•</p>
                <p>{appointment.date ? dayjs(appointment.date).format('YYYY-MM-DD HH:mm') : '--'}</p>
                <p>•</p>
                <p>{doctor && doctor.first_name && doctor.last_name ? 'lek. ' + doctor.first_name + ' ' + doctor.last_name : '--'}</p>
            </div>
            <p>Uwagi:</p>
            <p>{appointment?.notes || 'Brak'}</p>
            <div style={{alignSelf: 'center'}}>
                <Button icon={<EditIcon/>} text={'Edytuj'} onClick={() => setEditMode(true)}/>
            </div>
        </div>
    </>
}

export default AppointmentDetails;
