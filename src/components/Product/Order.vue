<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/order";
import PaginationMember from "../AppLayout/Pagination.vue";

const orderStore = useOrderStore();
const { orders, selectedIds } = storeToRefs(orderStore);

const loading = ref(true);
const selectAll = ref(false);

// 當前篩選狀態
const currentFilter = ref("全部");

const getOrderList = async () => {
  await orderStore.getOrdersList();
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
getOrderList();

// 全選或取消全選
const toggleSelectAll = () => {
  orders.value.forEach((item) => {
    item.isChecked = selectAll.value;
  });
  // 只取得已選成員的 ID
  selectedIds.value = orders.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};
// 檢查是否已全選
const checkIfAllSelected = (item) => {
  selectAll.value = orders.value.every((item) => item.isChecked);
  console.log("Selected Product: ", item);

  // 只取得已選成員的 ID
  selectedIds.value = orders.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};

// 分頁
const paginatedMembers = ref({});
const itemsPerPage = ref(5);
const currentPage = ref("");
const totalPages = ref("");
const getPaginatedMembers = (data) => {
  paginatedMembers.value = data;
};
const getCurrentPage = (data) => {
  currentPage.value = data;
};
const getTotalPages = (data) => {
  totalPages.value = data;
};

// 分頁控制，篩選後再分頁
const paginatedFilteredOrders = computed(() => {
  // 根據篩選條件過濾訂單
  const filtered = filteredOrders.value;

  // 計算起始索引
  const start = (currentPage.value - 1) * itemsPerPage.value;

  // 返回分頁後的訂單
  return filtered.slice(start, start + itemsPerPage.value);
});

// 根據篩選條件過濾訂單
const filteredOrders = computed(() => {
  if (currentFilter.value === "全部") {
    return orders.value.filter((order) => order.order_state !== "未下訂");
  }
  return orders.value.filter(
    (order) => order.order_state === currentFilter.value
  );
});

// 監聽篩選狀態的變化
watch(currentFilter, () => {
  // loading.value = true; // 在更新前設置 loading 狀態
  getOrderList(); // 重新獲取資料
});

const handleDeleteOrder = () => {
  const confirmation = confirm("確定要刪除嗎?");
  if (confirmation) {
    orderStore.deleteSelectedOrders();
  }
};

// 視窗 910px
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  // 視窗 910px
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="container mt-5">
    <div class="card text-center">
      <div class="card-header" style="position: relative">
        <div class="card-title-style">
          <h4 class="card-header-text" style="font-weight: 600">訂單</h4>
          <div class="float-end order-delete-btn-position">
            <button
              class="company-btn-style delete-user-btn"
              @click="handleDeleteOrder"
            >
              刪除
            </button>
          </div>
        </div>
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '全部' }"
              @click="currentFilter = '全部'"
            >
              全部
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '已收款' }"
              @click="currentFilter = '已收款'"
            >
              已收款
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '待核款' }"
              @click="currentFilter = '待核款'"
            >
              待核款
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '已完成' }"
              @click="currentFilter = '已完成'"
            >
              已完成
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '取消訂單' }"
              @click="currentFilter = '取消訂單'"
            >
              取消訂單
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <table
          class="table table-bordered order-table"
          v-if="windowWidth > 930"
        >
          <thead>
            <tr>
              <th width="7%" class="text-center">編號</th>
              <th width="20%" class="text-center">訂單編號</th>
              <th width="15%" class="text-center">訂單會員帳號</th>
              <!-- <th width="10%" class="text-center">訂單會員名稱</th> -->
              <th width="10%" class="text-center">訂單價格</th>
              <th width="10%" class="text-center">訂單狀態</th>
              <th width="10%" class="text-center">付款方式</th>
              <th width="13%" class="text-center">下訂時間</th>
              <!-- <th width="10%" class="text-center">更新時間</th> -->
              <th width="8%" class="text-center">查看</th>
              <th width="7%" class="text-center">
                <div class="checkbox-title-style">
                  全選
                  <input
                    type="checkbox"
                    style="margin-left: 5px"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading && paginatedFilteredOrders.length > 0">
            <tr
              v-for="(order, index) in paginatedFilteredOrders"
              :key="index"
              style="height: 50px"
            >
              <td class="text-center align-middle">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="text-center align-middle">{{ order.order_number }}</td>
              <td class="text-center align-middle">
                {{ order.member_account }}
              </td>
              <!-- <td class="text-center align-middle">{{ order.member_name }}</td> -->
              <td class="text-center align-middle">
                NT. ${{ order.order_total }}
              </td>
              <td class="text-center align-middle">{{ order.order_state }}</td>
              <td class="text-center align-middle">{{ order.order_pay }}</td>
              <td class="text-center align-middle">{{ order.create_at }}</td>
              <!-- <td class="text-center align-middle">{{ order.update_at }}</td> -->
              <td class="text-center align-middle">
                <RouterLink
                  :to="{ path: 'order/' + order.id + '/data' }"
                  class="edit-btn-style add-user-btn"
                >
                  查看
                </RouterLink>
              </td>
              <td class="text-center align-middle">
                <input
                  type="checkbox"
                  v-model="order.isChecked"
                  @change="checkIfAllSelected(order)"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="11" class="text-center align-middle">Loading</td>
            </tr>
          </tbody>
        </table>

        <!-- 卡片呈現方式 -->
        <div
          class="card-list col-12"
          v-else-if="!paginatedFilteredOrders.length"
        >
          <div class="order-cardto910">
            <p class="member-cardlist-item d-flex justify-content-center">
              <strong>無資料</strong>
            </p>
          </div>
        </div>

        <!-- 卡片呈現方式 -->
        <div class="card-list col-12" v-else>
          <div
            class="order-cardto910"
            v-for="(order, index) in paginatedMembers"
            :key="index"
          >
            <p class="member-cardlist-item">
              <strong>訂單編號:</strong> {{ order.order_number }}
            </p>
            <p class="member-cardlist-item">
              <strong>訂單會員帳號:</strong>{{ order.member_account }}
            </p>
            <p class="member-cardlist-item">
              <strong>訂單價格:</strong>NT. ${{ order.order_total }}
            </p>
            <p class="member-cardlist-item">
              <strong>訂單狀態:</strong>{{ order.order_state }}
            </p>
            <p class="member-cardlist-item">
              <strong>下訂時間:</strong>{{ order.create_at }}
            </p>
            <p class="member-cardlist-item">
              <strong>查看:</strong
              ><RouterLink
                :to="{ path: 'order/' + order.id + '/data' }"
                class="edit-btn-style add-user-btn"
              >
                查看
              </RouterLink>
              <input
                type="checkbox"
                v-model="order.isChecked"
                @change="checkIfAllSelected(order)"
                class="ms-auto"
              />
            </p>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="filteredOrders"
          :itemsPerPage="itemsPerPage"
          @paginatedMembers="getPaginatedMembers"
          @currentPage="getCurrentPage"
          @totalPages="getTotalPages"
        />
      </div>
    </div>
  </div>
