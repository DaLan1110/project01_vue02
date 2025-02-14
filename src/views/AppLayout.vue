<script setup>
import MenuLayout from "@/components/AppLayout/Menu.vue";
import NavLayout from "@/components/AppLayout/NavLayout.vue";
</script>

<template>
  <div class="app">
    <MenuLayout class="menulayout-move" />
    <NavLayout class="navlayout-move" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

.app {
  display: flex;
}

.menulayout-move {
  z-index: 2000;
}

.navlayout-move {
  z-index: 1900;
}

@media (max-width: 768px) {
  .navlayout-move {
    margin-left: 60px;
    width: 100%;
  }
}
</style>