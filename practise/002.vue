<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbList = ref([]);

const isHome = () => {
  return route.name === "home";
};

const getBredcrumbs = () => {
  let matched = route.matched;
  if (!isHome(matched[0])) {
    matched = [{ name: "/", meta: { label: "首頁" } }].concat(matched);
  }
  breadcrumbList.value = matched;
};

watch(route, () => {
  getBredcrumbs();
});
onMounted(() => {
  getBredcrumbs();
  console.log(breadcrumbList.value);
});
</script>

<template>
  <ol class="flex">
    <li v-for="(item, i) in breadcrumbList" :key="i" class="pl-2">
      <RouterLink :to="item.path">{{ item.meta.label }}</RouterLink>
    </li>
  </ol>
</template>

<style>
li::after {
  content: "/";
  display: inline-block;
  padding-left: 0.5rem;
}
li:last-child::after {
  content: "";
}
</style>