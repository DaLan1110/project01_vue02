<script setup>
import { ref } from "vue";
import ButtonRow from "./ButtonRow.vue";
import RightBox from "./RightBox.vue";
import LeftBox from "./LeftBox.vue";
</script>

<template>
  <div class="container home-container">
    <!-- 上方按鈕區域 -->
    <div class="button-row">
      <ButtonRow />
    </div>

    <!-- 下方兩個格子 -->
    <div class="bottom-row">
      <div class="left-box"><LeftBox /></div>
      <div class="right-box"><RightBox /></div>
    </div>
  </div>
</template>

<style>
.home-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  height: 100vh; /* 滿版高度 */
  width: 100%; /* 滿版寬度 */
  box-sizing: border-box;
}

.button-row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%; /* 高度設定 */
  width: 100%; /* 全寬 */
  padding: 10px; /* 適度內邊距 */
  box-sizing: border-box;
}

/* 下方兩個格子 */
.bottom-row {
  display: flex;
  height: 70%; /* 區域高度 70% */
  width: 100%;
}

.left-box {
  height: 100%;
  flex: 3; /* 左側占 3 份空間 */
  display: flex;
  justify-content: center;
  align-items: center; /* 內容置中 */
  padding: 1rem;
  box-sizing: border-box;
}

.right-box {
  height: 100%;
  flex: 2; /* 右側占 2 份空間 */
  display: flex; /* 彈性佈局，讓子元素可以自適應填滿 */
  justify-content: stretch; /* 子項目水平方向撐開 */
  align-items: center;
  padding: 1rem;
  box-sizing: border-box; /* 包含邊框與內邊距 */
}

@media (max-width: 1300px) {
  .left-box {
    align-items: flex-start;
  }

  .right-box {
    align-items: flex-start;
  }
}

@media (max-width: 1150px) {
  /* 將下方的兩個格子變成上下排列 */
  .bottom-row {
    flex-direction: column; /* 改為縱向排列 */
    height: auto; /* 讓高度自適應 */
  }

  /* 左側格子調整為上方 */
  .left-box {
    order: 1; /* 位置順序為 1 */
    width: 100%; /* 寬度填滿 */
    height: 50%; /* 上方占 50% 高度 */
  }

  /* 右側格子調整為下方 */
  .right-box {
    order: 2; /* 位置順序為 2 */
    width: 100%; /* 寬度填滿 */
    height: 50%; /* 下方占 50% 高度 */
  }
}
</style>