<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useJoinStore } from "@/stores/join";
import PaginationMember from "../AppLayout/Pagination.vue";

const joinStore = useJoinStore();
const { joins, selectedIds } = storeToRefs(joinStore);

const loading = ref(true);
const selectAll = ref(false);

// 當前篩選狀態
const currentFilter = ref("加盟");

const getJoinsList = async () => {
  await joinStore.getJoinsList();
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
getJoinsList();

// 根據篩選條件過濾訂單
const filteredJoins = computed(() => {
  if (currentFilter.value === "加盟") {
    // 篩選出 join_us_permissions 為 "true" 的值
    return joins.value.filter((join) => join.join_us_permissions === "true");
  }
  if (currentFilter.value === "加盟申請") {
    // 篩選出 join_us_permissions 為 "false" 的值
    return joins.value.filter((join) => join.join_us_permissions === "false");
  }
  // 預設返回所有資料
  return joins.value;
});

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
const paginatedFilteredJoins = computed(() => {
  // 根據篩選條件過濾訂單
  const filtered = filteredJoins.value;

  // 計算起始索引
  const start = (currentPage.value - 1) * itemsPerPage.value;

  // 返回分頁後的訂單
  return filtered.slice(start, start + itemsPerPage.value);
});

// 監聽篩選狀態的變化
watch(currentFilter, () => {
  // loading.value = true; // 在更新前設置 loading 狀態
  getJoinsList(); // 重新獲取資料
});

// 全選或取消全選
const toggleSelectAll = () => {
  joins.value.forEach((item) => {
    item.isChecked = selectAll.value;
  });
  // 只取得已選成員的 ID
  selectedIds.value = joins.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};
// 檢查是否已全選
const checkIfAllSelected = (item) => {
  selectAll.value = joins.value.every((item) => item.isChecked);
  console.log("Selected Product: ", item);

  // 只取得已選成員的 ID
  selectedIds.value = joins.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};

const handleDeleteMoreJoin = async () => {
  const confirmation = confirm("確定要刪除嗎?");
  if (confirmation) {
    await joinStore.deleteSelectedJoins();

    // 檢查當前分頁資料數量
    const currentDataCount = paginatedFilteredJoins.value.length;

    // 如果刪除後當前分頁沒有資料且不是第一頁，跳到前一頁
    if (currentDataCount === 0 && currentPage.value > 1) {
      currentPage.value -= 1; // 跳到前一頁
    }
  }
};

const handleDeleteJoin = async (id) => {
  const confirmation = confirm("確定要取消嗎?");
  if (confirmation) {
    await joinStore.deleteOneJoin(id);

    // 檢查當前分頁資料數量
    const currentDataCount = paginatedFilteredJoins.value.length;

    // 如果刪除後當前分頁沒有資料且不是第一頁，跳到前一頁
    if (currentDataCount === 0 && currentPage.value > 1) {
      currentPage.value -= 1; // 跳到前一頁
    }
  }
};

const handleJoin = (id) => {
  const confirmation = confirm("確定要加盟嗎?");
  if (confirmation) {
    joinStore.updateJoinState(id);
  }
};

// 視窗 991px
const isSmallScreen = ref(window.innerWidth < 992);
const isSoSmallScreen = ref(window.innerWidth < 768);
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
  isSmallScreen.value = window.innerWidth < 992;
  isSoSmallScreen.value = window.innerWidth < 768;
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
  <div class="mt-5" :class="[isSmallScreen ? 'container-fluid' : 'container']">
    <div class="card text-center">
      <div class="card-header" style="position: relative">
        <div class="card-title-style">
          <h4 class="mt-3" style="font-weight: 600">加盟</h4>
          <div
            class="float-end"
            style="position: absolute; bottom: 10%; right: 1%"
          >
            <button
              class="company-btn-style delete-user-btn"
              @click="handleDeleteMoreJoin"
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
              :class="{ active: currentFilter === '加盟' }"
              @click="currentFilter = '加盟'"
            >
              加盟
            </button>
          </li>
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn"
              :class="{ active: currentFilter === '加盟申請' }"
              @click="currentFilter = '加盟申請'"
            >
              加盟申請
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <table
          class="table table-bordered join-1-table"
          v-if="currentFilter === '加盟' && windowWidth > 768"
        >
          <thead>
            <tr>
              <th width="5%" class="text-center">編號</th>
              <th width="10%" class="text-center">姓名</th>
              <th width="10%" class="text-center">電話</th>
              <th width="15%" class="text-center">電子郵件</th>
              <th width="35%" class="text-center">地址</th>
              <th width="10%" class="text-center">建立時間</th>
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
          <tbody v-if="!loading && paginatedFilteredJoins.length > 0">
            <tr
              v-for="(join, index) in paginatedFilteredJoins"
              :key="index"
              style="height: 50px"
            >
              <td class="text-center align-middle">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="text-center align-middle">{{ join.join_us_name }}</td>
              <td class="text-center align-middle">{{ join.join_us_phone }}</td>
              <td class="text-center align-middle">{{ join.join_us_email }}</td>
              <td class="text-center align-middle">
                {{ join.join_us_address }}
              </td>
              <td class="text-center align-middle">{{ join.create_at }}</td>
              <td class="text-center align-middle">
                <RouterLink
                  :to="{ path: 'address/' + join.id + '/data' }"
                  class="edit-btn-style add-user-btn"
                >
                  查看
                </RouterLink>
              </td>
              <td class="text-center align-middle">
                <input
                  type="checkbox"
                  v-model="join.isChecked"
                  @change="checkIfAllSelected(join)"
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
          v-else-if="currentFilter === '加盟' && windowWidth <= 768"
        >
          <div v-if="paginatedFilteredJoins.length > 0">
            <div
              class="order-cardto910 mt-4"
              v-for="(join, index) in paginatedFilteredJoins"
              :key="index"
            >
              <p class="member-cardlist-item">
                <strong>姓名:</strong>{{ join.join_us_name }}
              </p>
              <p class="member-cardlist-item">
                <strong>電話:</strong>{{ join.join_us_phone }}
              </p>
              <p class="member-cardlist-item">
                <strong>電子郵件:</strong>{{ join.join_us_email }}
              </p>
              <p class="member-cardlist-item">
                <strong>地址:</strong>{{ join.join_us_address }}
              </p>
              <p class="member-cardlist-item">
                <strong>建立時間:</strong>{{ join.create_at }}
              </p>
              <p class="member-cardlist-item">
                <strong>查看:</strong>
                <RouterLink
                  :to="{ path: 'address/' + join.id + '/data' }"
                  class="edit-btn-style add-user-btn"
                >
                  查看
                </RouterLink>
                <input
                  type="checkbox"
                  v-model="join.isChecked"
                  @change="checkIfAllSelected(join)"
                  class="ms-auto"
                />
              </p>
            </div>
          </div>
          <div v-else>
            <div class="order-cardto910">
              <p class="member-cardlist-item d-flex justify-content-center">
                <strong>無資料</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- 加盟申請 -->
        <table
          class="table table-bordered join-2-table"
          v-if="currentFilter === '加盟申請' && windowWidth > 768"
        >
          <thead>
            <tr>
              <th width="5%" class="text-center">編號</th>
              <th width="10%" class="text-center">姓名</th>
              <th width="10%" class="text-center">電話</th>
              <th width="15%" class="text-center">電子郵件</th>
              <th width="35%" class="text-center">地址</th>
              <th width="10%" class="text-center">申請時間</th>
              <th width="15%" class="text-center">申請</th>
            </tr>
          </thead>
          <tbody v-if="!loading && paginatedFilteredJoins.length > 0">
            <tr
              v-for="(join, index) in paginatedFilteredJoins"
              :key="index"
              style="height: 50px"
            >
              <td class="text-center align-middle">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="text-center align-middle">{{ join.join_us_name }}</td>
              <td class="text-center align-middle">{{ join.join_us_phone }}</td>
              <td class="text-center align-middle">{{ join.join_us_email }}</td>
              <td class="text-center align-middle">
                {{ join.join_us_address }}
              </td>
              <td class="text-center align-middle">{{ join.create_at }}</td>
              <td class="text-center align-middle">
                <!-- <RouterLink to="#" class="edit-btn-style add-user-btn">
                  同意
                </RouterLink> -->
                <button
                  class="edit-btn-style add-user-btn ms-2"
                  @click="handleJoin(join.id)"
                >
                  同意
                </button>
                <button
                  class="edit-btn-style add-user-btn ms-2 mt-2"
                  :class="[]"
                  @click="handleDeleteJoin(join.id)"
                >
                  取消
                </button>
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
          v-else-if="currentFilter === '加盟申請' && windowWidth <= 768"
        >
          <div v-if="paginatedFilteredJoins.length > 0">
            <div
              class="order-cardto910 mt-4"
              v-for="(join, index) in paginatedFilteredJoins"
              :key="index"
            >
              <p class="member-cardlist-item">
                <strong>姓名:</strong>{{ join.join_us_name }}
              </p>
              <p class="member-cardlist-item">
                <strong>電話:</strong>{{ join.join_us_phone }}
              </p>
              <p class="member-cardlist-item">
                <strong>電子郵件:</strong>{{ join.join_us_email }}
              </p>
              <p class="member-cardlist-item">
                <strong>地址:</strong>{{ join.join_us_address }}
              </p>
              <p class="member-cardlist-item">
                <strong>申請時間:</strong>{{ join.create_at }}
              </p>
              <p class="member-cardlist-item">
                <strong>申請:</strong>
                <button
                  class="edit-btn-style add-user-btn ms-2"
                  @click="handleJoin(join.id)"
                >
                  同意
                </button>
                <button
                  class="edit-btn-style add-user-btn"
                  :class="[]"
                  @click="handleDeleteJoin(join.id)"
                >
                  取消
                </button>
              </p>
            </div>
          </div>
          <div v-else>
            <div class="order-cardto910">
              <p class="member-cardlist-item d-flex justify-content-center">
                <strong>無資料</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="filteredJoins"
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

@media (max-width: 1400px) {
  /* join-1-table */
  /* .join-1-table thead th:nth-child(5),
  .join-1-table tbody td:nth-child(5) {
    width: 37%;
  }

  .join-1-table thead th:nth-child(7),
  .join-1-table tbody td:nth-child(7) {
    width: 7%;
  }

  .join-1-table thead th:nth-child(8),
  .join-1-table tbody td:nth-child(8) {
    width: 6%;
  } */

  /* join-2-table */
  /* .join-2-table thead th:nth-child(5),
  .join-2-table tbody td:nth-child(5) {
    width: 37%;
  }

  .join-2-table thead th:nth-child(7),
  .join-2-table tbody td:nth-child(7) {
    width: 13%;
  } */
}

@media (max-width: 1300px) {
  /* join-1-table */
  /* .join-1-table thead th:nth-child(5),
  .join-1-table tbody td:nth-child(5) {
    width: 35%;
  }

  .join-1-table thead th:nth-child(7),
  .join-1-table tbody td:nth-child(7) {
    width: 8%;
  }

  .join-1-table thead th:nth-child(8),
  .join-1-table tbody td:nth-child(8) {
    width: 7%;
  } */

  /* join-2-table */
  /* .join-2-table thead th:nth-child(5),
  .join-2-table tbody td:nth-child(5) {
    width: 35%;
  }

  .join-2-table thead th:nth-child(7),
  .join-2-table tbody td:nth-child(7) {
    width: 15%;
  } */
}

@media (max-width: 1250px) {
  .join-1-table thead th:nth-child(1),
  .join-1-table tbody td:nth-child(1) {
    width: 7%;
  }

  .join-1-table thead th:nth-child(5),
  .join-1-table tbody td:nth-child(5) {
    width: 30%;
  }

  .join-1-table thead th:nth-child(8),
  .join-1-table tbody td:nth-child(8) {
    width: 10%;
  }

  .join-2-table thead th:nth-child(1),
  .join-2-table tbody td:nth-child(1) {
    width: 7%;
  }

  .join-2-table thead th:nth-child(5),
  .join-2-table tbody td:nth-child(5) {
    width: 30%;
  }

  .join-2-table thead th:nth-child(7),
  .join-2-table tbody td:nth-child(7) {
    width: 18%;
  }
}

@media (max-width: 1230px) {
  /* join-1-table */
  .join-1-table thead th:nth-child(4),
  .join-1-table tbody td:nth-child(4) {
    display: none;
  }

  /* join-2-table */
  .join-1-table thead th:nth-child(4),
  .join-1-table tbody td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 1100px) {
  /* join-1-table */
  .join-1-table thead th:nth-child(1),
  .join-1-table tbody td:nth-child(1) {
    width: 6%;
  }

  .join-1-table thead th:nth-child(5),
  .join-1-table tbody td:nth-child(5) {
    width: 29%;
  }

  .join-1-table thead th:nth-child(6),
  .join-1-table tbody td:nth-child(6) {
    width: 11%;
  }

  .join-1-table thead th:nth-child(7),
  .join-1-table tbody td:nth-child(7) {
    width: 10%;
  }

  .join-1-table thead th:nth-child(8),
  .join-1-table tbody td:nth-child(8) {
    width: 9%;
  }

  /* join-2-table */
  .join-2-table thead th:nth-child(1),
  .join-2-table tbody td:nth-child(1) {
    width: 6%;
  }

  .join-2-table thead th:nth-child(5),
  .join-2-table tbody td:nth-child(5) {
    width: 29%;
  }

  .join-2-table thead th:nth-child(6),
  .join-2-table tbody td:nth-child(6) {
    width: 11%;
  }

  .join-2-table thead th:nth-child(7),
  .join-2-table tbody td:nth-child(7) {
    width: 19%;
  }
}

@media (max-width: 990px) {
  /* join-1-table */
  .join-1-table thead th:nth-child(4),
  .join-1-table tbody td:nth-child(4) {
    display: none;
  }

  /* join-2-table */
  .join-2-table thead th:nth-child(4),
  .join-2-table tbody td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 850px) {
  /* join-1-table */
  .join-1-table thead th:nth-child(3),
  .join-1-table tbody td:nth-child(3) {
    display: none;
  }

  /* join-2-table */
  .join-2-table thead th:nth-child(3),
  .join-2-table tbody td:nth-child(3) {
    display: none;
  }
}
</style>