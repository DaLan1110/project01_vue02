<script setup>
import { ref, computed, onMounted } from "vue";
import { validationField, validationForm } from "@/hook/validationHook";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/members";

const memberStore = useMemberStore();
const { newMemberData } = storeToRefs(memberStore);

const errors = ref({});

const handleCreate = async () => {
  await memberStore.createMemberAccount();
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
  return validationForm(newMemberData.value).formIsValid;
});

onMounted(()=>{
  memberStore.resetNewMemberData()
})
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12 col-md-8">
      <div class="card-header mt-2"><h4 class="mt-1">新增會員</h4></div>
      <div class="card-body col-10 mx-auto">
        <div class="mt-4">
          <label for="member_account">會員帳號</label>
          <input
            type="text"
            id="member_account"
            name="member_account"
            class="form-control"
            v-model="newMemberData.member_account"
            @blur="onInputBlur($event, 'member_account')"
          />
          <ul
            class="input-error-style"
            v-if="errors.member_account && errors.member_account.length"
          >
            <li v-for="(error, index) in errors.member_account" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <label for="member_password">會員密碼</label>
          <input
            type="password"
            id="member_password"
            name="member_password"
            class="form-control"
            v-model="newMemberData.member_password"
            @blur="onInputBlur($event, 'member_password')"
          />
          <ul
            class="input-error-style"
            v-if="errors.member_password && errors.member_password.length"
          >
            <li v-for="(error, index) in errors.member_password" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="mt-3">
          <label for="member_email">電子郵件</label>
          <input
            type="text"
            id="member_email"
            name="member_email"
            class="form-control"
            v-model="newMemberData.member_email"
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
          <label for="member_phone">電話</label>
          <input
            type="text"
            id="member_phone"
            name="member_phone"
            class="form-control"
            v-model="newMemberData.member_phone"
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
            class="me-2 btn-style add-btn"
            @click="handleCreate"
            :disabled="!isFormValid"
          >
            新增
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