<script setup>
import { ref, computed, onMounted, onBeforeUnmount, toRaw, unref } from "vue";
import { validationField, validationFormPwd } from "@/hook/validationHook";
import { useUserStore } from "@/stores/users";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const userStore = useUserStore();

const pwdProps = defineProps({
  pathUserId: {
    type: Number,
  },
});

const isNewPasswordVisible = ref(false);

const isConfirmPasswordVisible = ref(false);

const user_password = ref("");

const confirm_password = ref(""); // 保存二次密碼

const errors = ref({});

const showNewPassword = () => {
  isNewPasswordVisible.value = true;
};

const showConfirmPassword = () => {
  isConfirmPasswordVisible.value = true;
};

const hideNewPassword = () => {
  isNewPasswordVisible.value = false;
};

const hideConfirmPassword = () => {
  isConfirmPasswordVisible.value = false;
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
  return validationFormPwd(
    {
      user_password: user_password.value,
      confirm_password: confirm_password.value,
    },
    user_password.value
  ).formIsValid; // 將 user_password 傳入
});

const handlePwd = () => {
  const plainPassword = toRaw(unref(user_password));
  userStore.updateUserPwd(pwdProps.pathUserId, plainPassword);

  // 確認密碼更新後，手動關閉模態窗口
  const modalElement = document.getElementById("ModalChangePwd");
  const modalInstance = bootstrap.Modal.getInstance(modalElement); // 獲取模態實例
  modalInstance.hide(); // 手動關閉模態
};

onMounted(() => {
  // Modal 關閉時重置資料
  const modalElement = document.getElementById("ModalChangePwd");
  modalElement.addEventListener("hidden.bs.modal", resetForm);

  function resetForm() {
    user_password.value = "";
    confirm_password.value = "";
    errors.value = {};
  }

  // 在組件卸載前移除事件監聽器
  onBeforeUnmount(() => {
    modalElement.removeEventListener("hidden.bs.modal", resetForm);
  });
});
</script>

<template>
  <div>
    <button
      class="me-2 btn-style update-user-btn"
      data-bs-toggle="modal"
      data-bs-target="#ModalChangePwd"
    >
      修改密碼
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="ModalChangePwd"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">修改密碼</h1>
            <!-- <template v-slot:default="slotProps">{{  slotProps.pathUserId01 }}</template> -->
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container mt-3">
              <div class="d-flex justify-content-center">
                <div class="col-8 position-relative">
                  <input
                    :type="isNewPasswordVisible ? 'text' : 'password'"
                    class="form-control"
                    placeholder="請輸入新的密碼"
                    aria-label="請輸入新的密碼"
                    v-model="user_password"
                    @blur="onInputBlur($event, 'user_password')"
                  />
                  <i
                    class="material-icons position-absolute icon-position"
                    @mousedown="showNewPassword"
                    @mouseup="hideNewPassword"
                    @mouseleave="hideNewPassword"
                    >{{
                      isNewPasswordVisible ? "visibility_off" : "visibility"
                    }}</i
                  >
                </div>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <ul
                  class="input-error-style-pwd col-8"
                  v-if="errors.user_password && errors.user_password.length"
                >
                  <li
                    v-for="(error, index) in errors.user_password"
                    :key="index"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
              <div class="d-flex justify-content-center mt-4">
                <div class="col-8 position-relative">
                  <input
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    class="form-control"
                    placeholder="請輸入二次新密碼"
                    aria-label="請輸入二次新密碼"
                    v-model="confirm_password"
                    @blur="onInputBlur($event, 'confirm_password')"
                  />
                  <i
                    class="material-icons position-absolute icon-position"
                    @mousedown="showConfirmPassword"
                    @mouseup="hideConfirmPassword"
                    @mouseleave="hideConfirmPassword"
                    >{{
                      isConfirmPasswordVisible ? "visibility_off" : "visibility"
                    }}</i
                  >
                </div>
              </div>
              <div class="d-flex justify-content-center mt-1">
                <ul
                  class="input-error-style-pwd col-8"
                  v-if="
                    errors.confirm_password && errors.confirm_password.length
                  "
                >
                  <li
                    v-for="(error, index) in errors.confirm_password"
                    :key="index"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="!isFormValid"
              @click="handlePwd"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.icon-position {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #e0e0e0;
}

.input-error-style-pwd {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 0;
  list-style: none;
  font-size: 12px;
  color: #e6367e;
  margin: 0;
  margin-left: 5px;
}
</style>