import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initApp } from './telegram'
import './style.css'

// Инициализируем Telegram WebApp
const webApp = initApp()
console.log('Telegram WebApp initialized:', webApp)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')