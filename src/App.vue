<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();
</script>

<template>
  <RouterView />
</template>

<style>
/* html,
body {
  height: auto;
  min-height: 100vh;
  margin: 0;
  padding: 0;
} */
</style>