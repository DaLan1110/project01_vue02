<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useJoinStore } from "@/stores/join";
import { validationField, validationForm } from "@/hook/validationHook";

const route = useRoute();
const routePathId = route.params.id;

const joinStore = useJoinStore();
const { join } = storeToRefs(joinStore);

const errors = ref({});

const getJoinsData = () => {
  joinStore.getOneJoinData(routePathId);
};
getJoinsData();

const handleUpdateJoinData = async (name, phone, email, address, id) => {
  joinStore.updateJoinData(name, phone, email, address, id);
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
  // 確保 join.value 存在並且所有屬性都有值
  if (
    !join.value ||
    !join.value.join_us_name ||
    !join.value.join_us_phone ||
    !join.value.join_us_email ||
    !join.value.join_us_address
  ) {
    return false; // 當任一屬性不存在時返回 false
  }
  const { join_us_name, join_us_phone, join_us_email, join_us_address } =
    join.value;
  // 輸出以檢查當前值
  console.log({ join_us_name, join_us_phone, join_us_email, join_us_address });
  // 驗證表單
  return validationForm({
    join_us_name,
    join_us_phone,
    join_us_email,
    join_us_address,
  }).formIsValid;
});
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12 col-xl-8">
      <div class="card-header mt-2">
        <h4 class="mt-1">加盟資料</h4>
      </div>
      <div class="card-body col-10 mx-auto">
        <div class="mt-3">
          <label for="join_us_name">姓名</label>
          <input
            type="text"
            id="join_us_name"
            class="form-control"
            v-model="join.join_us_name"
            @blur="onInputBlur($event, 'join_us_name')"
          />
        </div>
        <ul
          class="input-error-style"
          v-if="errors.join_us_name && errors.join_us_name.length"
        >
          <li v-for="(error, index) in errors.join_us_name" :key="index">
            {{ error }}
          </li>
        </ul>
        <div class="mt-3">
          <label for="join_us_phone">電話</label>
          <input
            type="text"
            id="join_us_phone"
            class="form-control"
            v-model="join.join_us_phone"
            @blur="onInputBlur($event, 'join_us_phone')"
          />
        </div>
        <ul
          class="input-error-style"
          v-if="errors.join_us_phone && errors.join_us_phone.length"
        >
          <li v-for="(error, index) in errors.join_us_phone" :key="index">
            {{ error }}
          </li>
        </ul>
        <div class="mt-3">
          <label for="join_us_email">電子郵件</label>
          <input
            type="text"
            id="join_us_email"
            class="form-control"
            v-model="join.join_us_email"
            @blur="onInputBlur($event, 'join_us_email')"
          />
        </div>
        <ul
          class="input-error-style"
          v-if="errors.join_us_email && errors.join_us_email.length"
        >
          <li v-for="(error, index) in errors.join_us_email" :key="index">
            {{ error }}
          </li>
        </ul>
        <div class="mt-3">
          <label for="join_us_address">地址</label>
          <input
            type="text"
            id="join_us_address"
            class="form-control"
            v-model="join.join_us_address"
            @blur="onInputBlur($event, 'join_us_address')"
          />
        </div>
        <ul
          class="input-error-style"
          v-if="errors.join_us_address && errors.join_us_address.length"
        >
          <li v-for="(error, index) in errors.join_us_address" :key="index">
            {{ error }}
          </li>
        </ul>
        <div class="mt-4 d-flex justify-content-end">
          <button
            class="me-2 btn-style update-user-btn"
            @click="
              handleUpdateJoinData(
                join.join_us_name,
                join.join_us_phone,
                join.join_us_email,
                join.join_us_address,
                routePathId
              )
            "
            :disabled="!isFormValid"
          >
            儲存
          </button>
          <RouterLink to="/address" class="btn-style cancel-btn"
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