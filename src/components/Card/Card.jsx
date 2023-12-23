import './Card.scss';

const Card = ({children, bgColor, className = '', onClick}) => {
    return (
        <div
            className={`card ${className}`}
            style={{backgroundColor: bgColor}}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
