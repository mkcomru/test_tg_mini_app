import WebApp from '@twa-dev/sdk'

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

export { WebApp }

export function getUserData(): TelegramUser | null {
    if (WebApp.initDataUnsafe.user) {
        return WebApp.initDataUnsafe.user;
    }
    return null;
}

export function closeApp() {
    WebApp.close();
}

export function setupBackButton(callback: () => void) {
    WebApp.BackButton.onClick(callback);
    WebApp.BackButton.show();
}

export function hideBackButton() {
    WebApp.BackButton.hide();
}

export function setupMainButton(text: string, callback: () => void) {
    WebApp.MainButton.setText(text);
    WebApp.MainButton.onClick(callback);
    WebApp.MainButton.show();
}

export function initApp() {
    WebApp.ready();
    return WebApp;
}