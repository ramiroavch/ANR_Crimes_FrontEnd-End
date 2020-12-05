const ValidateEmail = (email)=>{
    const emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (emailRegex.test(email));
}

const ValidateNumber = (number)=>{
    const numberRegex= /^[0-9]+$/;
    return (numberRegex.test(number));
}

const ValidateDecimal = (number)=>{
    const numberRegex= /^[1-9]\d*(\.\d+)?$/;
    return (numberRegex.test(number));
}

export const ValidateValue=(value,type)=>{
    switch (type){
        case 'string':
            return ((value==null)||(value.trim()===''));
        case 'number':
            return ((value==null)||(value.trim()==='')||!(ValidateNumber(value)));
        case 'decimal':
            return ((value==null)||(value.trim()==='')||!(ValidateDecimal(value)));
        case 'email':
            return ((value==null)||(value.trim()==='')||!(ValidateEmail(value)));
        default:
            return false;

    }
}

export default {ValidateValue}