<template>
  <NCard title="Users">
    <NList>
      <NListItem v-for="user in users" :key="user">
        <NThing>
          <div class="flex items-center" style="gap: 8px">
            <span style="font-weight: bold; font-size: 18px">{{ user }}</span>
          </div>
        </NThing>
        <template v-if="isCurrentUser(user)" #suffix>
          <div
            class="flex items-center"
            style="flex: 1; justify-content: space-between"
          >
            <NTag v-if="isCurrentUser(user)" size="small" type="info">You</NTag>
          </div>
        </template>
      </NListItem>
    </NList>
  </NCard>
</template>
<script setup>
import { computed } from "vue";

import {
  NCard,
  NList,
  NListItem,
  NThing,
  NTag,
  NButton,
  NText,
} from "naive-ui";
import useRoom from "../composables/useRoom";

const { users, username } = useRoom();

console.log("users", users);
console.log("username", username);

const isCurrentUser = (user) => user === username.value;
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