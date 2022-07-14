<script setup lang="ts">
import type { Board } from "@/types";

import { useRouter } from "vue-router";
import { ref } from "vue";
import type { Ref } from "vue";
import { useAlerts } from "@/stores/alerts";
// @ts-ignore
import boardsQuery from "@/graphql/queries/boards.query.gql"; 
// @ts-ignore
import createBoardMutation from "@/graphql/mutations/createBoard.mutation.gql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed } from "@vue/reactivity";


const $router = useRouter();
const $alerts = useAlerts();

const { result, loading, onError } = useQuery(boardsQuery);
const boards = computed(() => result.value?.boardsList?.items || []);

const toBoard = (board: Board) => $router.push(`/boards/${board.id}`);

onError(() => $alerts.error("Error loading boards"));

const { mutate: createBoard, onDone: onCreateBoardDone } = useMutation(createBoardMutation, () => ({
  update(cache, { data: { boardCreate } }) {
    cache.updateQuery({ query: boardsQuery }, (res) => ({
      boardsList: {
        items: [...res.boardsList.items, boardCreate],
      },
    }));
  },
}));

onCreateBoardDone(() => $alerts.success('Board Created!'))

const newBoardPayload = computed(() => ({
  data: {
    title: `Board ${(boards.value.length || 0) + 1}`
  },
}));
</script>

<template>
  <div class="relative">
    <app-loader v-if="loading" overlay></app-loader>
    <h1>Boards</h1>
    <div class="flex flex-wrape">
      <div
        v-for="board in boards"
        :key="board.id"
        @click="toBoard(board)"
        class="w-72 m-5 cursor-pointer border rounded border-transparent hover:border-gray-300"
      >
        <img :src="`https://via.placeholder.com/600x400?text=${board.title}`" />
        <div class="p-2">{{ board.title }}</div>
      </div>

      <div
        @click="createBoard()"
        class="w-72 m-5 cursor-pointer border rounded border-transparent hover:border-gray-300 flex items-center justify-center min-h-[220px]"
      >
        New Board +
      </div>
    </div>
  </div>
</template>
