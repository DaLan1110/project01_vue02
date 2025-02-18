<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Chart from "@/components/Home/Chart.vue";
import ChartToSmall from "@/components/Home/ChartToSmall.vue";

// 視窗 變化
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  // 視窗 變化
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="card left-card-style">
    <div class="card-header">
      <h4 class="card-header-text" style="font-weight: 600">
        飲品前五名熱門商品
      </h4>
    </div>
    <div class="card-body card-body-style-lb">
      <div class="chart-container">
        <Chart v-if="windowWidth > 600" />
        <ChartToSmall v-else />
      </div>
    </div>
  </div>
</template>

<style>
.left-card-style {
  height: 100%; /* 填滿父容器的高度 */
  width: 100%; /* 填滿父容器的寬度 */
  background-color: #fff; /* 白色背景 */
  border: 1px solid #ddd; /* 邊框 */
  border-radius: 10px; /* 圓角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  display: flex;
  flex-direction: column; /* 內容垂直排列 */
  box-sizing: border-box;
}

.card-body-style-lb {
  display: flex;
  width: 100%;
  height: 450px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

.chart-container {
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-header-text {
  margin-top: 5px;
  margin-bottom: 5px;
}

@media (max-width: 1300px) {
  .chart-container {
    width: 400px;
    height: 400px;
  }

  .card-body-style-lb {
    height: 300px;
  }
}

@media (max-width: 600px) {
  .chart-container {
    width: 200px;
    height: 200px;
  }
}
</style>