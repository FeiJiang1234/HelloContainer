import * as Yup from 'yup';

const strongPasswordPartten = /^[a-zA-Z].{7,17}$/g;

const ageRange = {
    minAge: Yup.number()
        .typeError('The minimum age is invalid')
        .required()
        .min(0)
        .max(99)
        .label('Minimum Age'),
    maxAge: Yup.number()
        .typeError('The maximum age is invalid')
        .required()
        .min(0)
        .max(99)
        .moreThan(Yup.ref('minAge'), 'The maximum age less than minimum age')
        .label('Maximum Age'),
};

const dateRange = {
    startDate: Yup.date()
        .required()
        .min(new Date(), 'Start date cannot less than today!')
        .label('Start Date'),
    endDate: Yup.date()
        .required()
        .min(Yup.ref('startDate'), 'End date cannot less than start date!')
        .label('End Date'),
};

const dateRangeForEdit = {
    startDate: Yup.date()
        .required()
        .label('Start Date'),
    endDate: Yup.date()
        .required()
        .min(Yup.ref('startDate'), 'End date cannot less than start date!')
        .label('End Date'),
}

const address = {
    country: Yup.string().required().label('Country'),
    state: Yup.string().required().label('State'),
    city: Yup.string().required().label('City'),
};

export default {
    strongPasswordPartten,
    ageRange,
    dateRange,
    address,
    dateRangeForEdit
};
