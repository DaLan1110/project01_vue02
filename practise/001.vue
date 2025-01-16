<script setup>
import { ref } from "vue";

const routerLinkDatas = ref({
  Home: {
    url: "/",
    icon: "home",
  },
  About: {
    url: "/about",
    icon: "visibility",
  },
  Team: {
    url: "/1",
    icon: "group",
  },
  Contact: {
    url: "/2",
    icon: "email",
  },
});

const isExpanded = ref(localStorage.getItem("isExpanded") === "true");

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value;
  localStorage.setItem("isExpanded", isExpanded.value);
};
</script>

<template>
  <div class="aside" :class="`${isExpanded ? 'menu-width' : ''}`">
    <div class="logo">
      <img src="../assets/logo.svg" alt="" class="img-logo-style" />
    </div>

    <div
      class="menu-toggle-wrap"
      :class="`${isExpanded ? 'button-position' : ''}`"
    >
      <button class="menu-toggle" @click="toggleMenu">
        <span class="material-icons menu-zoom"
          >keyboard_double_arrow_right</span
        >
      </button>
    </div>

    <h3
      class="menu-title-text"
      :class="`${isExpanded ? 'menu-text mt-5' : ''}`"
    >
      Menu
    </h3>
    <div class="menu" v-for="(data, key) in routerLinkDatas" :key="key">
      <RouterLink :to="data.url" class="menu-content-btn">
        <span class="material-icons">{{ data.icon }}</span>
        <span
          class="menu-content-text"
          :class="`${isExpanded ? 'menu-text' : ''}`"
          >{{ key }}</span
        >
      </RouterLink>
    </div>

    <div class="flex-end-setting"></div>
    <div class="menu">
      <RouterLink to="/settings" class="menu-content-btn">
        <span class="material-icons">settings</span>
        <span
          class="menu-content-text"
          :class="`${isExpanded ? 'menu-text' : ''}`"
          >Settings</span
        >
      </RouterLink>
    </div>
  </div>
</template>

<style>
/* Menu 本體 */
.aside {
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;

  background-color: #5b5b5b;
  color: #ffffff;

  transition: 0.2s ease-out;

  position: relative;
}

/* Menu Logo */
.logo {
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
}

.img-logo-style {
  width: 2rem;
}

/* Menu 縮放 */
.menu-toggle {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.menu-toggle-wrap {
  display: flex;
  justify-content: center;
}

.menu-width {
  width: 200px;
  transition: 0.3s ease-out;
}

.button-position {
  position: absolute;
  top: 0.8rem;
  right: 0.5rem;
  transform: rotate(180deg);
  transition: 0.3s ease-out;
}

/* content-icon 設定 */
.menu-zoom {
  font-size: 2rem;
  color: #ffffff;
}

.menu-zoom:hover {
  color: #84c1ff;
  transform: translateX(0.5rem);
  transition: 0.5s ease-out;
}

.menu {
  margin: 0;
}

.menu-title-text,
.menu-content-text {
  opacity: 0;
  transition: 0.3s ease-out;
  margin-left: 1.5rem;
  font-size: 18px;
}

.menu-title-text {
  margin-left: 1rem;
  color: #adadad;
  font-size: 14px;
  text-transform: uppercase;
}

.menu-content-btn {
  font-size: 2rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.menu-content-btn:hover,
.router-link-exact-active {
  background-color: #8e8e8e;
  color: #84c1ff;
}

.router-link-exact-active {
  border-right: 5px solid #84c1ff;
}

.menu-text {
  opacity: 1;
}

.flex-end-setting {
  flex: 1 1 0;
}

@media (max-width: 768px) {
  .aside {
    position: fixed;
    z-index: 99;
  }
}
</style>