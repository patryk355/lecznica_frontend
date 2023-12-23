import {useState} from "react";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.jsx";
import AddVaccination from "./parts/AddVaccination.jsx";
import AddIcon from "../../icons/AddIcon.jsx";
import EditIcon from "../../icons/EditIcon.jsx";
import {useVaccinationStore} from "../../store/vaccinationStore.js";
import {colors} from "../../constants/colors.js";

const Vaccinations = ({appointment}) => {
    const vaccinations = useVaccinationStore(state => state.vaccinations).filter(v => v.appointmentId === appointment.id)
        .sort((a, b) => {
            const aTs = dayjs(a.expiration_date).unix();
            const bTs = dayjs(b.expiration_date).unix();

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
        {addMode && <AddVaccination appointment={appointment} currentRow={currentRow} onClose={() => {
            setAddMode(false);
            setCurrentRow(null);
        }}/>}
        <div className="sicknesses">
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Typ</th>
                        <th>Numer seryjny</th>
                        <th>Data podania</th>
                        <th>Data wygaśnięcia</th>
                        <th>Uwagi</th>
                        <th style={{textAlign: 'center'}}>Edytuj</th>
                    </tr>
                    </thead>
                    <tbody>

                    {vaccinations && vaccinations.map(v => {
                        return <tr key={v.id}>
                            <td>{v?.type || '--'}</td>
                            <td>{v?.serial_number || '--'}</td>
                            <td>{v.apply_date ? dayjs(v.apply_date).format('YYYY-MM-DD') : '--'}</td>
                            <td>{v.expiration_date ? dayjs(v.expiration_date).format('YYYY-MM-DD') : '--'}</td>
                            <td>{v?.notes || 'Brak'}</td>
                            <td>
                                <span onClick={() => {
                                    setAddMode(true);
                                    setCurrentRow(v);
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

export default Vaccinations;
