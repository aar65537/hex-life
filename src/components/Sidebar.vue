<script setup>
    import { boardSize } from "@/store";
</script>
<template>
    <div class="sidebar">
        <input v-model.number="boardSize"/>
    </div>
</template>

<style scoped>
    .sidebar {
        position: fixed;
        width: 10%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: var(--color-background-mute);
        overflow: hidden;
    }
</style>