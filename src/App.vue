<template>
  <div class="app-container">
    <main>
      <n-config-provider :theme="darkTheme">
        <n-loading-bar-provider>
          <n-notification-provider placement="top-left">
            <router-view />
          </n-notification-provider>
        </n-loading-bar-provider>
      </n-config-provider>
    </main>
  </div>
</template>
<script setup>
import {
  NLoadingBarProvider,
  NNotificationProvider,
  NConfigProvider,
  darkTheme,
} from "naive-ui";
</script>
<style scoped>
.app-container {
  min-height: 100vh;
  background-color: black;
  color: #eee;
  min-width: 350px;
}
</style>