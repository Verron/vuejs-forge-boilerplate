<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board } from "@/types";
import { ref, toRef } from "vue";

export interface Props {
  id: string
}

const props = defineProps<Props>()

const $alerts = useAlerts()
const boardId = toRef(props, 'id');

const board = ref<Board>({
  id: boardId.value,
  title: "Let's have an amazing time at Vue.js forge!! 🍍",
  order: JSON.stringify([
    { id: "1", title: "backlog 🌴", taskIds: ["1", "2"] },
  ]),
  createdAt: new Date,
  updatedAt: new Date,
  deletedAt: new Date,
});

const tasks = ref([
  { id: "1", title: "Code like mad people!" },
  { id: "2", title: "Push clean code" },
]);
const updateBoard = (b: Board) => {
  board.value = b;
  $alerts.success("Board updated!");
};
</script>

<template>
  <div>{{ board.title }}</div>
  <div>

    <board-drag-and-drop :tasks="tasks" :board="board" @update="updateBoard" />
  </div>
</template>

<style scoped>
pre {
  width: 400px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
