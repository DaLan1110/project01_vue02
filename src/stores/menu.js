import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    const menuFlexible = ref(false)
    const toggleMenu = () => {
        menuFlexible.value = !menuFlexible.value;
    }

    return { menuFlexible, toggleMenu }
})