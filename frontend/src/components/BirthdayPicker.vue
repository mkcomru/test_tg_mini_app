<template>
    <div class="birthday-picker">
        <h2 class="text-xl font-semibold mb-4">Дата рождения</h2>
        
        <div class="grid grid-cols-3 gap-4">
            <div>
                <label for="day" class="block mb-1 text-sm font-medium">День</label>
                <select 
                    id="day" 
                    v-model="day" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @change="emitUpdate"
                >
                    <option v-for="n in 31" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
            
            <div>
                <label for="month" class="block mb-1 text-sm font-medium">Месяц</label>
                <select 
                    id="month" 
                    v-model="month" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @change="emitUpdate"
                >
                    <option v-for="n in 12" :key="n" :value="n">{{ getMonthName(n) }}</option>
                </select>
            </div>
            
            <div>
                <label for="year" class="block mb-1 text-sm font-medium">Год</label>
                <select 
                    id="year" 
                    v-model="year" 
                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @change="emitUpdate"
                >
                    <option v-for="n in years" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
        </div>
        
        <p v-if="!isValid" class="text-red-500 mt-2 text-sm">
            Пожалуйста, укажите корректную дату
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { BirthdayData } from '../models';
import { isValidDate, getMonthName } from '../models';

const props = defineProps<{
    modelValue: BirthdayData
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: BirthdayData): void
}>();

const day = ref(props.modelValue.day);
const month = ref(props.modelValue.month);
const year = ref(props.modelValue.year);

const currentYear = new Date().getFullYear();
const years = computed(() => {
    const result = [];
    for (let y = currentYear; y >= currentYear - 100; y--) {
        result.push(y);
    }
    return result;
});

const isValid = computed(() => {
    return isValidDate({
        day: day.value,
        month: month.value,
        year: year.value
    });
});

function emitUpdate() {
    emit('update:modelValue', {
        day: day.value,
        month: month.value,
        year: year.value
    });
}

watch(() => props.modelValue, (newValue) => {
    day.value = newValue.day;
    month.value = newValue.month;
    year.value = newValue.year;
}, { deep: true });

onMounted(() => {
    if (!day.value || !month.value || !year.value) {
        const today = new Date();
        day.value = today.getDate();
        month.value = today.getMonth() + 1;
        year.value = today.getFullYear() - 18;
        emitUpdate();
    }
});
</script>