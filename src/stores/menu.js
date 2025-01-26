import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    const menuFlexible = ref(false)
    const hideAddImgProduct = computed(() => !menuFlexible.value);
    const toggleMenu = () => {
        menuFlexible.value = !menuFlexible.value;
        hideAddImgProduct.value = !hideAddImgProduct.value
    }

    return { menuFlexible, hideAddImgProduct, toggleMenu }
})