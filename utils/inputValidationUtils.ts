import { ValidationObj } from "@/types/types";


//*----------------------------------------------//
//*-------------------PASSWORD-------------------//
//*----------------------------------------------//

export const comparePasswords = (p1: string, p2: string): ValidationObj => {
    if (p1 !== p2) {
        return {
            isValid: false,
            conditionFailed: 'match',
            message: 'Passwords do not match'
        }
    }
    return { isValid: true }
}

export const containsSpecChar = (pass: string): boolean => {
    const specChars = '!@#$%^&*{}[]()<>:;+-/\\'.split('');
    if (specChars.some(char => pass.indexOf(char) > -1)) {
        return true;
    }
    return false;
};

export const containsNumber = (pass: string): boolean => {
    if (pass.match(/\d/)) {
        return true;
    }
    return false;
};

export const containsUpperCase = (pass: string): boolean => {
    if (pass.match(/[A-Z]/)) {
        return true;
    }
    return false;
};

export const validatePassword = (pass: string): ValidationObj => {
    if (pass.length < 8) {
        return {
            isValid: false,
            conditionFailed: 'length',
            message: 'Password must be at least 8 characters',
        };
    }

    if (!containsNumber(pass)) {
        return {
            isValid: false,
            conditionFailed: 'number',
            message: 'Password must contain at least one number',
        };
    }

    if (!containsUpperCase(pass)) {
        return {
            isValid: false,
            conditionFailed: 'case',
            message: 'Password must contain at least one upper case letter',
        };
    }

    if (!containsSpecChar(pass)) {
        return {
            isValid: false,
            conditionFailed: 'special',
            message: 'Password must contain at least one special character',
        };
    }

    return { isValid: true };
};



//*-----------------------------------------------//
//*---------------------EMAIL---------------------//
//*-----------------------------------------------//

function domainFormatted(pass: string): boolean {
    if (pass.match(/\w+\.[a-z]{2,}$/i)) {
        return true;
    }
    return false;
}

export const validateEmail = (pass: string): ValidationObj => {

    if (pass.indexOf('@') === -1) {
        return {
            isValid: false,
            conditionFailed: 'syntax',
            message: 'Email address is missing "@"'
        }
    }

    if (!domainFormatted(pass)) {
        return {
            isValid: false,
            conditionFailed: 'syntax',
            message: 'Email domain is not properly formatted'
        }
    }

    return { isValid: true }
}