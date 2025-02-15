<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import MenuItem from "./MenuItem.vue";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";

const menuStore = useMenuStore();

const { menuFlexible } = storeToRefs(menuStore);

const toggleMenu = () => {
  menuStore.toggleMenu();
};

const menuTree = ref([
  {
    label: "首頁",
    icon: "home",
    path: "home",
  },
  {
    label: "成員",
    icon: "group",
    children: [
      {
        label: "公司",
        path: "company",
      },
      {
        label: "會員",
        path: "member",
      },
    ],
  },
  {
    label: "產品",
    icon: "inventory_2",
    children: [
      {
        label: "商品",
        path: "product",
      },
      {
        label: "訂單",
        path: "order",
      },
    ],
  },
  {
    label: "加盟",
    icon: "storefront",
    children: [
      {
        label: "加盟地址",
        path: "address",
      },
      // {
      //   label: "加入加盟",
      //   path: "join",
      // },
    ],
  },
  // {
  //   label: "設定",
  //   icon: "settings",
  //   path: "setting",
  // },
]);

const triggerToggleMenu = () => {
  // console.log(`寬度: ${window.innerWidth}, 高度: ${window.innerHeight}`);
  if (window.innerWidth <= 768) {
    menuFlexible.value = true;
  }
};

onMounted(() => {
  triggerToggleMenu();
  window.addEventListener("resize", triggerToggleMenu);
});

onUnmounted(() => {
  window.removeEventListener("resize", triggerToggleMenu);
});
</script>

<template>
  <div class="menu" :class="{ 'burger-menu-flexible': menuStore.menuFlexible }">
    <div class="logo" :class="{ 'logo-flexible': menuStore.menuFlexible }">
      <a href="https://project01-vue01.onrender.com" class="url-logo-style"
        ><img src="../../assets/sun.png" alt="" class="img-logo-style mr-3" />
        <span class="font-logo-style">夏季</span></a
      >
    </div>
    <h3
      class="menu-title-text"
      :class="{ 'menu-title-text-flexible': menuStore.menuFlexible }"
    >
      Menu
    </h3>
    <div :class="{ 'meun-item-position': menuStore.menuFlexible }">
      <MenuItem
        v-for="(item, index) in menuTree"
        :key="index"
        :label="item.label"
        :icon="item.icon"
        :depth="0"
        :path="item.path"
        :data="item.children"
        :menuFlexible="menuStore.menuFlexible"
      />
      <i
        class="material-icons burger-menu-style"
        :class="{ 'burger-menu-move': menuStore.menuFlexible }"
        @click="toggleMenu"
        >menu_open</i
      >
    </div>
  </div>
</template>

<style>
.menu {
  display: flex;
  position: relative;
  flex-direction: column;
  min-height: 100vh;
  height: auto;
  width: 200px;
  left: 0;
  top: 0;
  border-right: 1px solid #d0d0d0;
  transition: all 0.3s ease;
  overflow: visible;
  z-index: 1000;
}

.meun-item-position {
  margin-top: 30px;
}

.burger-menu-style {
  position: fixed !important;
  z-index: 990;
  left: calc(210px); /* 距離容器右側保持固定距離 */
  top: 20px;
  font-size: 20px;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.burger-menu-flexible {
  overflow: visible;
  width: 60px;
  padding-top: 90px;
}

.logo-flexible {
  position: absolute;
  top: 0;
  width: 60px;
  padding: 10px;
  transition: all 0.3s ease;
  margin-top: 0 !important;
}

.logo-flexible .font-logo-style {
  display: none;
}

.burger-menu-move {
  left: 20px;
  top: 80px;
  transform: rotate(180deg);
  transition: all 0.3s ease;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.img-logo-style {
  width: 3rem;
}

.font-logo-style {
  font-size: 2rem;
  font-weight: 600;
}

.url-logo-style {
  text-decoration: none; /* 移除底線 */
  color: #6a6a6a;
  display: flex;
  align-items: center;
}

.menu-title-text {
  transition: all 0.3s ease;
  margin-top: 30px;
  margin-left: 20px;
  font-size: 12px;
  color: #adadad;
  text-transform: uppercase;
}

.menu-title-text-flexible {
  display: none;
}

/* @media (max-width: 1150px) {
  .menu {
    min-height: 200vh;
  }
} */

@media (max-width: 768px) {
  .menu {
    position: fixed; /* 固定側邊選單 */
    top: 0;
    left: 0;
    width: 150px;
    min-height: 100%; /* 讓 menu 高度至少與 body 一樣 */
    background-color: #fff;
  }

  .burger-menu-flexible {
    width: 60px;
  }
}
</style>