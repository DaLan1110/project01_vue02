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

.menulayout-move {
  height: 100vh;
}

.app {
  display: flex;
  /* width: 100%; */
  height: 100%; /* 使高度隨螢幕大小調整 */
  overflow: auto; /* 如果內容超過容器，啟用滾動條 */
}

@media (max-width: 768px) {
  .navlayout-move {
    margin-left: 60px;
  }

  .menulayout-move {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #fff;
  }
}
</style>