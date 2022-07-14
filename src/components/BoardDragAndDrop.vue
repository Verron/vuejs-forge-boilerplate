<script setup lang="ts">
import { watch, reactive, toRaw } from "vue";
import { cloneDeep } from "lodash-es";
import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";
import type { Board, Task } from "@/types";

export interface Props {
  board: Board
  tasks: []
}

const props = defineProps<Props>();

// emits
const emit = defineEmits(["update"]);

// local data
const tasks = reactive(cloneDeep(props.tasks));
const board = reactive(cloneDeep(props.board));
const columns = typeof board.order === 'string' ? reactive(JSON.parse(board.order)) : reactive(cloneDeep(board.order));

const addColumn = () =>
    columns.push({id: uuidv4(), title: "New column", taskIds: []});

watch(columns, () =>
    emit(
        "update",
        cloneDeep({
          ...props.board,
          order: JSON.stringify(toRaw(columns)),
        })
    )
);
</script>

<template>
  <button class="text-gray-500" @click="addColumn">New Column +</button>
  <div class="flex items-start py-12">
    <draggable
        :list="columns"
        group="columns"
        item-key="id"
        class="flex flex-grow-0 flex-shrink-0 overflow-x-scroll"
    >
      <template #item="{ element: column, index: columnIndex }">
        <div class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 mr-4 w-[300px]" :data-column-id="column.id" :data-column-index="columnIndex">
          <h2>{{ column.title }}</h2>
          <draggable
              :list="column.taskIds"
              group="tasks"
              item-key="uid"
              :animation="200"
              ghost-class="ghost-card"
              class="min-h-[400px]"
          >
            <template #item="{ element: taskId, index: taskIndex }">
              <task-card
                  v-if="tasks.find((t: Task) => t.id === taskId)"
                  :task="tasks.find((t: Task) => t.id === taskId)"
                  class="mt-3 cursor-move"
                  :data-task-index="taskIndex"
              />
            </template>
          </draggable>
        </div>
      </template>
    </draggable>
   
  </div>
</template>