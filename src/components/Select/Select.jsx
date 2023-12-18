import '../Input/Input.scss';

const Select = ({id, label, options, onChange, value, hasError, errorText}) => {
    return <div className={`input-container ${errorText && hasError ? 'input-error' : ''} `}
                style={{rowGap: label ? '0.5rem' : '0',}}>
        <label htmlFor={id}>{label}</label>

        <select name={id} id={id} value={value?.value || null}
                onChange={onChange}>
            {options && options.map(o => {
                return <option key={o.value} value={o.value}>{o.label}</option>
            })}
        </select>
        {hasError && <p>{errorText}</p>}
    </div>
}

export default Select;
