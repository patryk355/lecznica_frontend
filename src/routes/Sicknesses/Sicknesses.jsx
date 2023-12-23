import {useState} from "react";
import dayjs from "dayjs";
import Button from "../../components/Button/Button.jsx";
import AddSickness from "./parts/AddSickness.jsx";
import AddIcon from "../../icons/AddIcon.jsx";
import EditIcon from "../../icons/EditIcon.jsx";
import {useSicknessStore} from "../../store/sicknessStore.js";
import {colors} from "../../constants/colors.js";

const Sicknesses = ({patient}) => {
    const sicknesses = useSicknessStore(state => state.sicknesses).filter(s => s.patientId === patient.id)
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
        {addMode && <AddSickness patient={patient} currentRow={currentRow} onClose={() => {
            setAddMode(false);
            setCurrentRow(null);
        }}/>}
        <div className="sicknesses">
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Nazwa choroby</th>
                        <th>Data</th>
                        <th>Opis</th>
                        <th style={{textAlign: 'center'}}>Edytuj</th>
                    </tr>
                    </thead>
                    <tbody>

                    {sicknesses && sicknesses.map(s => {
                        return <tr key={s.id}>
                            <td>{s?.name || '--'}</td>
                            <td>{s.date ? dayjs(s.date).format('YYYY-MM-DD') : '--'}</td>
                            <td>{s?.notes || 'Brak'}</td>
                            <td>
                                <span onClick={() => {
                                    setAddMode(true);
                                    setCurrentRow(s);
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

export default Sicknesses;
