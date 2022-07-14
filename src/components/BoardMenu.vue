<script setup lang="ts">
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { ref, toRef } from "vue";
import type { Board } from "@/types";

export interface Props {
  board: Board;
}

export interface Emits {
  (e: "deleteBoard", payload: Board): void;
}

const props = defineProps<Props>();

const show = ref(false);
const menu = ref(null);

const emit = defineEmits<Emits>();

const board = toRef(props, "board");

const confirmDeleteBoard = (board: Board) => {
  if (confirm("Are you sure you want to delete board?"))
    emit("deleteBoard", board);
};
</script>
<template>
  <div>
    <KButton
      icon="folder"
      theme-color="primary"
      fillMode="outline"
      @click="show = !show"
      ref="button"
      >Show Menu</KButton
    >
    <KPopup
      :anchor="'button'"
      :anchor-align="{
        vertical: 'bottom',
        horizontal: 'right',
      }"
      :popup-align="{
        horizontal: 'right',
        vertical: 'top',
      }"
      :show="show"
    >
      <div class="p-5" ref="menu">
        <ul>
          <li class="text-red-500 whitespace-nowrap">
            <button @click="confirmDeleteBoard(board)">
              <span class="k-icon k-i-delete"></span>
              Delete Board
            </button>
          </li>
        </ul>
      </div>
    </KPopup>
  </div>
</template>
<style scoped>
ul li {
  @apply p-2;
  border-bottom: 1px solid #eee;
}
ul li:last-of-type {
  border-bottom: none;
}
</style>
