<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";
import { useMenuStore } from "@/stores/menu";
import Breadcrumb from "./Breadcrumb.vue";

const router = useRouter();

const userStore = useUserStore();

const menuStore = useMenuStore();

const { user_data } = storeToRefs(userStore); // 从 store 中提取数据

const pathId = user_data.value.id;
console.log(pathId);

const img_path = "https://project01-back-end.onrender.com/img/member/company/";

const userAvatarUrl = computed(() => {
  return user_data.value.user_avatar
    ? new URL(`${img_path}${user_data.value.user_avatar}`, import.meta.url).href
    : ""; // 如果没有头像，返回空字符串
});

const logoutHandle = () => {
  userStore.logoutUserAccount(); // 調用 store 的登出方法
  router.push("/login"); // 導向登入頁面
};
</script>

<template>
  <div class="naylayout-width">
    <nav class="navbar bg-body-tertiary navbar-expand" style="height: 60px">
      <div class="container-fluid" style="margin-left: 80px">
        <!-- <div class="collapse navbar-collapse"> -->
        <Breadcrumb
          class="breadcrumbml"
          :class="{ breadcrumbMove: menuStore.menuFlexible }"
        />
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <div class="circle-img">
              <img
                :src="userAvatarUrl"
                alt=""
                style="width: 100%; height: 100%; object-fit: cover"
                v-if="userAvatarUrl"
              />
              <i class="material-icons" style="color: #ffffff" v-else>person</i>
            </div>
          </li>
          <li class="nav-item">
            <span class="nav-link">{{ user_data.username }}</span>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ user_data.permissions }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <RouterLink
                  :to="{
                    name: 'companyUpdateUser',
                    params: { id: user_data.id },
                  }"
                  class="dropdown-item"
                >
                  修改個人資料
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click="logoutHandle">登出</a>
              </li>
            </ul>
          </li>
        </ul>
        <!-- </div> -->
      </div>
    </nav>
    <div class="work-page">
      <RouterView />
    </div>
  </div>
</template>

<style>
.naylayout-width {
  width: 100%;
}

/* .work-page {
  padding: 3rem;
} */

.breadcrumb-style {
  display: flex;
  align-items: center;
  height: 100%;
}

.breadcrumbml {
  margin-left: -20px;
}

.breadcrumbMove {
  margin-left: -50px;
}

.circle-img {
  background-color: #d0d0d0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  /* .work-page {
    padding-left: 3rem;
  } */

  .naylayout-width {
    width: 90%;
  }
}
</style>