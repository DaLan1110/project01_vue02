<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/members";
import PaginationMember from "../AppLayout/Pagination.vue";

const memberStore = useMemberStore();
const { members, selectedIds, selectedMemberIds } = storeToRefs(memberStore);

const loading = ref(true);
const selectAll = ref(false); // 用於控制「全選」狀態

// 視窗 910px
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

// 取得所有
const getMemberData = async () => {
  await memberStore.getMemberData();
  // 延遲 0.5 秒後顯示資料
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

// 更新權限
const updateMemberPermissions = (id, permissions) => {
  memberStore.updateMemberPermissions(id, permissions);
};

// 全選或取消全選
const toggleSelectAll = () => {
  members.value.forEach((member) => {
    member.isChecked = selectAll.value;
  });
  // 只取得已選成員的 ID
  selectedIds.value = members.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.id); // 取得已選成員的 id

  // 只取得已選成員的 memberId
  selectedMemberIds.value = members.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.memberId); // 取得已選成員的 id

  console.log("Selected Member IDs: ", selectedIds);
  console.log("Selected MemberId IDs: ", selectedMemberIds);
};
// 檢查是否已全選
const checkIfAllSelected = (member) => {
  selectAll.value = members.value.every((member) => member.isChecked);
  console.log("Selected Member: ", member);

  // 只取得已選成員的 ID
  selectedIds.value = members.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.id); // 取得已選成員的 id

  // 只取得已選成員的 memberId
  selectedMemberIds.value = members.value
    .filter((member) => member.isChecked) // 篩選出已選中的成員
    .map((member) => member.memberId); // 取得已選成員的 id

  console.log("Selected Member IDs: ", selectedIds);
  console.log("Selected MemberId IDs: ", selectedMemberIds);
};

// 刪除會員
const deleteMember = () => {
  const confirmation = confirm("確定要刪除嗎?");
  if (confirmation) {
    memberStore.deleteSelectedMembers();
  }
};

