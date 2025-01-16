<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { validationField, validationForm } from "@/hook/validationHook";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";

const userStore = useUserStore();
const { form, hasBlurred, errors } = storeToRefs(userStore);

const hasBlurredChange = (inputText) => {
  hasBlurred.value[inputText] = true;
};

const handleSubmit = () => {
  userStore.createUserAccount(); // 調用 store 的方法
};

// hook
const onInputBlur = (e, inputText) => {
  hasBlurredChange(inputText);
  const inputValue = e.target.value;
  const inputErrors = validationField(inputText, inputValue);
  inputErrors && inputErrors.length
    ? (errors.value[inputText] = inputErrors)
    : (errors.value[inputText] = null);
};

const isFormValid = computed(() => {
  return validationForm(form.value).formIsValid;
});

onBeforeMount(() => {
  userStore.resetForm();
  userStore.resetHasBlurred();
  userStore.resetErrors();
});
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12 col-md-8">
      <div class="card-header mt-2"><h4 class="mt-1">新增人員</h4></div>
      <div class="card-body col-10 mx-auto">
        <div class="mt-4">
          <label for="useraccount">使用者帳號</label>
          <input
            type="text"
            id="useraccount"
            name="useraccount"
            class="form-control"
            v-model="form.user_account"
            @blur="onInputBlur($event, 'user_account')"
          />
          <ul
            class="input-error-style"
            v-if="errors.user_account && errors.user_account.length"
          >
            <li v-for="(error, index) in errors.user_account" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <label for="course">使用者密碼</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
            v-model="form.user_password"
            @blur="onInputBlur($event, 'user_password')"
          />
          <ul
            class="input-error-style"
            v-if="errors.user_password && errors.user_password.length"
          >
            <li v-for="(error, index) in errors.user_password" :key="index">
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
            v-model="form.user_email"
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
        <div class="mt-4 d-flex justify-content-end">
          <button
            class="me-2 btn-style add-btn"
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            新增
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
.btn-style {
  border-radius: 4px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.add-btn {
  border: 1px solid #6c6c6c;
  color: #272727;
  background-color: #ffffff;
  font-weight: 900;
  font-size: 12px;
}

.add-btn:hover {
  color: #ffffff;
  background-color: #272727;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  border: none;
  color: #ffffff;
  background-color: #e6367e;
}

.cancel-btn:hover {
  opacity: 0.8;
}
</style>