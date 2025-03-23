import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '../views/InputPage.vue'
import ResultPage from '../views/ResultPage.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'input',
            component: InputPage
        },
        {
            path: '/result',
            name: 'result',
            component: ResultPage
        }
    ] 
})

export default router
