import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    const menuFlexible = ref(false);
    // 根據 menuFlexible 和是否為覆蓋模式計算 hideAddImgProduct
    const hideAddImgProduct = computed(() => {
        return !menuFlexible.value && !isOverlay.value;
    });
    const toggleMenu = () => {
        menuFlexible.value = !menuFlexible.value;
        hideAddImgProduct.value = !hideAddImgProduct.value
    }

    return { menuFlexible, hideAddImgProduct, toggleMenu }
})