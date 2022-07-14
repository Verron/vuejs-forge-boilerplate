<script setup lang="ts">
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { ref } from "vue";

const showTeamDropdown = ref(false);

const toggleTeams = () => {
  showTeamDropdown.value = !showTeamDropdown.value;
};
</script>

<template>
    <div
        class="p-4 border-bottom border-2 flex justify-between"
        style="margin: -1px"
    >
        <img
        src="https://vuejsforge.com/images/logo.svg"
        width="150"
        class="max-w-none"
        alt="Vue.js Forge"
        />
        <div>
        <button ref="button" class="mr-5 text-[#ff6358]" @click="toggleTeams">
            <span class="k-icon k-i-ungroup"></span>&nbsp;&nbsp;My Team
        </button>

        <KPopup anchor="button" :show="showTeamDropdown" class="mt-5 w-48">
            <ul>
            <li class="px-5 py-2">Team 1</li>
            <li class="px-5 py-2">Team 2</li>
            </ul>
        </KPopup>

        <KButton
            rounded="full"
            shape="rectangle"
            icon="logout"
            theme-color="warning"
            >Logout</KButton
        >
        </div>
    </div>
</template>