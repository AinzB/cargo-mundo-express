export interface Usuario {
    id?: number;
    username: string;
    email: string;
    role?: string;
    password?: string;
    active?: boolean;
    genre?: string;
    [key: string]: string | number | boolean | undefined;
}