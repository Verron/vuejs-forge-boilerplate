<script setup lang="ts">
import { useAlerts } from "@/stores/alerts";
import type { Board, Task } from "@/types";
import { useRouter } from "vue-router";
import { ref, toRef, computed } from "vue";
import { v4 as uuidv4 } from "uuid";

import { useQuery, useMutation } from "@vue/apollo-composable";
import getBoardQuery from "@/graphql/queries/board.query.gql";
import boardsQuery from "@/graphql/queries/boards.query.gql";
import addTaskToMutation from "@/graphql/mutations/addTaskToBoard.mutation.gql";
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
} = useQuery(getBoardQuery, { id: boardId.value }, {fetchPolicy: "cache-and-network"});
onBoardError(() => $alerts.error("Error loading board"));
const board = computed(() => boardData.value?.board || null);
const tasks = computed(() => board.value?.tasks?.items);

const { mutate: addTaskToBoard, onDone: onDoneAddTask, onError: onErrorAddTask } = useMutation(addTaskToMutation)

type TaskResolveType = ((task: Task) => void) | null
type TaskRejectType = ((error?: Error) => void) | null
let taskResolve: TaskResolveType = null
let taskReject: TaskRejectType = null

const addTask = async (task: Task) => {
  return new Promise((resolve: TaskResolveType, reject: TaskRejectType) => {
    taskResolve = resolve
    taskReject = reject
    addTaskToBoard({
      boardId: boardId.value,
      title: task.title,
    })
  });
};

onErrorAddTask((error?: Error) => {
  if (taskReject) taskReject(error)

  $alerts.error("Error creating task")
})

onDoneAddTask((response) => {
  if (taskResolve) taskResolve(response.data.boardUpdate.tasks.items[0] as Task)

  $alerts.success("New task created!")
})

const updatingTitle = ref(false);
const { mutate: updateBoard, onDone: onBoardUpdated } = useMutation(updateBoardMutation);

onBoardUpdated(() => $alerts.success("Board successfully updated!"));

const updateBoardTitle = async (title: string) => {
  if (board.value.title === title) return;
  updatingTitle.value = true;
  await updateBoard({ id: boardId.value, title });
  updatingTitle.value = false;
};
const { mutate: deleteBoard, onError: onErrorDeletingBoard } = useMutation(
  deleteBoardMutation,
  {
    update(cache) {
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
  await deleteBoard({ id: boardId.value });
  $router.push("/boards");

  $alerts.success("Board deleted!");
};
</script>

<template>
  <app-page-heading v-if="!loadingBoard" class="text-3xl mb-5">
      <input @keydown.enter="($event.target as HTMLInputElement).blur()" @blur="updateBoardTitle(($event.target as HTMLInputElement).value)" type="text" :value="board.title"
    />
  </app-page-heading>
  <board-menu v-if="!loadingBoard" :board="board" @deleteBoard="deleteBoardIfConfirmed"></board-menu>
  <div class="relative">
    <app-loader v-if="loadingBoard" overlay></app-loader>
    <board-drag-and-drop v-if="!loadingBoard"
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