</template>

<style>
.order-cardto910 {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.order-cardto910 p {
  margin: 0.5rem 0;
  padding-bottom: 10px; /* 增加底部內邊距 */
  border-bottom: 1px solid #ddd; /* 為每個 p 元素添加底部邊框 */
}

.order-cardto910 p:last-child {
  border-bottom: none; /* 最後一個 p 元素去掉底部邊框 */
}

.product-img-910 {
  position: absolute;
  top: 10px; /* 根據需求調整圖片的垂直位置 */
  right: 20px; /* 將圖片固定在右側 */
  object-fit: cover; /* 確保圖片比例 */
  border-radius: 4px;

  display: inline-block;
  background: white;
  padding: 3px;
  z-index: 1;
}

.order-delete-btn-position {
  position: absolute;
  bottom: 10%;
  right: 1%;
}

.card-header-text {
  margin-top: 5px;
  margin-bottom: 5px;
}

@media (max-width: 1350px) {
  /* .order-table thead th:nth-child(2),
  .order-table tbody td:nth-child(2) {
    width: 10%;
  }

  .order-table thead th:nth-child(8),
  .order-table tbody td:nth-child(8) {
    width: 6%;
  } */
}

@media (max-width: 1250px) {
  .order-table thead th:nth-child(2),
  .order-table tbody td:nth-child(2) {
    width: 18%;
  }

  .order-table thead th:nth-child(9),
  .order-table tbody td:nth-child(9) {
    width: 9%;
  }
}

@media (max-width: 1200px) {
  .order-table thead th:nth-child(6),
  .order-table tbody td:nth-child(6),
  .order-table thead th:nth-child(7),
  .order-table tbody td:nth-child(7) {
    display: none;
  }
}

@media (max-width: 1000px) {
  .order-table thead th:nth-child(4),
  .order-table tbody td:nth-child(4),
  .order-table thead th:nth-child(5),
  .order-table tbody td:nth-child(5) {
    width: 12%;
  }

  .order-table thead th:nth-child(2),
  .order-table tbody td:nth-child(2) {
    width: 14%;
  }
}

@media (max-width: 600px) {
  .order-delete-btn-position {
    bottom: 45%;
  }
}

@media (max-width: 540px) {
  .order-delete-btn-position {
    bottom: 50%;
  }
}
</style>