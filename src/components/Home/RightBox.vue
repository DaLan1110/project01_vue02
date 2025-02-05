<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/order";

const orderStore = useOrderStore();
const { ordersToSix } = storeToRefs(orderStore);

// 監聽螢幕寬度
const screenWidth = ref(window.innerWidth);
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

// 根據螢幕寬度計算顯示的訂單
const filteredOrders = computed(() => {
  const maxOrders = screenWidth.value < 1300 ? 3 : 6;
  return ordersToSix.value.slice(0, maxOrders);
});

// 監聽螢幕大小變化
onMounted(() => {
  window.addEventListener("resize", updateScreenWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateScreenWidth);
});

const getOrderListToSix = () => {
  orderStore.getOrdersListToSix();
};
getOrderListToSix();
</script>

<template>
  <div class="card right-card-style">
    <div class="card-header">
      <h4 class="mt-3" style="font-weight: 600">最新訂單</h4>
    </div>
    <div class="card-body card-body-style-rb">
      <table class="table home-right-card-table mt-1">
        <thead>
          <tr>
            <th width="35%" class="text-center">訂單編號</th>
            <th width="25%" class="text-center">訂單價格</th>
            <th width="25%" class="text-center">訂單狀態</th>
            <th width="21%" class="text-center right-box-show">下訂時間</th>
            <th width="15%" class="text-center">查看</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="height: 50px"
            v-for="(order, index) in filteredOrders"
            :key="index"
          >
            <td class="text-center align-middle">{{ order.order_number }}</td>
            <td class="text-center align-middle">
              NT. ${{ order.order_total }}
            </td>
            <td class="text-center align-middle">{{ order.order_state }}</td>
            <td class="text-center align-middle right-box-show">
              {{ order.create_at }}
            </td>
            <td class="text-center align-middle">
              <RouterLink
                :to="{ path: 'order/' + order.id + '/data' }"
                class="edit-btn-style add-user-btn"
              >
                查看
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.right-card-style {
  height: 100%; /* 填滿父容器的高度 */
  width: 100%; /* 填滿父容器的寬度 */
  background-color: #fff; /* 白色背景 */
  border: 1px solid #ddd; /* 邊框 */
  border-radius: 10%; /* 圓角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  display: flex;
  flex-direction: column; /* 內容垂直排列 */
  box-sizing: border-box;
}

.home-right-card-table {
  border-collapse: collapse; /* 移除儲存格之間的間隙 */
  width: 100%; /* 表格寬度 */
}

.card-body-style-rb {
  width: 100%;
  height: 450px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.home-right-card-table thead th,
.home-right-card-table tbody td {
  border: none;
  /* border: 1px solid; */
  /* border-bottom: 1px solid #ddd; 僅保留下邊框 */
}

.home-right-card-table thead th {
  border-bottom: 2px solid #000; /* 表頭加粗下邊框 */
  text-align: center; /* 表頭文字置中（可選） */
}

.home-right-card-table tbody tr {
  border-bottom: 1px solid #ddd; /* 每一列添加下邊框 */
}

.home-right-card-table tr:last-child td {
  border-bottom: none; /* 最後一行移除下邊框 */
}

.right-box-show {
  display: none;
}

/* @media (max-width: 1400px) {
  .home-right-card-table thead th:nth-child(1),
  .home-right-card-table tbody td:nth-child(1) {
    width: 35%;
  }

  .home-right-card-table thead th:nth-child(2),
  .home-right-card-table tbody td:nth-child(2) {
    width: 25%;
  }

  .home-right-card-table thead th:nth-child(3),
  .home-right-card-table tbody td:nth-child(3) {
    width: 25%;
  }

  .home-right-card-table thead th:nth-child(4),
  .home-right-card-table tbody td:nth-child(4) {
    width: 15%;
  }
} */

@media (max-width: 1400px) {
  .home-right-card-table thead th:nth-child(1),
  .home-right-card-table tbody td:nth-child(1) {
    width: 30%;
  }

  .home-right-card-table thead th:nth-child(2),
  .home-right-card-table tbody td:nth-child(2) {
    width: 27%;
  }

  .home-right-card-table thead th:nth-child(3),
  .home-right-card-table tbody td:nth-child(3) {
    width: 28%;
  }

  .home-right-card-table thead th:nth-child(5),
  .home-right-card-table tbody td:nth-child(5) {
    width: 15%;
  }
}

@media (max-width: 1320px) {
  .home-right-card-table thead th:nth-child(1),
  .home-right-card-table tbody td:nth-child(1) {
    width: 32%;
  }

  .home-right-card-table thead th:nth-child(2),
  .home-right-card-table tbody td:nth-child(2) {
    width: 26%;
  }

  .home-right-card-table thead th:nth-child(3),
  .home-right-card-table tbody td:nth-child(3) {
    width: 27%;
  }

  .home-right-card-table thead th:nth-child(5),
  .home-right-card-table tbody td:nth-child(5) {
    width: 15%;
  }

  .card-body-style-rb table {
    table-layout: fixed;
    width: 100%;
    justify-content: flex-start;
    padding-top: 0;
  }
}

@media (max-width: 1300px) {
  .card-body-style-rb table {
    table-layout: fixed;
    width: 100%;
    justify-content: flex-start;
    padding-top: 0; /* 若有預設 padding，移除間距 */
  }
  .card-body-style-rb {
    height: 300px;
  }
}

@media (max-width: 1235px) {
  .home-right-card-table thead th:nth-child(2),
  .home-right-card-table tbody td:nth-child(2) {
    display: none;
  }
}

@media (max-width: 1150px) {
  .card-body-style-rb {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .right-box-show {
    display: table-cell;
  }
}
</style>