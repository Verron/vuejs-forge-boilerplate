<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board, Task } from "@/types";
import { ref, toRef } from "vue";
import { v4 as uuidv4 } from "uuid";

export interface Props {
  id: string;
}

const props = defineProps<Props>();

const $alerts = useAlerts();
const boardId = toRef(props, "id");

const board = ref<Board>({
  id: boardId.value,
  title: "Let's have an amazing time at Vue.js forge!! 🍍",
  order: JSON.stringify([
    { id: "1", title: "backlog 🌴", taskIds: ["1", "2"] },
  ]),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
});

const tasks = ref<Task[]>([
  {
    id: "1",
    title: "Code like mad people!",
    labels: [],
    dueAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Push clean code",
    labels: [],
    dueAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

const addTask = async (task: Task) => {
  return new Promise((resolve) => {
    const taskWithTheId: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: [],
      dueAt: new Date(),
    };
    tasks.value.push(taskWithTheId);
    resolve(taskWithTheId);
  });
};

const updateBoard = (b: Board) => {
  board.value = b;
  $alerts.success("Board updated!");
};

const deleteBoardIfConfirmed = () => {
  $alerts.success("Board deleted!");
};
</script>

<template>
  <app-page-heading>{{ board.title }}</app-page-heading>
  <board-menu :board="board" @deleteBoard="deleteBoardIfConfirmed"></board-menu>
  <div>
    <board-drag-and-drop
      :tasks="tasks"
      :board="board"
      @update="updateBoard"
      :add-task="addTask"
    />
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
