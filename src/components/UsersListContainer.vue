<template>
  <Container>
    <div class="current-user-container">
      <p>Current user: {{ currentUser }}</p>
    </div>
    <div class="users-list-container">
      <ul>
        <li v-for="user in otherUsers" :key="user">
          {{ user }}
        </li>
      </ul>
    </div>
  </Container>
</template>
<script setup>
import { computed } from "vue";

import Container from "./Container.vue";

const props = defineProps({
  users: {
    type: Array,
    required: true,
    default: () => [],
  },
  currentUser: {
    type: String,
    required: true,
    default: "",
  },
});

const isCurrentUser = (user) => user === props.currentUser;

const otherUsers = computed(() =>
  props.users.filter((user) => !isCurrentUser(user))
);
</script>
<style scoped></style>