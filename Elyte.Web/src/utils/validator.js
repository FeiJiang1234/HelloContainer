const isEmail = (value) => {
    const partten = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g
    return partten.test(value);
}

const isPositiveInteger = (value) => {
    const partten = /^[0-9]*$/g
    return partten.test(value);
}

const isNonzeroDecimal = (value, length) => {
    var reg = new RegExp(`^([1-9][0-9]*)+(\\.[0-9]{1,${length}})?$`, "g");
    return reg.test(value);
}

const isDomainName = (value) => {
    const partten = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/g
    return partten.test(value);
}

const isStrongPassword = (value) => {
    const partten = /^[a-zA-Z].{5,17}$/g
    return partten.test(value);
}


export default {
    isEmail,
    isPositiveInteger,
    isNonzeroDecimal,
    isDomainName,
    isStrongPassword
};