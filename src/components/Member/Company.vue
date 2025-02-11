<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";
import PaginationMember from "../AppLayout/Pagination.vue";

const userStore = useUserStore();

const { companyMember, user_data, selectedIds } = storeToRefs(userStore);

const loading = ref(true);
const selectAll = ref(false); // 用於控制「全選」狀態

// 視窗 768px
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
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

// 全選或取消全選
const toggleSelectAll = () => {
  companyMember.value.forEach((member) => {
    if (member.permissions !== "老闆") {
      member.isChecked = selectAll.value;
    }
  });

  // 只取得已選成員的 ID
  selectedIds.value = companyMember.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.id); // 取得已選成員的 id

  console.log("Selected Member IDs: ", selectedIds);
};

const checkIfAllSelected = (member) => {
  selectAll.value = companyMember.value.every(
    (member) => member.isChecked || member.permissions === "老闆"
  );
  console.log("Selected Member: ", member);

  // 只取得已選成員的 ID
  selectedIds.value = companyMember.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.id); // 取得已選成員的 id

  console.log("Selected Member IDs: ", selectedIds);
};

const getCompanyMemberData = async () => {
  // 等待 userStore 的資料加載完成
  await userStore.getCompanyMemberData();

  // 延遲 0.5 秒後顯示資料
  setTimeout(() => {
    loading.value = false;
  }, 500);
  console.log("companyMember:", companyMember.value.length);
};

