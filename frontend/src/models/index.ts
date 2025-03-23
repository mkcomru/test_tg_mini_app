export interface UserData {
    telegramId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
}

export interface BirthdayData {
    day: number;
    month: number;
    year: number;
}

export interface TimeUntilBirthday {
    days: number;
    hours: number;
    minutes: number;
}

export interface ShareData extends UserData, BirthdayData {}

export enum Month {
    Январь = 1,
    Февраль,
    Март,
    Апрель,
    Май,
    Июнь,
    Июль,
    Август,
    Сентябрь,
    Октябрь,
    Ноябрь,
    Декабрь
}

export function getMonthName(month: number): string {
    return Month[month] || '';
}

export function calculateAge(birthday: BirthdayData): number {
    const today = new Date();
    const birthDate = new Date(birthday.year, birthday.month - 1, birthday.day);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

export function isValidDate(birthday: BirthdayData): boolean {
    const date = new Date(birthday.year, birthday.month - 1, birthday.day);
    return date.getFullYear() === birthday.year && 
            date.getMonth() === birthday.month - 1 && 
            date.getDate() === birthday.day;
}