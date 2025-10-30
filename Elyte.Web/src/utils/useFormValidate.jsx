import validator from './validator';
import * as moment from 'moment';

export default function useFormValidate () {
    const validateDigital = v => {
        return validator.isPositiveInteger(v) ? null : 'Please enter correct digital!';
    };

    const validateEmail = v => {
        return validator.isEmail(v) ? null : 'Your email is invalid, please check!';
    };

    const validateStartDateCanNotLessThanToday = value => {
        const v = moment(value).isBefore(new Date(), 'day');
        return v ? 'Start date cannot less than today!' : null;
    };

    const validateEndDateCanNotLessThanStartDate = (value, startDate) => {
        const v = moment(value).isBefore(startDate, 'day');
        return v ? 'End date cannot less than start date!' : null;
    };

    const validateTeamsAllowedForEliminationType = (value, tournamentType) => {
        if (tournamentType == "DoubleElimination" && value < 3)
            return 'Total Teams Allowed should be more than 2 for Double elimination games'
    }

    const validateTeamsAllowed = (value) => {
        if (value < 2)
            return 'Total Teams Allowed should be more than or equal to 2'
    }

    return {
        validateDigital,
        validateEmail,
        validateStartDateCanNotLessThanToday,
        validateEndDateCanNotLessThanStartDate,
        validateTeamsAllowedForEliminationType,
        validateTeamsAllowed
    };
}
