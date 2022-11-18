<template>
  <Container>
    <div class="title">
      <h2>Users List</h2>
    </div>
    <div class="current-user-container">
      <UserContainer :username="currentUser" :isCurrentUser="true" />
    </div>
    <div class="users-list-container">
      <ul class="other-users-list">
        <li v-for="user in otherUsers" :key="user">
          <UserContainer :username="user" />
        </li>
      </ul>
    </div>
  </Container>
</template>
<script setup>
import { computed } from "vue";

import Container from "./Container.vue";
import UserContainer from "./UserContainer.vue";

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
<style scoped>
.current-user-container {
  margin-top: 1rem;
}

.users-list-container {
  margin-top: 1rem;
}

.other-users-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>