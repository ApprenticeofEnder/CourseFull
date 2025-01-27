import { AxiosError, isAxiosError } from 'axios';

export class UnauthenticatedError extends Error {
    constructor() {
        super('Please log in.');
        this.name = 'UnauthenticatedError';
        Object.setPrototypeOf(this, UnauthenticatedError.prototype);
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super(
            `You can't access that resource. Double check your permissions and the resource you're trying to access and try again.`
        );
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export function processPossibleApiError(error: Error) {
    const fromAxios = isAxiosError(error);
    if (!fromAxios) {
        throw error;
    }
    const axiosError: AxiosError = error as AxiosError;
    if (axiosError.status === 401) {
        throw new UnauthenticatedError();
    }
    if (axiosError.status === 403) {
        throw new ForbiddenError();
    }
    throw axiosError;
}
