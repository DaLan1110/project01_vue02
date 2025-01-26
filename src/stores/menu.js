import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    const menuFlexible = ref(false)
    const hideAddImgProduct = ref(true)
    const toggleMenu = () => {
        menuFlexible.value = !menuFlexible.value;
        hideAddImgProduct.value = !hideAddImgProduct.value
    }

    return { menuFlexible, hideAddImgProduct, toggleMenu }
})