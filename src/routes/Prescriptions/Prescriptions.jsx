import {useState} from "react";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.jsx";
import EditIcon from "../../icons/EditIcon.jsx";
import AddIcon from "../../icons/AddIcon.jsx";
import AddPrescription from "./parts/AddPrescription.jsx";
import {usePrescriptionStore} from "../../store/prescriptionStore.js";
import {colors} from "../../constants/colors.js";

const Prescriptions = ({appointment}) => {
    const prescriptions = usePrescriptionStore(state => state.prescriptions).filter(p => p.appointmentId === appointment.id)
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
        {addMode && <AddPrescription appointment={appointment} currentRow={currentRow} onClose={() => {
            setAddMode(false);
            setCurrentRow(null);
        }}/>}
        <div className="sicknesses">
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Numer</th>
                        <th>Data</th>
                        <th>Nazwa leku</th>
                        <th>Dawka (mg)</th>
                        <th>Ilość</th>
                        <th style={{textAlign: 'center'}}>Edytuj</th>
                    </tr>
                    </thead>
                    <tbody>

                    {prescriptions && prescriptions.map(p => {
                        return <tr key={p.id}>
                            <td>{p?.number || '--'}</td>
                            <td>{p.date ? dayjs(p.date).format('YYYY-MM-DD') : '--'}</td>
                            <td>{p?.drug_name || '--'}</td>
                            <td>{p?.dose || '--'}</td>
                            <td>{p?.packages_amount || '--'}</td>
                            <td>
                                <span onClick={() => {
                                    setAddMode(true);
                                    setCurrentRow(p);
                                }}><EditIcon/></span>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
            <div className="buttons">
                <Button text={'Dodaj'} onClick={() => setAddMode(true)} bgColor={colors.green} textColor={colors.white}
                        icon={<AddIcon/>}/>
            </div>
        </div>
    </>
}

export default Prescriptions;