onMounted(() => {
  getCompanyMemberData();
  console.log(companyMember.value);
  // 視窗 768px
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

const saveHandle = async (userId, permissions) => {
  await userStore.updateUserPermissions(userId, permissions);
};

const deleteUser = () => {
  const confirmation = confirm("確定要刪除嗎?");
  if (confirmation) {
    userStore.deleteSelectedMembers();
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title-style">
          <h4 class="mt-3" style="font-weight: 600">公司人員</h4>
          <div class="float-end">
            <RouterLink
              to="/company/create"
              class="company-btn-style add-user-btn"
              style="margin-right: 6px"
              v-if="user_data.permissions !== '員工'"
              >新增人員</RouterLink
            >
            <button
              class="company-btn-style delete-user-btn"
              v-if="user_data.permissions === '老闆'"
              @click="deleteUser"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <table
          class="table table-bordered company-table"
          v-if="windowWidth > 930"
        >
          <thead>
            <tr>
              <th width="5%" class="text-center">編號</th>
              <th width="15%" class="text-center">使用者名稱</th>
              <th
                width="15%"
                class="text-center"
                v-if="user_data.permissions === '老闆'"
              >
                使用者帳號
              </th>
              <th width="15%" class="text-center">電子郵件</th>
              <th width="10%" class="text-center">職位</th>
              <th width="10%" class="text-center">建立時間</th>
              <th width="10%" class="text-center">更新時間</th>
              <th
                width="10%"
                class="text-center"
                v-if="user_data.permissions !== '員工'"
              >
                修改
              </th>
              <th
                width="7%"
                class="text-center"
                v-if="user_data.permissions === '老闆'"
              >
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
          <tbody v-if="!loading && paginatedMembers.length > 0">
            <tr v-for="(item, index) in paginatedMembers" :key="index">
              <td class="text-center align-middle" data-label="編號">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="text-center align-middle" data-label="使用者名稱">
                {{ item.username }}
              </td>
              <td
                class="text-center align-middle"
                data-label="使用者帳號"
                v-if="user_data.permissions === '老闆'"
              >
                {{ item.user_account }}
              </td>
              <td class="text-center align-middle" data-label="電子郵件">
                {{ item.user_email }}
              </td>
              <td class="text-center align-middle" data-label="職位">
                <template v-if="user_data.permissions !== '老闆'">
                  <select
                    v-model="item.permissions"
                    class="form-select"
                    aria-label="Default select example"
                    :disabled="user_data.permissions !== '老闆'"
                  >
                    <option selected disabled>請選擇</option>
                    <option value="老闆">老闆</option>
                    <option value="主管">主管</option>
                    <option value="員工">員工</option>
                    <option value="關閉">關閉</option>
                  </select>
                </template>
                <template v-else>
                  <select
                    v-model="item.permissions"
                    class="form-select"
                    aria-label="Default select example"
                    :disabled="
                      user_data.permissions === '老闆' &&
                      item.username === user_data.username
                    "
                  >
                    <option selected disabled>請選擇</option>
                    <option
                      value="老闆"
                      v-if="user_data.permissions === item.permissions"
                    >
                      老闆
                    </option>
                    <option value="主管">主管</option>
                    <option value="員工">員工</option>
                    <option value="關閉">關閉</option>
                  </select>
                </template>
              </td>
              <td class="text-center align-middle" data-label="建立時間">
                {{ item.create_at }}
              </td>
              <td class="text-center align-middle" data-label="更新時間">
                {{ item.update_at }}
              </td>
              <td
                class="text-center align-middle"
                v-if="user_data.permissions !== '員工'"
                data-label="修改"
              >
                <div class="company-button-container">
                  <!-- class="middle-style" -->
                  <RouterLink
                    v-if="!(item.permissions === '老闆')"
                    :to="{ path: 'company/' + item.id + '/update' }"
                    class="edit-btn-style add-user-btn company-button-gap"
                    >修改</RouterLink
                  >
                  <RouterLink
                    v-else-if="user_data.permissions === '老闆'"
                    :to="{ path: 'company/' + item.id + '/update' }"
                    class="edit-btn-style add-user-btn company-button-gap"
                    >修改</RouterLink
                  >
                  <button
                    v-else
                    class="edit-btn-style add-user-btn company-button-gap"
                    disabled
                  >
                    修改
                  </button>
                  <button
                    class="edit-btn-style add-user-btn"
                    v-if="
                      user_data.permissions === '老闆' &&
                      item.permissions !== '老闆'
                    "
                    @click="saveHandle(item.userId, item.permissions)"
                  >
                    儲存
                  </button>
                </div>
              </td>
              <td
                class="text-center align-middle"
                v-if="user_data.permissions === '老闆'"
              >
                <input
                  type="checkbox"
                  v-model="item.isChecked"
                  @change="checkIfAllSelected(item)"
                  :disabled="item.permissions === '老闆'"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="9" class="text-center align-middle">Loading</td>
            </tr>
          </tbody>
        </table>

        <!-- 卡片呈現方式 -->
        <div class="card-list" v-else>
          <div
            class="company-cardto768"
            v-for="(item, index) in paginatedMembers"
            :key="index"
          >
            <p class="company-cardlist-item">
              <strong>使用者名稱:</strong> {{ item.username }}
            </p>
            <p class="company-cardlist-item">
              <strong>電子郵件:</strong> {{ item.user_email }}
            </p>
            <p class="company-cardlist-item d-flex">
              <strong class="horizontal-text">職位:</strong>
              <template v-if="user_data.permissions !== '老闆'">
                <select
                  v-model="item.permissions"
                  class="form-select"
                  aria-label="Default select example"
                  :disabled="user_data.permissions !== '老闆'"
                >
                  <option selected disabled>請選擇</option>
                  <option value="老闆">老闆</option>
                  <option value="主管">主管</option>
                  <option value="員工">員工</option>
                  <option value="關閉">關閉</option>
                </select>
              </template>
              <template v-else>
                <select
                  v-model="item.permissions"
                  class="form-select"
                  aria-label="Default select example"
                  :disabled="
                    user_data.permissions === '老闆' &&
                    item.username === user_data.username
                  "
                >
                  <option selected disabled>請選擇</option>
                  <option
                    value="老闆"
                    v-if="user_data.permissions === item.permissions"
                  >
                    老闆
                  </option>
                  <option value="主管">主管</option>
                  <option value="員工">員工</option>
                  <option value="關閉">關閉</option>
                </select>
              </template>
            </p>
            <p class="company-cardlist-item">
              <strong>建立時間:</strong> {{ item.create_at }}
            </p>
            <p class="company-cardlist-item">
              <strong>更新時間:</strong> {{ item.update_at }}
            </p>
            <p class="company-cardlist-item align-items-center">
              <strong>修改:</strong>
              <RouterLink
                v-if="!(item.permissions === '老闆')"
                :to="{ path: 'company/' + item.id + '/update' }"
                class="edit-btn-style add-user-btn"
                >修改</RouterLink
              >
              <RouterLink
                v-else-if="user_data.permissions === '老闆'"
                :to="{ path: 'company/' + item.id + '/update' }"
                class="edit-btn-style add-user-btn"
                >修改</RouterLink
              >
              <button v-else class="edit-btn-style add-user-btn" disabled>
                修改
              </button>
              <button
                class="edit-btn-style add-user-btn"
                v-if="
                  user_data.permissions === '老闆' &&
                  item.permissions !== '老闆'
                "
                @click="saveHandle(item.userId, item.permissions)"
              >
                儲存
              </button>
              <template v-if="user_data.permissions === '老闆'">
                <div class="ms-auto">
                  <input
                    type="checkbox"
                    v-model="item.isChecked"
                    @change="checkIfAllSelected(item)"
                    :disabled="item.permissions === '老闆'"
                  /></div
              ></template>
            </p>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="companyMember"
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
.card-title-style {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-title-style {
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-btn-style {
  border-radius: 4px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.add-user-btn {
  border: 1px solid #6c6c6c;
  color: #272727;
  background-color: #ffffff;
  font-weight: 900;
  font-size: 12px;
  white-space: nowrap; /* 禁止文字換行 */
  text-align: center;
}

.add-user-btn:hover {
  color: #ffffff;
  background-color: #272727;
}

.add-user-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-user-btn {
  border: none;
  color: #ffffff;
  background-color: #e6367e;
  font-weight: 900;
  font-size: 12px;
}

.delete-user-btn:hover {
  opacity: 0.8;
}

.edit-btn-style {
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
  text-decoration: none;
  height: 32px;
}

.middle-style {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-list {
  display: grid;
  /* grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); */
  gap: 20px;
  padding: 20px;
}

.company-cardto768 {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.company-cardto768 p {
  margin: 0.5rem 0;
  padding-bottom: 10px; /* 增加底部內邊距 */
  border-bottom: 1px solid #ddd; /* 為每個 p 元素添加底部邊框 */
}

.company-cardto768 p:last-child {
  border-bottom: none; /* 最後一個 p 元素去掉底部邊框 */
}

.company-cardlist-item {
  border: 1px solid #f9f9f9; /* 邊框顏色和樣式 */
  padding: 10px; /* 內邊距 */
  margin-bottom: 10px; /* 每個 p 元素之間的間距 */
  background-color: #fff; /* 可選，背景顏色 */

  display: flex;
  align-items: center; /* 垂直居中對齊內容 */
  gap: 10px; /* 在職位標籤和選擇框之間添加間隔 */
}

.horizontal-text {
  white-space: nowrap; /* 防止文字換行 */
  writing-mode: unset; /* 確保文字水平方向 */
}

.company-button-gap {
  margin-inline-end: 8px;
}

@media (max-width: 1500px) {
  .company-table thead th:nth-child(1),
  .company-table tbody td:nth-child(1) {
    width: 5%; /* 第一列的寬度調整為 5% */
  }

  .company-table thead th:nth-child(2),
  .company-table tbody td:nth-child(2) {
    width: 10%;
  }

  .company-table thead th:nth-child(3),
  .company-table tbody td:nth-child(3) {
    width: 10%;
  }

  .company-table thead th:nth-child(4),
  .company-table tbody td:nth-child(4) {
    width: 10%;
  }
}

@media (max-width: 1250px) {
  .company-table thead th:nth-child(2),
  .company-table tbody td:nth-child(2) {
    width: 12%;
  }

  .company-table thead th:nth-child(3),
  .company-table tbody td:nth-child(3) {
    width: 12%;
  }

  .company-table thead th:nth-child(4),
  .company-table tbody td:nth-child(4) {
    display: none; /* 隱藏第4欄 */
  }

  .company-table thead th:nth-child(6),
  .company-table tbody td:nth-child(6) {
    display: none;
  }

  .company-table thead th:nth-child(7),
  .company-table tbody td:nth-child(7) {
    display: none;
  }

  .company-table thead th:nth-child(8),
  .company-table tbody td:nth-child(8) {
    width: 8%;
  }

  .company-table thead th:nth-child(9),
  .company-table tbody td:nth-child(9) {
    width: 5%;
  }
}

@media (max-width: 991px) {
  .company-button-gap {
    margin-inline-end: 0px;
  }

  .company-button-container {
    display: flex;
    flex-direction: column; /* 让按钮垂直排列 */
    gap: 10px; /* 按钮之间的间距 */
  }
}

@media (max-width: 945px) {
  /* .company-table thead th:nth-child(1),
  .company-table tbody td:nth-child(1) {
    width: 5%;
  }

  .company-table thead th:nth-child(2),
  .company-table tbody td:nth-child(2) {
    width: 5%;
  }

  .company-table thead th:nth-child(3),
  .company-table tbody td:nth-child(3) {
    width: 5%;
  }

  .company-table thead th:nth-child(4),
  .company-table tbody td:nth-child(4) {
    width: 10%;
  } */
}
</style>