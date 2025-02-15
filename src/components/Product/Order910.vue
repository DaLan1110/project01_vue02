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
  <div class="card-body">
    <table class="table table-bordered order-table">
      <thead>
        <tr>
          <th width="5%" class="text-center">編號</th>
          <th width="14%" class="text-center">訂單編號</th>
          <th width="10%" class="text-center">訂單會員帳號</th>
          <th width="10%" class="text-center">訂單會員名稱</th>
          <th width="10%" class="text-center">訂單價格</th>
          <th width="10%" class="text-center">訂單狀態</th>
          <th width="10%" class="text-center">付款方式</th>
          <th width="10%" class="text-center">下訂時間</th>
          <th width="10%" class="text-center">更新時間</th>
          <th width="6%" class="text-center">查看</th>
          <th width="5%" class="text-center">
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
          <td class="text-center align-middle">{{ order.member_name }}</td>
          <td class="text-center align-middle">NT. ${{ order.order_total }}</td>
          <td class="text-center align-middle">{{ order.order_state }}</td>
          <td class="text-center align-middle">{{ order.order_pay }}</td>
          <td class="text-center align-middle">{{ order.create_at }}</td>
          <td class="text-center align-middle">{{ order.update_at }}</td>
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

    <!-- 分頁控制 -->
    <PaginationMember
      :dataPage="filteredOrders"
      :itemsPerPage="itemsPerPage"
      @paginatedMembers="getPaginatedMembers"
      @currentPage="getCurrentPage"
      @totalPages="getTotalPages"
    />
  </div>
</template>

<style>
@media (max-width: 1350px) {
  .order-table thead th:nth-child(2),
  .order-table tbody td:nth-child(2) {
    width: 10%;
  }

  .order-table thead th:nth-child(11),
  .order-table tbody td:nth-child(11) {
    width: 6%;
  }
}

@media (max-width: 1310px) {
  .order-table thead th:nth-child(4),
  .order-table tbody td:nth-child(4) {
    width: 8%;
  }

  .order-table thead th:nth-child(5),
  .order-table tbody td:nth-child(5) {
    width: 8%;
  }

  .order-table thead th:nth-child(6),
  .order-table tbody td:nth-child(6) {
    width: 8%;
  }

  .order-table thead th:nth-child(7),
  .order-table tbody td:nth-child(7) {
    width: 8%;
  }

  .order-table thead th:nth-child(8),
  .order-table tbody td:nth-child(8) {
    width: 8%;
  }

  .order-table thead th:nth-child(9),
  .order-table tbody td:nth-child(9) {
    width: 8%;
  }
}

@media (max-width: 1200px) {
  .order-table thead th:nth-child(4),
  .order-table tbody td:nth-child(4),
  .order-table thead th:nth-child(7),
  .order-table tbody td:nth-child(7),
  .order-table thead th:nth-child(9),
  .order-table tbody td:nth-child(9) {
    display: none;
  }

  .order-table thead th:nth-child(11),
  .order-table tbody td:nth-child(11) {
    width: 3%;
  }
}

@media (max-width: 1000px) {
  .order-table thead th:nth-child(2),
  .order-table tbody td:nth-child(2),
  .order-table thead th:nth-child(3),
  .order-table tbody td:nth-child(3) {
    width: 6%;
  }

  .order-table thead th:nth-child(6),
  .order-table tbody td:nth-child(6) {
    width: 6%;
  }

  .order-table thead th:nth-child(11),
  .order-table tbody td:nth-child(11) {
    width: 3%;
  }
}
</style>