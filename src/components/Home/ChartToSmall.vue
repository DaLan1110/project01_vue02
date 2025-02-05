<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/order";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 註冊 Chart.js 必需的模組
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

const orderStore = useOrderStore();
const { hotProductToFiveName, hotProductToFiveCount } = storeToRefs(orderStore);

// 定義圖表數據和選項
const chartData = ref({
  labels: ["1"],
  datasets: [
    {
      data: [1],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true, // 保持寬高比例
  plugins: {
    legend: {
      display: false, // 關閉右側圖例
    },
    tooltip: {
      enabled: true, // 啟用工具提示
      callbacks: {
        label: (tooltipItem) => {
          const value = tooltipItem.raw; // 獲取數值
          const label = tooltipItem.label; // 獲取標籤
          const dataset = tooltipItem.dataset; // 獲取數據集
          const total = dataset.data.reduce((sum, current) => sum + current, 0); // 總和
          const percentage = ((value / total) * 100).toFixed(2); // 計算百分比

          return `${label}: ${value} (${percentage}%)`; // 自訂提示文字
        },
      },
    },
    datalabels: {
      color: "#fff", // 文字顏色
      font: {
        size: 14, // 文字大小
        weight: "bold",
      },
      align: "center", // 置中
      formatter: (value, context) => {
        const label = context.chart.data.labels[context.dataIndex];
        const total = context.chart.data.datasets[0].data.reduce(
          (sum, val) => sum + val,
          0
        );
        const percentage = ((value / total) * 100).toFixed(1); // 計算百分比
        return `${label}\n${value} (${percentage}%)`; // 顯示名稱、數量和百分比
      },
    },
  },
});

const getHotProduct = async () => {
  try {
    await orderStore.getHotProduct();

    // 組合數據以便排序
    const combinedData = hotProductToFiveName.value.map((name, index) => ({
      name,
      count: hotProductToFiveCount.value[index],
    }));

    // 按照數量降序排序
    combinedData.sort((a, b) => b.count - a.count);

    // 更新 chartData 的值
    chartData.value = {
      labels: hotProductToFiveName.value,
      datasets: [
        {
          data: hotProductToFiveCount.value,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };

    // 更新圖例文字
    // chartOptions.value.plugins.legend.labels.generateLabels = (chart) => {
    //   const dataset = chart.data.datasets[0];
    //   const total = dataset.data.reduce((sum, current) => sum + current, 0);

    //   return chart.data.labels.map((label, index) => {
    //     const value = dataset.data[index];
    //     const percentage = ((value / total) * 100).toFixed(2); // 百分比，保留 2 位小數

    //     return {
    //       text: `${index + 1}. ${label} : ${value}  (${percentage}%)`,
    //       fillStyle: dataset.backgroundColor[index],
    //     };
    //   });
    // };
  } catch (error) {
    console.error("Error fetching hot products: ", error);
  }
};
getHotProduct();
</script>

<template>
  <Doughnut id="myChart" :data="chartData" :options="chartOptions" />
</template>

<style>
</style>