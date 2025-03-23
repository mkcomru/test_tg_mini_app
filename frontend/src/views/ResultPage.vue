<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">
            Информация о дне рождения
        </h1>
        
        <div class="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
            <div v-if="isLoading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            
            <div v-else-if="error" class="text-center py-8">
                <p class="text-red-500">{{ error }}</p>
                <button 
                    @click="userStore.fetchUserData()" 
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Попробовать снова
                </button>
            </div>
            
            <div v-else class="space-y-6">
                <!-- Личные данные -->
                <div class="bg-blue-50 rounded-lg p-4">
                    <h2 class="text-xl font-semibold mb-3">Ваши данные</h2>
                    <div class="grid grid-cols-1 gap-2">
                        <p><span class="font-medium">Имя:</span> {{ userData.firstName || 'Не указано' }}</p>
                        <p><span class="font-medium">Фамилия:</span> {{ userData.lastName || 'Не указана' }}</p>
                        <p><span class="font-medium">Имя пользователя:</span> {{ userData.username ? '@' + userData.username : 'Не указано' }}</p>
                    </div>
                </div>
                
                <!-- Информация о дне рождения -->
                <div class="bg-green-50 rounded-lg p-4">
                    <h2 class="text-xl font-semibold mb-3">Дата рождения</h2>
                    <div class="grid grid-cols-1 gap-2">
                        <p><span class="font-medium">Дата:</span> {{ formattedBirthday }}</p>
                        <p><span class="font-medium">Возраст:</span> {{ age }} {{ getYearsWord(age) }}</p>
                    </div>
                </div>
                
                <!-- Обратный отсчёт -->
                <div class="bg-purple-50 rounded-lg p-4">
                    <h2 class="text-xl font-semibold mb-3">До следующего дня рождения</h2>
                    <div class="flex justify-center space-x-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">{{ timeUntil.days }}</div>
                            <div class="text-sm">{{ getDaysWord(timeUntil.days) }}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">{{ timeUntil.hours }}</div>
                            <div class="text-sm">{{ getHoursWord(timeUntil.hours) }}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">{{ timeUntil.minutes }}</div>
                            <div class="text-sm">{{ getMinutesWord(timeUntil.minutes) }}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Кнопки -->
                <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        @click="shareToTelegram" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    >
                        <span>Поделиться в Telegram</span>
                    </button>
                    <button 
                        @click="generateShareLink" 
                        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                    >
                        <span>Создать ссылку</span>
                    </button>
                </div>
                
                <!-- Модальное окно с ссылкой -->
                <div v-if="shareLink" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div class="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 class="text-xl font-semibold mb-4">Ваша ссылка</h3>
                        <div class="bg-gray-100 p-2 rounded mb-4 break-all">
                            {{ shareLink }}
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button 
                                @click="copyToClipboard(shareLink)" 
                                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Копировать
                            </button>
                            <button 
                                @click="shareLink = ''" 
                                class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { getMonthName } from '../models';
import { WebApp } from '../telegram';

const userStore = useUserStore();
const shareLink = ref('');

const userData = computed(() => userStore.userData);
const birthday = computed(() => userStore.birthday);
const isLoading = computed(() => userStore.isLoading);
const error = computed(() => userStore.error);
const age = computed(() => userStore.getAge());
const timeUntil = computed(() => userStore.getTimeUntilBirthday());

const formattedBirthday = computed(() => {
    return `${birthday.value.day} ${getMonthName(birthday.value.month)} ${birthday.value.year} г.`;
});

function getYearsWord(years: number): string {
    const lastDigit = years % 10;
    const lastTwoDigits = years % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'лет';
    }
    
    if (lastDigit === 1) {
        return 'год';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'года';
    }
    
    return 'лет';
}

function getDaysWord(days: number): string {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'дней';
    }
    
    if (lastDigit === 1) {
        return 'день';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'дня';
    }
    
    return 'дней';
}

function getHoursWord(hours: number): string {
    const lastDigit = hours % 10;
    const lastTwoDigits = hours % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'часов';
    }
    
    if (lastDigit === 1) {
        return 'час';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'часа';
    }
    
    return 'часов';
}

function getMinutesWord(minutes: number): string {
    const lastDigit = minutes % 10;
    const lastTwoDigits = minutes % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'минут';
    }
    
    if (lastDigit === 1) {
        return 'минута';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'минуты';
    }
    
    return 'минут';
}

function shareToTelegram() {
    if (WebApp && WebApp.MainButton) {
        WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent('Мой день рождения: ' + formattedBirthday.value)}`);
    } else {
        alert('Функция доступна только внутри Telegram');
    }
}

async function generateShareLink() {
    const link = await userStore.generateShareLink();
    if (link) {
        shareLink.value = link;
    }
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Ссылка скопирована в буфер обмена');
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}

onMounted(async () => {
    if (!userData.value.telegramId || !birthday.value.year) {
        await userStore.loadUserData();
    }
});
</script>