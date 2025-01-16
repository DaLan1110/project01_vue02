<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";

const router = useRouter();

const userStore = useUserStore();

const { formLogin, errorLogin } = storeToRefs(userStore);

const loginHandle = async () => {
  const result = await userStore.loginUserAccount(); // 調用 store 的方法
  if (result) {
    router.push("/home");
  }
};

const getInputClass = (inputText) => {
  return formLogin.value[inputText].length ? "filled" : "";
};

const isFormValid = computed(() => {
  // 檢查所有字段是否都被填寫
  return Object.values(formLogin.value).every((field) => field.trim() !== "");
});

onBeforeMount(()=>{
  userStore.resetFormLogin()
  userStore.resetErrorLogin()
})
</script>

<template>
  <div>
    <form class="form-style" @submit.prevent="loginHandle">
      <h3 class="form-title">使用帳號 登入</h3>
      <div class="input-style-row">
        <input
          type="text"
          name="usename"
          id="username"
          class="input-style"
          :class="getInputClass('user_account')"
          v-model="formLogin.user_account"
          autocomplete="off"
        />
        <label for="username" class="lable-style"
          ><span class="label-span-style"> Enter username </span></label
        >
      </div>
      <div class="input-style-row">
        <input
          type="password"
          name="password"
          id="password"
          class="input-style"
          :class="getInputClass('user_password')"
          v-model="formLogin.user_password"
          autocomplete="off"
        />
        <label for="password" class="lable-style"
          ><span class="label-span-style"> Enter password </span></label
        >
        <ul class="input-error-style mt-1" v-if="errorLogin.general">
          <li>{{ errorLogin.general }}</li>
        </ul>
      </div>
      <div class="btn-style-row">
        <RouterLink to="/registration" class="registration-btn-style"
          >註冊</RouterLink
        >
        <button
          type="submit"
          class="login-btn-style flex-style-btn"
          :disabled="!isFormValid"
        >
          登入
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

.flex-style-btn {
  flex: 1;
}

.login-btn-style:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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