import { customAlphabet } from 'nanoid';

// Generates a 10-character ID (e.g., APP72910)
export const generateAppId = () => {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
    return `AP-${nanoid()}`; 
};

export const generateUserId = () => {
    const nanoid = customAlphabet('1234567890', 6);
    return `USR${nanoid()}`;
};