onMounted(() => {
  getMemberData();
  // 視窗 910px
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title-style">
          <h4 class="mt-3" style="font-weight: 600">會員</h4>
          <div class="float-end">
            <RouterLink
              to="/member/create"
              class="company-btn-style add-user-btn"
              style="margin-right: 6px"
              >新增人員</RouterLink
            >
            <button
              class="company-btn-style delete-user-btn"
              @click="deleteMember"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <table
          class="table table-bordered member-table"
          v-if="windowWidth > 930"
        >
          <thead>
            <tr>
              <th width="5%" class="text-center">編號</th>
              <th width="10%" class="text-center">使用者名稱</th>
              <th width="13%" class="text-center">使用者帳號</th>
              <th width="15%" class="text-center">電子郵件</th>
              <th width="11%" class="text-center">電話</th>
              <th width="9%" class="text-center">職位</th>
              <th width="10%" class="text-center">建立時間</th>
              <th width="10%" class="text-center">更新時間</th>
              <th width="10%" class="text-center">修改</th>
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
          <tbody v-if="!loading && paginatedMembers.length > 0">
            <tr v-for="(item, index) in paginatedMembers" :key="index">
              <td class="text-center align-middle">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                <!-- {{ index + 1 }} -->
              </td>
              <td class="text-center align-middle">{{ item.member_name }}</td>
              <td class="text-center align-middle">
                {{ item.member_account }}
              </td>
              <td class="text-center align-middle">
                {{ item.member_email }}
              </td>
              <td class="text-center align-middle">
                {{ item.member_phone }}
              </td>
              <td class="text-center align-middle">
                <select
                  v-model="item.member_permissions"
                  class="form-select"
                  aria-label="Default select example"
                >
                  <option selected disabled>請選擇</option>
                  <option value="會員">會員</option>
                  <option value="關閉">關閉</option>
                </select>
              </td>
              <td class="text-center align-middle">{{ item.create_at }}</td>
              <td class="text-center align-middle">{{ item.update_at }}</td>
              <td class="middle-style">
                <RouterLink
                  :to="{ path: 'member/' + item.memberId + '/update' }"
                  class="edit-btn-style add-user-btn me-2"
                  >修改</RouterLink
                >
                <button
                  class="edit-btn-style add-user-btn"
                  @click="
                    updateMemberPermissions(
                      item.memberId,
                      item.member_permissions
                    )
                  "
                >
                  儲存
                </button>
              </td>
              <td class="text-center align-middle">
                <input
                  type="checkbox"
                  v-model="item.isChecked"
                  @change="checkIfAllSelected(item)"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="text-center align-middle">Loading</td>
            </tr>
          </tbody>
        </table>

        <!-- 卡片呈現方式 -->
        <div class="card-list col-12" v-else>
          <div
            class="member-cardto910"
            v-for="(item, index) in paginatedMembers"
            :key="index"
          >
            <p class="member-cardlist-item">
              <strong>使用者名稱:</strong> {{ item.member_name }}
            </p>
            <p class="member-cardlist-item">
              <strong>使用者帳號:</strong> {{ item.member_account }}
            </p>
            <p class="member-cardlist-item d-flex">
              <strong class="horizontal-text">職位:</strong
              ><select
                v-model="item.member_permissions"
                class="form-select"
                aria-label="Default select example"
              >
                <option selected disabled>請選擇</option>
                <option value="會員">會員</option>
                <option value="關閉">關閉</option>
              </select>
            </p>
            <p class="member-cardlist-item">
              <strong>建立時間:</strong> {{ item.create_at }}
            </p>
            <p class="member-cardlist-item">
              <strong>更新時間:</strong> {{ item.update_at }}
            </p>
            <p class="member-cardlist-item align-items-center">
              <strong>修改:</strong>
              <RouterLink
                :to="{ path: 'member/' + item.memberId + '/update' }"
                class="edit-btn-style add-user-btn"
                >修改</RouterLink
              >
              <button
                class="edit-btn-style add-user-btn"
                @click="
                  updateMemberPermissions(
                    item.memberId,
                    item.member_permissions
                  )
                "
              >
                儲存
              </button>
              <input
                type="checkbox"
                v-model="item.isChecked"
                @change="checkIfAllSelected(item)"
                class="ms-auto"
              />
            </p>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="members"
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
}

.middle-style {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.member-cardto910 {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.member-cardto910 p {
  margin: 0.5rem 0;
  padding-bottom: 10px; /* 增加底部內邊距 */
  border-bottom: 1px solid #ddd; /* 為每個 p 元素添加底部邊框 */
}

.member-cardto910 p:last-child {
  border-bottom: none; /* 最後一個 p 元素去掉底部邊框 */
}

.member-cardlist-item {
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

@media (max-width: 1510px) {
  .member-table thead th:nth-child(1),
  .member-table tbody td:nth-child(1) {
    width: 5%; /* 第一列的寬度調整為 5% */
  }

  .member-table thead th:nth-child(2),
  .member-table tbody td:nth-child(2) {
    width: 10%;
  }

  .member-table thead th:nth-child(3),
  .member-table tbody td:nth-child(3) {
    width: 10%;
  }

  .member-table thead th:nth-child(4),
  .member-table tbody td:nth-child(4) {
    width: 10%;
  }

  .member-table thead th:nth-child(5),
  .member-table tbody td:nth-child(5) {
    width: 10%;
  }

  .member-table thead th:nth-child(7),
  .member-table tbody td:nth-child(7) {
    width: 8%;
  }

  .member-table thead th:nth-child(8),
  .member-table tbody td:nth-child(8) {
    width: 8%;
  }
}

@media (max-width: 1380px) {
  .member-table thead th:nth-child(2),
  .member-table tbody td:nth-child(2) {
    width: 8%; /* 第一列的寬度調整為 5% */
  }

  .member-table thead th:nth-child(3),
  .member-table tbody td:nth-child(3) {
    width: 8%;
  }

  .member-table thead th:nth-child(4),
  .member-table tbody td:nth-child(4) {
    display: none; /* 隱藏第4欄 */
  }

  .member-table thead th:nth-child(5),
  .member-table tbody td:nth-child(5) {
    display: none; /* 隱藏第4欄 */
  }
}
</style>