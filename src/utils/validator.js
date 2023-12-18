export const phoneValidator = (value) => {
    return !!value.match(/^\+[1-9]\d{10,14}$/);
}
