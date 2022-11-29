<template>
  <div class="app-container">
    <header class="app-header">File Transfer</header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>
<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #ece6c2;
}

.app-header {
  background-color: #cc6b49;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.app-main {
  margin-top: 20px;
}
</style>