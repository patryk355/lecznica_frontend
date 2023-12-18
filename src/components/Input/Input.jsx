import DatePicker, {registerLocale} from "react-datepicker";
import pl from 'date-fns/locale/pl';

registerLocale('pl', pl)

import './Input.scss';

const Input = ({
                   type,
                   placeholder,
                   id,
                   name,
                   label,
                   value,
                   onChange,
                   hasError,
                   errorText,
                   inputWidth,
                   defaultValue,
                   required,
                   min,
                   max,
                   step
               }) => {
    return (
        <div
            className={`input-container ${
                errorText && hasError ? 'input-error' : ''
            } `}
            style={{
                width: inputWidth,
                maxWidth: inputWidth,
                rowGap: label ? '0.5rem' : '0',
            }}
        >
            <label htmlFor={id} className={`${required ? 'required' : ''}`}>{label}</label>

            {(type === 'date' || type === 'datetime') &&
                <DatePicker showTimeSelect={type === 'datetime'} timeFormat="HH:mm" selected={value} onChange={onChange}
                            locale={'pl'} timeIntervals={10}
                            dateFormat={type === 'datetime' ? "Pp" : "yyyy-MM-dd"}/>}
            {type === 'textarea' && <textarea id={id}
                                              name={name || id}
                                              placeholder={placeholder}
                                              value={value}
                                              onChange={onChange}
                                              maxLength={500}
                                              defaultValue={defaultValue}></textarea>}
            {type !== 'date' && type !== 'datetime' && type !== 'textarea' && <input
                id={id}
                name={name || id}
                type={type ? type : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
                min={min}
                max={max}
                step={step}
            />}
            {hasError && <p>{errorText}</p>}
        </div>
    );
};

export default Input;
