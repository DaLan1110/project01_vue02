<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";
import { validationField, validationForm } from "@/hook/validationHook";
import axios from "axios";
import CompanyUpdatePwd from "@/components/Member/CompanyUpdatePwd.vue";

import AddImg from "../Img/AddImg.vue";

const route = useRoute();
const routePathId = route.params.id;

const pwdProps = defineProps({
  companyPwd: {
    type: Boolean,
    default: false,
  },
  headerTitle: {
    type: String,
    default: "修改公司人員資料",
  },
});

const userStore = useUserStore();
const { userDataInUpdate, tempImageUrl, tempImageUrlName } =
  storeToRefs(userStore);

const errors = ref({});

const pathUserId = ref(null);
const img_path = "https://project01-back-end.onrender.com/img/member/company/";

const fetchUserData = async () => {
  try {
    const res = await axios.get(
      `https://project01-back-end.onrender.com/users/get/${routePathId}`
    );
    console.log("User Data: ", res.data);
    // 在這裡處理獲取到的資料

    pathUserId.value = res.data.userId;

    // 使用 Object.assign 將 API 返回的資料寫入 userDataInUpdate
    Object.assign(userDataInUpdate.value, {
      user_avatar: res.data.user_avatar || "",
      user_account: res.data.user_account || "",
      username: res.data.username || "",
      user_email: res.data.user_email || "",
    });
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
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
  const { username, user_email } = userDataInUpdate.value;
  return validationForm({ username, user_email }).formIsValid;
});

const handleAvatarUpdate = ({ name, data }) => {
  tempImageUrl.value = data; // 可以將數據保存到本地狀態
  tempImageUrlName.value = name;
  console.log("文件名字:", name);
  console.log("文件數據:", data); // 可以看到文件的 Data URL
  // 可以繼續上船數據到服務器或處理器
};

const handleUserData = async () => {
  if (!isFormValid.value) return;

  await userStore.updateUserData(routePathId);
  await fetchUserData(); // 刷新用戶數據
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12 col-xl-8">
      <div class="card-header mt-2">
        <h4 class="mt-1">{{ pwdProps.headerTitle }}</h4>
      </div>
      <div class="card-body col-10 mx-auto">
        <div class="mt-4">
          <AddImg
            :img_path="img_path"
            :img_avatar="userDataInUpdate.user_avatar"
            @updateAvatar="handleAvatarUpdate"
          />
          <!-- <div class="row align-items-center">
            <div class="col-9 d-flex">
              <input
                type="file"
                class="form-control"
                id="inputGroupFile01"
                @change="handleFileChange"
              />
            </div>
            <div class="col-3 d-flex justify-content-center">
              <div class="circle-style-img">
                <i
                  class="material-icons icon-style-avatar"
                  v-if="!userDataInUpdate.user_avatar && !tempImageUrl"
                  >person</i
                >
                <img
                  :src="tempImageUrl || userAvatarUrl"
                  alt=""
                  style="width: 100%; height: 100%; object-fit: cover"
                  v-if="tempImageUrl || userDataInUpdate.user_avatar"
                />
              </div>
            </div>
          </div> -->
        </div>
        <div class="mt-3">
          <label for="useraccount">使用者帳號</label>
          <input
            type="text"
            id="useraccount"
            name="useraccount"
            class="form-control"
            v-model="userDataInUpdate.user_account"
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
            v-model="userDataInUpdate.username"
            @blur="onInputBlur($event, 'username')"
          />
          <ul
            class="input-error-style"
            v-if="errors.username && errors.username.length"
          >
            <li v-for="(error, index) in errors.username" :key="index">
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
            v-model="userDataInUpdate.user_email"
            @blur="onInputBlur($event, 'user_email')"
          />
          <ul
            class="input-error-style"
            v-if="errors.user_email && errors.user_email.length"
          >
            <li v-for="(error, index) in errors.user_email" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-4 d-flex">
          <div class="flex-grow-1">
            <div v-if="pwdProps.companyPwd">
              <CompanyUpdatePwd :pathUserId="pathUserId" />
            </div>
          </div>
          <button
            class="me-2 btn-style update-user-btn"
            :disabled="!isFormValid"
            @click="handleUserData"
          >
            儲存
          </button>
          <RouterLink to="/company" class="btn-style cancel-btn"
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