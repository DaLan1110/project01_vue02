<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();
</script>

<template>
  <RouterView />
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>