// A place to put DTO objects

type Camelize<T extends string> = T extends `${infer A}_${infer B}`
    ? `${A}${Camelize<Capitalize<B>>}`
    : T;

type CamelizeKeys<T extends object> = {
    [key in keyof T as key extends string ? Camelize<key> : key]: T[key]
}

export interface SignUpDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    subscribed: boolean;
}

export type SignUpPayload = CamelizeKeys<SignUpDTO>;