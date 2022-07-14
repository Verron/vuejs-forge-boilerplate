<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board, Task } from "@/types";
import { useRouter } from "vue-router";
import { toRef, computed } from "vue";
import { v4 as uuidv4 } from "uuid";

import { useQuery, useMutation } from "@vue/apollo-composable";
import getBoardQuery from "@/graphql/queries/board.query.gql";
import boardsQuery from "@/graphql/queries/boards.query.gql";
import deleteBoardMutation from "@/graphql/mutations/deleteBoard.mutation.gql";
import updateBoardMutation from "@/graphql/mutations/updateBoard.mutation.gql";

export interface Props {
  id: string;
}

const props = defineProps<Props>();

const $alerts = useAlerts();
const $router = useRouter();
const boardId = toRef(props, "id");

const {
  result: boardData,
  loading: loadingBoard,
  onError: onBoardError,
} = useQuery(getBoardQuery, { id: boardId.value });
onBoardError(() => $alerts.error("Error loading board"));
const board = computed(() => boardData.value?.board || null);
const tasks = computed(() => board.value?.tasks?.items);

const addTask = async (task: Task) => {
  return new Promise((resolve) => {
    const taskWithId: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: [],
      dueAt: new Date(),
    };
    tasks.value.push(taskWithId);
    resolve(taskWithId);
  });
};

const { mutate: updateBoard } = useMutation(updateBoardMutation);

const { mutate: deleteBoard, onError: onErrorDeletingBoard } = useMutation(
  deleteBoardMutation,
  {
    update(cache, { data: { boardDelete } }) {
      console.log(boardDelete);
      cache.updateQuery({ query: boardsQuery }, (res) => ({
        boardsList: {
          items: res.boardsList.items.filter(
            (b: Board) => b.id !== boardId.value
          ),
        },
      }));
    },
  }
);
onErrorDeletingBoard(() => $alerts.error("Error deleting board"));

const deleteBoardIfConfirmed = async () => {
  $alerts.success("Board deleted!");
};
</script>

<template>
  <app-page-heading>{{ board.title }}</app-page-heading>
  <board-menu :board="board" @deleteBoard="deleteBoardIfConfirmed"></board-menu>
  <div class="relative">
    <app-loader v-if="loadingBoard" overlay></app-loader>
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
