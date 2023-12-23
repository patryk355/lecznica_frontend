import {useContext} from "react";
import {Triangle} from 'react-loader-spinner';
import {colors} from "../../constants/colors.js";
import {AppContext} from "../../context/appContext.jsx";

const Loader = ({color}) => {
    return (
        <Triangle
            height='40'
            width='40'
            color={color}
            ariaLabel='triangle-loading'
        />
    );
};
export default Loader;

export const CenteredLoader = () => {
    const {darkMode} = useContext(AppContext);

    return <div className={'centered-loader'}>
        <Loader color={darkMode ? colors.yellow : colors.purple}/>
    </div>
}

