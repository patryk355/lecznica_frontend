import {useContext} from "react";
import ReactDOM from 'react-dom';
import {AppContext} from "../../context/appContext.jsx";

import './Modal.scss';

const Modal = ({children, onClose, width, disableOverlayOnClose = false}) => {
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
