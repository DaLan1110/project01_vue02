<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

const breadcrumbList = ref([]);

const updateList = () => {
  breadcrumbList.value = route.meta.breadcrumb || [];
};

const routeTo = (pRouteTo) => {
  if (breadcrumbList.value[pRouteTo]?.link) {
    router.push(breadcrumbList.value[pRouteTo]?.link);
  }
};

watch(route, updateList);

onMounted(() => {
  updateList();
});
</script>

<template>
  <div style="margin-top: 10px">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          class="breadcrumb-item breadcrumb-item-style"
          v-for="(breadcrumb, index) in breadcrumbList"
          :key="index"
          @click="routeTo(index)"
        >
          {{ breadcrumb.name }}
        </li>
      </ol>
    </nav>
  </div>
</template>

<style>
.breadcrumb-item-style {
  font-family: "Chocolate Classical Sans", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #5b5b5b;
  cursor: pointer;
}
</style>