import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    const menuFlexible = ref(false);
    const activeMenu = ref(null);
    // 根據 menuFlexible 和是否為覆蓋模式計算 hideAddImgProduct
    const hideAddImgProduct = computed(() => {
        return !menuFlexible.value;
    });
    const toggleMenu = () => {
        menuFlexible.value = !menuFlexible.value;
        hideAddImgProduct.value = !hideAddImgProduct.value
    }

    const toggleSubMenu = (menuLabel) => {
        activeMenu.value = activeMenu.value === menuLabel ? null : menuLabel;
    };

    return { menuFlexible, activeMenu, hideAddImgProduct, toggleMenu, toggleSubMenu }
})