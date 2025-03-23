<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">
            Введите вашу дату рождения
        </h1>
        <div class="max-w-lg mx-auto">
            <BirthdayPicker v-model="birthdayData" />
            
            <div class="mt-8 flex justify-center">
                <button 
                    @click="saveBirthday"
                    :disabled="!isValid || isLoading"
                    class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
                </button>
            </div>
            
            <p v-if="error" class="text-red-500 text-center mt-4">
                {{ error }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BirthdayPicker from '../components/BirthdayPicker.vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const birthdayData = computed({
    get: () => userStore.birthday,
    set: (value) => userStore.birthday = value
});

const isValid = computed(() => userStore.isValidBirthday());
const isLoading = computed(() => userStore.isLoading);
const error = computed(() => userStore.error);

async function saveBirthday() {
    if (!isValid.value) return;
    
    const success = await userStore.setBirthday(userStore.birthday);
    
    if (success) {
        router.push('/result');
    }
}
</script>