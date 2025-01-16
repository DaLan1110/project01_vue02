<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});

const errMsg = ref("");

const auth = getAuth();

const registerBtn = () => {
  createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("註冊成功", user);
      alert("註冊成功");
    })
    .catch((error) => {
      console.log("註冊失敗", error);
      errMsg.value = "註冊失敗";
      alert("註冊失敗");
    });
};
</script>

<template>
  <div>
    <form class="form-register-stlye">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="text"
          class="form-control"
          id="email"
          name="email"
          placeholder="請輸入帳號"
          v-model="formData.email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          placeholder="請輸入密碼"
          v-model="formData.password"
        />
      </div>
      <div class="mb-3">
        <button type="button" class="btn btn-primary" @click="registerBtn">註冊</button>
        <RouterLink class="btn btn-primary ms-3" to="/login">去登入</RouterLink>
      </div>
    </form>
  </div>
</template>

<style>
</style>