<script setup lang="ts">
import { Loader as KLoader } from "@progress/kendo-vue-indicators";
defineProps<{
  overlay: boolean;
}>();
</script>

<template>
  <div :class="{ overlay }">
    <KLoader type="pulsing" />
  </div>
</template>

<style scoped>
.overlay {
  @apply absolute flex justify-center items-center w-full h-full;
  background: rgba(255, 255, 255, 0.75);
  z-index: 2;
}
</style>