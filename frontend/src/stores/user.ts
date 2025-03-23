import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserData {
    telegramId?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
}

export interface BirthdayData {
    day: number;
    month: number;
    year: number;
}

export const useUserStore = defineStore('user', () => {
    const userData = ref<UserData>({})
    const birthday = ref<BirthdayData>({
        day: 1,
        month: 1,
        year: 2000
    })

    function setBirthday(data: BirthdayData) {
        birthday.value = data
        saveToLocalStorage()
    }

    function setUserData(data: UserData) {
        userData.value = data
        saveToLocalStorage()
    }

    function saveToLocalStorage() {
        localStorage.setItem('userData', JSON.stringify(userData.value))
        localStorage.setItem('birthday', JSON.stringify(birthday.value))
    }

    function loadFromLocalStorage() {
        const savedUserData = localStorage.getItem('userData')
        const savedBirthday = localStorage.getItem('birthday')
    
        if (savedUserData) {
            try {
                userData.value = JSON.parse(savedUserData)
            } catch (e) {
                console.error('Error parsing user data:', e)
            }
        }
    
        if (savedBirthday) {
            try {
                birthday.value = JSON.parse(savedBirthday)
            } catch (e) {
                console.error('Error parsing birthday data:', e)
            }
        }
    }

    function getTimeUntilBirthday() {
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

    function generateShareLink() {
        const base = window.location.origin
        const params = new URLSearchParams()
        
        params.set('name', userData.value.firstName || '')
        params.set('lastname', userData.value.lastName || '')
        params.set('username', userData.value.username || '')
        params.set('day', birthday.value.day.toString())
        params.set('month', birthday.value.month.toString())
        params.set('year', birthday.value.year.toString())
        
        return `${base}?${params.toString()}`
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

    return {
        userData,
        birthday,
        setBirthday,
        setUserData,
        getTimeUntilBirthday,
        saveToLocalStorage,
        loadFromLocalStorage,
        generateShareLink,
        loadFromUrlParams
    }
})
