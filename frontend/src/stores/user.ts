import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { UserData, BirthdayData, TimeUntilBirthday } from '../models'
import { calculateAge, isValidDate } from '../models'
import { userApi, shareApi } from '../api'
import type { UserResponse } from '../api'
import { getUserData, WebApp } from '../telegram'

export const useUserStore = defineStore('user', () => {
    const userData = ref<UserData>({})
    const birthday = ref<BirthdayData>({
        day: 1,
        month: 1,
        year: 2000
    })
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function setBirthday(data: BirthdayData) {
        try {
            isLoading.value = true
            error.value = null
            
            birthday.value = data
            
            const birthdayDate = new Date(data.year, data.month - 1, data.day)
            
            const response = await userApi.updateBirthday(birthdayDate)
            
            updateFromServerResponse(response)
            
            return true
        } catch (e) {
            console.error('Error updating birthday:', e)
            error.value = 'Ошибка при обновлении даты рождения'
            return false
        } finally {
            isLoading.value = false
        }
    }
    
    function setUserData(data: UserData) {
        userData.value = data
    }
    
    async function fetchUserData() {
        try {
            isLoading.value = true
            error.value = null
            
            const response = await userApi.getCurrentUser()
            updateFromServerResponse(response)
            
            return true
        } catch (e) {
            console.error('Error fetching user data:', e)
            error.value = 'Ошибка при получении данных пользователя'
            return false
        } finally {
            isLoading.value = false
        }
    }
    
    function updateFromServerResponse(response: UserResponse) {
        userData.value = {
            telegramId: response.telegram_id,
            firstName: response.first_name,
            lastName: response.last_name,
            username: response.username
        }
        
        if (response.birthday) {
            const [year, month, day] = response.birthday.split('-').map(Number)
            birthday.value = {
                day,
                month,
                year
            }
        }
    }
    
    async function loadUserData() {
        try {
            isLoading.value = true
            error.value = null
            
            loadFromUrlParams()
            
            const telegramUserData = getUserData()
            if (telegramUserData) {
                setUserData({
                    telegramId: telegramUserData.id,
                    firstName: telegramUserData.first_name,
                    lastName: telegramUserData.last_name,
                    username: telegramUserData.username
                })
            } else {
                console.warn('Не удалось получить данные пользователя из Telegram WebApp')
            }
            
            await fetchUserData()
            
            return true
        } catch (e) {
            console.error('Error loading user data:', e)
            error.value = 'Ошибка при загрузке данных пользователя'
            return false
        } finally {
            isLoading.value = false
        }
    }
    
    function getTimeUntilBirthday(): TimeUntilBirthday {
        const today = new Date()
        const currentYear = today.getFullYear()
        
        const birthdayDate = new Date(
            currentYear, 
            birthday.value.month - 1, 
            birthday.value.day
        )
        
        if (birthdayDate < today) {
            birthdayDate.setFullYear(currentYear + 1)
        }
        
        const diff = birthdayDate.getTime() - today.getTime()
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        
        return { days, hours, minutes }
    }
    
    async function generateShareLink(): Promise<string> {
        try {
            isLoading.value = true
            error.value = null
            
            const shareCode = await shareApi.createShareLink()
            
            const base = window.location.origin
            return `${base}/share/${shareCode}`
        } catch (e) {
            console.error('Error generating share link:', e)
            error.value = 'Ошибка при создании ссылки'
            return ''
        } finally {
            isLoading.value = false
        }
    }
    
    function loadFromUrlParams() {
        const params = new URLSearchParams(window.location.search)
        
        const firstName = params.get('name')
        const lastName = params.get('lastname')
        const username = params.get('username')
        const day = params.get('day')
        const month = params.get('month')
        const year = params.get('year')
        
        if (firstName) userData.value.firstName = firstName
        if (lastName) userData.value.lastName = lastName
        if (username) userData.value.username = username
        
        if (day && month && year) {
            birthday.value = {
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year)
            }
        }
    }
    
    async function loadByShareCode(shareCode: string) {
        try {
            isLoading.value = true
            error.value = null
            
            const userData = await shareApi.getSharedData(shareCode)
            updateFromServerResponse(userData)
            
            return true
        } catch (e) {
            console.error('Error loading shared data:', e)
            error.value = 'Ошибка при загрузке данных по ссылке'
            return false
        } finally {
            isLoading.value = false
        }
    }
    
    function getAge(): number {
        return calculateAge(birthday.value)
    }
    
    function isValidBirthday(): boolean {
        return isValidDate(birthday.value)
    }

    return {
        userData,
        birthday,
        isLoading,
        error,
        setBirthday,
        setUserData,
        getTimeUntilBirthday,
        generateShareLink,
        loadFromUrlParams,
        getAge,
        isValidBirthday,
        fetchUserData,
        loadUserData,
        loadByShareCode
    }
})