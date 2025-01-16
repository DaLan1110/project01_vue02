<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { validationField, validationForm } from "@/hook/validationHook";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";

const userStore = useUserStore();
const { form, hasBlurred, errors } = storeToRefs(userStore);

const handleSubmit = () => {
  userStore.createUserAccount(); // 調用 store 的方法
};

const hasBlurredChange = (inputText) => {
  hasBlurred.value[inputText] = true;
};

const getInputClass = (inputText) => {
  return form.value[inputText].length ? "filled" : "";
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

onBeforeMount(()=>{
  userStore.resetForm()
  userStore.resetHasBlurred()
  userStore.resetErrors()
});
</script>

<template>
  <div>
    <form class="form-style" @submit.prevent="handleSubmit">
      <h3 class="form-title">使用您的電子郵件註冊</h3>
      <div class="input-style-row">
        <input
          type="text"
          name="usename"
          id="username"
          class="input-style"
          :class="[
            getInputClass('user_account'),
            {
              'danger-input': errors.user_account && hasBlurred.user_account,
              'valid-input': !errors.user_account && hasBlurred.user_account,
            },
          ]"
          v-model="form.user_account"
          @blur="onInputBlur($event, 'user_account')"
        />
        <label for="username" class="lable-style"
          ><span class="label-span-style"> Enter username </span></label
        >
        <ul
          class="input-error-style"
          v-if="errors.user_account && errors.user_account.length"
        >
          <li
            v-for="(error, index) in errors.user_account"
            :key="index"
            class="box0111"
          >
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="input-style-row">
        <input
          type="password"
          name="password"
          id="password"
          class="input-style"
          :class="[
            getInputClass('user_password'),
            {
              'danger-input': errors.user_password && hasBlurred.user_password,
              'valid-input': !errors.user_password && hasBlurred.user_password,
            },
          ]"
          v-model="form.user_password"
          @blur="onInputBlur($event, 'user_password')"
        />
        <label for="password" class="lable-style"
          ><span class="label-span-style"> Enter password </span></label
        >
        <ul
          class="input-error-style"
          v-if="errors.user_password && errors.user_password.length"
        >
          <li v-for="(error, index) in errors.user_password" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="input-style-row">
        <input
          type="text"
          name="email"
          id="email"
          class="input-style"
          :class="[
            getInputClass('user_email'),
            {
              'danger-input': errors.user_email && hasBlurred.user_email,
              'valid-input': !errors.user_email && hasBlurred.user_email,
            },
          ]"
          v-model="form.user_email"
          @blur="onInputBlur($event, 'user_email')"
        />
        <label for="email" class="lable-style"
          ><span class="label-span-style"> Enter email </span></label
        >
        <ul
          class="input-error-style"
          v-if="errors.user_email && errors.user_email.length"
        >
          <li v-for="(error, index) in errors.user_email" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="btn-style-row">
        <RouterLink to="/login" class="login-btn-style">登入</RouterLink>
        <button
          type="submit"
          class="registration-btn-style flex-style-btn"
          :disabled="!isFormValid"
        >
          註冊
        </button>
      </div>
    </form>
  </div>
</template>

<style>
.form-style {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: clamp(400px, 30%, 500px);
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 14px 20px 12px #00000012;
  border-radius: 8px;
  color: #bdbdbd;
  margin: 0 auto;
  margin: 0 auto;
}

.form-title {
  font-size: 22px;
  margin: 0;
}

.input-style-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  gap: 4px;
}

.input-style {
  border: 2px solid #232327;
  border-radius: 8px;
  background-color: #232327;
  outline: none;
  color: #bdbdbd;
  padding: 10px 12px;
  box-sizing: border-box;
  font-size: 14px;
  transform: all 0.3s ease;
}

.danger-input {
  border: 2px solid #e6367e !important;
  color: #e6367e;
}

.valid-input {
  border: 2px solid #199673 !important;
  color: #199673;
}

.input-style:focus,
.input-style:hover,
.filled {
  border: 2px solid #4b53b7;
}

.input-style:focus + .lable-style span,
.filled + .lable-style span {
  transform: translateY(-100%);
}

.lable-style {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: calc(100% - 24px);
  top: 13px;
  left: 14px;
  pointer-events: none;
  overflow: hidden;
}

.label-span-style {
  transition: all 0.3s ease;
  font-size: 14px;
}

.login-btn-style,
.registration-btn-style {
  border: none;
  border-radius: 4px;
  padding: 10px 12px;
  background-color: #4b53b7;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.registration-btn-style:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.flex-style-btn {
  flex: 1;
}

.btn-style-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-direction: row;
  gap: 4px;
}
.input-error-style {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: #e6367e;
  margin: 0;
  margin-left: 5px;
}

.input-error-style li {
  animation: swipeDown 0.3s ease forwards;
}

@keyframes swipeDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>