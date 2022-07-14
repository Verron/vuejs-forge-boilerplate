<script setup lang="ts">
import { ref, computed } from "vue";
import { Drawer, DrawerContent } from "@progress/kendo-vue-layout";
import { useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";

const $router = useRouter();
const expanded = useLocalStorage("vue-force-drawer-expanded", true);
const expandedIcon = computed(() =>
  expanded.value ? "k-i-arrow-chevron-left" : "k-i-arrow-chevron-right"
);
const selected = ref(-1);

const items = computed(() => {
  const navigationItems = [{
    text: "Boards",
    icon: "k-i-layout-1-by-4",
    selected: true,
    data: {
      path: "/boards",
    },
  },
  {
    text: "Templates",
    icon: "k-i-delicious-box",
    selected: true,
    data: {
      path: "/templates",
    },
  },
  {
    text: "Settings",
    icon: "k-i-gear",
    selected: true,
    data: {
      path: "/settings",
    },
  },
  {
    text: "Collapse",
    icon: expandedIcon.value,
    data: {
      action: () => (expanded.value = !expanded.value),
    },
  }];

  return navigationItems.map((item, index) => ({
    ...item,
    selected: index === selected.value,
  }))
})

const onSelect = (event: { itemIndex: number }) => {
  const item = items.value[event.itemIndex];
  if (item.data.path) {
    $router.push(item.data);
  }
  if (typeof item.data.action === "function") {
    item.data.action();
  }
  selected.value = event.itemIndex;
};
</script>

<template>
    <Drawer class="flex-1" :expanded="expanded" position="start" mode="push" :mini="true" :items="items" @select="onSelect">
        <DrawerContent>
            <div class="p-5">
                <RouterView />
            </div>
        </DrawerContent>
    </Drawer>
</template>