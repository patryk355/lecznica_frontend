import dayjs from "dayjs";

export const phoneValidator = (value) => {
    return !!value.match(/^\+[1-9]\d{10,14}$/);
}

export const stringRequiredValidator = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
}

export const stringValidator = (value) => {
    return typeof value === 'string';
}

export const numberValidator = (value) => {
    return typeof value === 'number';
}

export const dateValidator = (value) => {
    return typeof value === 'string' && dayjs(value, 'YYYY-MM-DD', true).isValid();
}

export const dateTimeValidator = (value) => {
    return typeof value === 'string' && dayjs(value, 'YYYY-MM-DD HH:mm', true).isValid();
}
