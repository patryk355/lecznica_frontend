import {colors} from "../../../constants/colors.js";
import {useContext, useState} from "react";
import {AppContext} from "../../../context/appContext.jsx";
import Treatments from "../../Treatments/Treatments.jsx";
import Vaccinations from "../../Vaccinations/Vaccinations.jsx";
import Prescriptions from "../../Prescriptions/Prescriptions.jsx";
import AppointmentDetails from "./AppointmentDetails.jsx";
import BackIcon from "../../../icons/BackIcon.jsx";

const Appointment = ({appointment, onClose, patient, doctors}) => {
    const {darkMode} = useContext(AppContext);

    const [currentTab, setCurrentTab] = useState(0);

    return <div className={`appointment-container ${darkMode ? 'dark' : 'light'}`}
                style={{backgroundColor: darkMode ? colors.lightPurple : colors.lightYellow}}>
        <ul className="actions">
            <li onClick={onClose} className={'back-icon'} title={'Powrót'}>
                <BackIcon/>
            </li>
            <li className={currentTab === 0 ? "active" : ''} onClick={() => setCurrentTab(0)}>
                Dane wizyty
            </li>
            <li className={currentTab === 1 ? "active" : ''} onClick={() => setCurrentTab(1)}>
                Zabiegi
            </li>
            <li className={currentTab === 2 ? "active" : ''} onClick={() => setCurrentTab(2)}>
                Szczepienia
            </li>
            <li className={currentTab === 3 ? "active" : ''} onClick={() => setCurrentTab(3)}>
                Recepty
            </li>
        </ul>
        <div className="content">
            {currentTab === 0 && <AppointmentDetails currentRow={appointment} patient={patient} doctors={doctors}/>}
            {currentTab === 1 && <Treatments appointment={appointment}/>}
            {currentTab === 2 && <Vaccinations appointment={appointment}/>}
            {currentTab === 3 && <Prescriptions appointment={appointment}/>}
        </div>
    </div>
}

export default Appointment;
