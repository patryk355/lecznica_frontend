import {useState} from "react";
import {toast} from "react-toastify";
import Modal from "../../../components/Modal/Modal.jsx";
import Button from "../../../components/Button/Button.jsx";
import {colors} from "../../../constants/colors.js";
import axios from "../../../api/axios.js";
import {useClientStore} from "../../../store/clientStore.js";
import Loader from "../../../components/Loader/Loader.jsx";
import {usePatientStore} from "../../../store/patientStore.js";

const DeleteClient = ({onClose, clientId}) => {
    const {removeClient} = useClientStore(state => state);
    const {patients, editPatient} = usePatientStore(state => state);

    const [isLoading, setIsLoading] = useState(false);

    const deleteClientHandler = () => {
        if (!clientId) return;

        setIsLoading(true);
        axios.delete(`/clients/${clientId}`)
            .then(() => {
                removeClient(clientId);
                const patient = patients.find(p => p.clientId === clientId);
                editPatient(patient.id, {clientId: null});
                toast.success('Klient został usunięty');
                onClose();
            })
            .catch((error) => {
                toast.error('Klient nie został usunięty');
                console.error('DeleteClient: ', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return <Modal onClose={onClose} width={350}>
        <div className="delete-client-modal">
            <h2>Czy na pewno chcesz usunąć klienta?</h2>

            <div>
                {isLoading && <Loader/>}
                {!isLoading && <>
                    <Button text={'Anuluj'} onClick={onClose}/>
                    <Button text={'Potwierdź'} onClick={deleteClientHandler} textColor={colors.white}
                            bgColor={colors.red}/>
                </>}
            </div>

        </div>
    </Modal>
}

export default DeleteClient;
