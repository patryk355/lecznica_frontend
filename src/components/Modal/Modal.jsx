import ReactDOM from 'react-dom';

import './Modal.scss';
import {useUserStore} from "../../store/userStore.js";
import {AppContext} from "../../context/appContext.jsx";
import {useContext} from "react";

const Modal = ({children, onClose, width, disableOverlayOnClose=false}) => {
    const {darkMode} = useContext(AppContext);

    return ReactDOM.createPortal(
        <>
            <div className='overlay' onClick={() => !disableOverlayOnClose && onClose()}></div>
            <div
                className={`modal ${darkMode ? 'dark' : 'light'}`}
                style={{maxWidth: width ? `${width}px` : 'auto'}}
            >
                {children}
            </div>
        </>,
        document.getElementById('portal')
    );
};

export default Modal;
