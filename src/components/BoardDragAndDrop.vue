<script setup lang="ts">
import { watch, reactive, toRaw } from "vue";
import { cloneDeep } from "lodash-es";
import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";
import type { Board, Column, Task } from "@/types";
import { useAlerts } from "@/stores/alerts";

export interface Props {
  board: Board
  tasks: Task[]
  addTask(task: Partial<Task>): Promise<Task>
}

export interface Emits {
  (e: "update", payload: Partial<Board>): void
}

const props = defineProps<Props>();

// emits
const emit = defineEmits<Emits>()

const $alerts = useAlerts()

// local data
const tasks = reactive<Task[]>(cloneDeep(props.tasks));
const board = reactive<Board>(cloneDeep(props.board));
const columns = typeof board.order === 'string' ? reactive<Column[]>(JSON.parse(board.order)) : reactive<Column[]>(cloneDeep(board.order));

const addColumn = () => columns.push({id: uuidv4(), title: "New column", taskIds: []});

watch(columns, () =>
    emit(
        "update",
        cloneDeep({
          ...props.board,
          order: JSON.stringify(toRaw(columns)),
        })
    )
);

const addTask = async ({ column, title }: { column: Column; title: string }) => {
  const newTask = { title };
  try {
    const savedTask = await props.addTask(newTask);
    tasks.push({ ...savedTask });
    column.taskIds.push(savedTask.id);
  } catch (error) {
    $alerts.error("Error creating task!");
  }
}
</script>

<template>
  <div class="flex items-start py-12">
    <draggable :list="columns" group="columns" item-key="id" class="flex flex-grow-0 flex-shrink-0 overflow-x-scroll">
      <template #item="{ element: column, index: columnIndex }">
        <div class="column bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 mr-4 w-[300px]" :data-column-id="column.id" :data-column-index="columnIndex">
          <div class="flex flex-col flex-1">
            <h3>{{ column.title }}</h3>
            <draggable
                :list="column.taskIds"
                group="tasks"
                item-key="uid"
                :animation="200"
                ghost-class="ghost-card"
                class="min-h-[400px] flex-1"
            >
              <template #item="{ element: taskId, index: taskIndex }">
                <task-card
                    v-if="tasks.find((t: Task) => t.id === taskId)"
                    :task="(tasks.find((t: Task) => t.id === taskId) as Task)"
                    class="mt-3 cursor-move"
                    :data-task-index="taskIndex"
                />
              </template>
            </draggable>
            <task-creator @create="addTask({column, title: $event})"></task-creator>
          </div>
        </div>
      </template>
    </draggable>
   
  </div>
  <button class="text-gray-500" @click="addColumn">New Column +</button>
</template>