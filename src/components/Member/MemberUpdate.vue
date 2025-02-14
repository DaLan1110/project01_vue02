<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/members";
import { validationField, validationForm } from "@/hook/validationHook";

import AddImg from "../Img/AddImg.vue";

const route = useRoute();
const routePathId = route.params.id;

const memberStore = useMemberStore();
const { member, tempImageUrl, tempImageUrlName } = storeToRefs(memberStore);

// const img_path = "https://project01-back-end.onrender.com/img/member/member/";

const errors = ref({});

const readMemberData = () => {
  memberStore.getOneMemberData(routePathId);
};
readMemberData();

const handleAvatarUpdate = ({ name, data }) => {
  tempImageUrl.value = data; // 可以將數據保存到本地狀態
  tempImageUrlName.value = name;
  console.log("文件名字:", name);
  console.log("文件數據:", data); // 可以看到文件的 Data URL
  // 可以繼續上船數據到服務器或處理器
};

const handleUpdateMemberData = async () => {
  // if (!isFormValid.value) return;
  await memberStore.updateMemberData(routePathId);
  await memberStore.getOneMemberData(routePathId); // 刷新用戶數據
};

// hook
const onInputBlur = (e, inputText) => {
  const inputValue = e.target.value;
  const inputErrors = validationField(inputText, inputValue);
  inputErrors && inputErrors.length
    ? (errors.value[inputText] = inputErrors)
    : (errors.value[inputText] = null);
};

const isFormValid = computed(() => {
  // 確保 member.value 存在並且所有屬性都有值
  if (
    !member.value ||
    !member.value.member_name ||
    !member.value.member_email ||
    !member.value.member_phone
  ) {
    return false; // 當任一屬性不存在時返回 false
  }
  const { member_name, member_email, member_phone } = member.value;
  // 輸出以檢查當前值
  console.log({ member_name, member_email, member_phone });
  // 驗證表單
  return validationForm({ member_name, member_email, member_phone })
    .formIsValid;
});
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12 col-xl-8">
      <div class="card-header mt-2">
        <h4 class="mt-1">修改會員資料</h4>
      </div>
      <div class="card-body col-10 mx-auto">
        <div class="mt-4">
          <AddImg
            :img_avatar="member.member_avatar"
            @updateAvatar="handleAvatarUpdate"
          />
        </div>
        <div class="mt-3">
          <label for="useraccount">使用者帳號</label>
          <input
            type="text"
            id="useraccount"
            name="useraccount"
            class="form-control"
            v-model="member.member_account"
            disabled
          />
        </div>
        <div class="mt-3">
          <label for="course">使用者名稱</label>
          <input
            type="text"
            id="username"
            name="username"
            class="form-control"
            v-model="member.member_name"
            @blur="onInputBlur($event, 'member_name')"
          />
          <ul
            class="input-error-style"
            v-if="errors.member_name && errors.member_name.length"
          >
            <li v-for="(error, index) in errors.member_name" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <label for="email">電子郵件</label>
          <input
            type="text"
            id="email"
            name="email"
            class="form-control"
            v-model="member.member_email"
            @blur="onInputBlur($event, 'member_email')"
          />
          <ul
            class="input-error-style"
            v-if="errors.member_email && errors.member_email.length"
          >
            <li v-for="(error, index) in errors.member_email" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <label for="email">電話</label>
          <input
            type="text"
            id="phone"
            name="phone"
            class="form-control"
            v-model="member.member_phone"
            @blur="onInputBlur($event, 'member_phone')"
          />
          <ul
            class="input-error-style"
            v-if="errors.member_phone && errors.member_phone.length"
          >
            <li v-for="(error, index) in errors.member_phone" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button
            class="me-2 btn-style update-user-btn"
            @click="handleUpdateMemberData"
            :disabled="!isFormValid"
          >
            儲存
          </button>
          <RouterLink to="/member" class="btn-style cancel-btn"
            >返回</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.circle-style-img {
  width: 150px;
  height: 150px;
  background-color: #d0d0d0;
  border-radius: 50%;
  margin-top: 20px;
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center; /* 垂直置中 */
  overflow: hidden;
}

.icon-style-avatar {
  font-size: 48px; /* 調整圖標大小 */
  color: #ffffff; /* 圖標顏色 */
}

.update-user-btn {
  border: 1px solid #6c6c6c;
  color: #272727;
  background-color: #ffffff;
  font-weight: 900;
  font-size: 12px;
}

.update-user-btn:hover {
  color: #ffffff;
  background-color: #272727;
}

.update-user-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>