<template>
  <div class="min-h-screen bg-gradient-to-b from-telegram-blue to-telegram-purple text-white">
      <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { initApp } from './telegram';

const router = useRouter();
const userStore = useUserStore();

initApp();

onMounted(async () => {
  await userStore.loadUserData();
});
</script>