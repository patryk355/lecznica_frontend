import {useState} from "react";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.jsx";
import AddTreatment from "./parts/AddTreatment.jsx";
import AddIcon from "../../icons/AddIcon.jsx";
import EditIcon from "../../icons/EditIcon.jsx";
import {useTreatmentStore} from "../../store/treatmentStore.js";
import {colors} from "../../constants/colors.js";

const Treatments = ({appointment}) => {
    const treatments = useTreatmentStore(state => state.treatments).filter(t => t.appointmentId === appointment.id)
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
        {addMode && <AddTreatment appointment={appointment} currentRow={currentRow} onClose={() => {
            setAddMode(false);
            setCurrentRow(null);
        }}/>}
        <div className="sicknesses">
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Typ</th>
                        <th>Data</th>
                        <th>Uwagi</th>
                        <th style={{textAlign: 'center'}}>Edytuj</th>
                    </tr>
                    </thead>
                    <tbody>

                    {treatments && treatments.map(t => {
                        return <tr key={t.id}>
                            <td>{t?.type || '--'}</td>
                            <td>{t.date ? dayjs(t.date).format('YYYY-MM-DD HH:mm') : '--'}</td>
                            <td>{t?.notes || 'Brak'}</td>
                            <td>
                                <span onClick={() => {
                                    setAddMode(true);
                                    setCurrentRow(t);
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

export default Treatments;

