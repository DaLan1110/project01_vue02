<script setup>
import { computed, nextTick, ref } from "vue";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";

const menuStore = useMenuStore();

const showChildren = ref(false);

const isExpand = ref(false);

const containerHeight = ref(0);

const containerRef = ref(null);

const toggleMenu = () => {
  isExpand.value = !isExpand.value;
  // If the menu item is closed
  if (!showChildren.value) {
    showChildren.value = true;
    nextTick(() => {
      containerHeight.value = containerRef.value.scrollHeight + "px";
      setTimeout(() => {
        containerHeight.value = "fit-content";
        containerRef.value.style.overflow = "visible";
      }, 300);
    });
  } else {
    containerHeight.value = containerRef.value.scrollHeight + "px";
    containerRef.value.style.overflow = "hidden";
    setTimeout(() => {
      containerHeight.value = 0 + "px";
    }, 10);
    setTimeout(() => {
      showChildren.value = false;
    }, 300);
  }
};

const menuItemProps = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  depth: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    default: "",
  },
  data: {
    type: Array,
  },
  menuFlexible: {
    type: Boolean,
  },
  show: {
    type: Boolean,
  },
});

console.log("show", menuItemProps.show);

const showLabel = computed(() => {
  return menuItemProps.menuFlexible ? menuItemProps.depth > 0 : true;
});
</script>

<template>
  <div class="menu-item">
    <RouterLink :to="{ name: path }" style="text-decoration: none">
      <div
        class="menu-item-label"
        :class="{ 'menu-children-btn-style': menuFlexible }"
        :style="{ paddingLeft: depth * 30 + 20 + 'px' }"
        @click="toggleMenu"
      >
        <div class="left menu-item-icon-row">
          <i v-if="icon" class="material-icons menu-item-icon-left">{{
            menuItemProps.icon
          }}</i>
          <span v-if="showLabel">{{ menuItemProps.label }}</span>
        </div>

        <div v-if="data" class="right menu-item-icon-row">
          <i
            class="material-icons menu-item-icon-right"
            :class="{ 'icon-flip': isExpand }"
            >keyboard_arrow_down</i
          >
        </div>
      </div>
    </RouterLink>

    <div
      class="menu-items-container"
      :class="{ 'menu-children-item-flexible-style': menuFlexible }"
      v-if="showChildren"
      ref="containerRef"
      :style="{ height: containerHeight }"
    >
      <menu-item
        v-for="(item, index) in data"
        :key="index"
        :label="item.label"
        :icon="item.icon"
        :depth="depth + 1"
        :path="item.path"
        :data="item.children"
        :menuFlexible="menuFlexible"
      />
    </div>
  </div>
</template>

<style>
.menu-item {
  position: relative;
  width: 100%;
}

.menu-item-label {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  white-space: nowrap;
  user-select: none;
  height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  color: #6a6a6a;
  transition: all 0.3s ease;
}

.menu-item-label:hover {
  background-color: #deedff;
  cursor: pointer;
}

.menu-item-icon-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-item-icon-left {
  font-size: 20px;
  color: #6a6a6a;
}

.menu-item-icon-right {
  font-size: 16px;
  color: #cacaca;
  transition: all 0.3s ease;
}

.icon-flip {
  transform: rotate(180deg);
}

.menu-items-container {
  width: 100%;
  z-index: 999;
  overflow: hidden;
  left: calc(100% + 6px);
  transition: height 0.3s ease;
}

.menu-children-item-flexible-style {
  width: fit-content;
  position: absolute;
  background-color: #ffffff;
  box-shadow: 0 0 10px #ebebeb;
  top: 0;
}

.menu-children-btn-style {
  widows: 100% !important;
  padding-left: 20px !important;
}
</style>