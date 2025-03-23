<template>
  <div class="min-h-screen bg-gradient-to-b from-telegram-blue to-telegram-purple text-white">
      <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { initApp, getUserData } from './telegram';

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  initApp();
  
  const user = getUserData();
  if (user) {
      userStore.setUserData({
          telegramId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username
      });
  }
  
  userStore.loadFromUrlParams();
});
</script>