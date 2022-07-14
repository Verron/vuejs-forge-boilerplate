<script setup lang="ts">
import type { Task } from "@/types";
import {
  Card,
  CardTitle,
  CardHeader,
  Avatar,
  CardSubtitle,
} from "@progress/kendo-vue-layout";
import { Chip } from "@progress/kendo-vue-buttons";
import { useDateFormat } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
const props = defineProps<{
  task: Task;
}>();
const date = useDateFormat(props.task.dueAt, "MM/DD");

const $router = useRouter();
const $route = useRoute();

const toRoute = (task: Task) => {
  console.log('go to route', task)
  // $router.push(`/boards/${$route.params.id}/tasks/${task.id}`);
};
</script>
<template>
  <Card @click="toRoute(task)">
    <CardHeader>
      <div class="flex justify-between">
        <CardTitle>
          {{ task.title }}
        </CardTitle>
        <Avatar type="image" size="medium" shape="circle">
          <img
            style="width: 45px; height: 45px"
            src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
          />
        </Avatar>
      </div>

      <CardSubtitle>
        <chip
          v-if="task.dueAt"
          :text="date"
          value="chip"
          rounded="full"
          icon="k-i-clock"
          theme-color="info"
        />
      </CardSubtitle>
    </CardHeader>
  </Card>
</template>
