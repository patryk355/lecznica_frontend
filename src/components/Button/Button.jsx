import './Button.scss';

const Button = ({
                    onClick,
                    text,
                    icon,
                    transparent,
                    type,
                    disabled,
                    bgColor,
                    textColor,
                    className,
                }) => {
    return (
        <button
            className={`button ${transparent ? 'transparent' : ''} ${className || ''}`}
            onClick={onClick}
            type={type ? type : 'button'}
            disabled={disabled}
            style={{
                backgroundColor: bgColor,
                color: textColor,
                justifyContent: icon ? 'space-between' : 'center',
            }}
        >
            {text}
            {icon}
        </button>
    );
};

export default Button;
