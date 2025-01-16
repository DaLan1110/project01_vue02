import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useOrderStore = defineStore('orderStore', () => {
    // 取得所有訂單資料
    const orders = ref([])
    const getOrdersList = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/orders");
            orders.value = res.data;
            console.log(orders.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 立即格式化日期
            orders.value = orders.value.map((order) => ({
                ...order,
                create_at: formatDate(order.create_at),
                update_at: formatDate(order.update_at),
                isChecked: false, // 初始化 checkbox 狀態
            }));
            console.log("處理", orders.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 取得單筆產品資料
    const order = ref({});
    const getOneOrderData = async (routePathId) => {
        try {
            const res = await axios.get(`https://project01-back-end.onrender.com/orders/get/${routePathId}`);
            order.value = res.data;

            // 格式化 create_at 時間
            const date = new Date(order.value.create_at);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            order.value.create_at = formattedDate;

            console.log(order.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 刪除訂單
    const selectedIds = ref([]); // 用於存儲選中的使用者 ID
    const deleteSelectedOrders = async () => {
        if (selectedIds.value.length === 0) {
            alert("請選擇至少一個訂單進行刪除");
            return;
        }

        try {
            // 使用 DELETE 請求刪除選定的成員
            const response = await axios.delete("https://project01-back-end.onrender.com/orders/deleteMoreOrders", {
                data: { ids: selectedIds.value }, // 在 data 中傳遞選定的 ID 列表
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("刪除成功！");
            await getOrdersList();
        } catch (error) {
            console.error("刪除失敗:", error);

            let errorMsg = "發生錯誤，請稍後再試。";
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            } else if (error.request) {
                errorMsg = "請求未收到回應。";
            }

            alert(errorMsg);
        }
    };

    // 取得前 5 筆資料
    const ordersToSix = ref([])
    const getOrdersListToSix = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/orders/getOrdersToSix");
            ordersToSix.value = res.data;
            console.log(ordersToSix.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 立即格式化日期
            ordersToSix.value = ordersToSix.value.map((order) => ({
                ...order,
                create_at: formatDate(order.create_at),
                update_at: formatDate(order.update_at),
                isChecked: false, // 初始化 checkbox 狀態
            }));
            console.log("處理", ordersToSix.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 取得前 5 筆熱門商品
    const hotProductToFiveName = ref([]);
    const hotProductToFiveCount = ref([]);
    const getHotProduct = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/orders/getHotProduct");
            hotProductToFiveName.value = res.data.map(item => item.shop_name);
            hotProductToFiveCount.value = res.data.map(item => item.count)
            console.log("hotProductToFiveName", hotProductToFiveName.value);
            console.log("hotProductToFiveCount", hotProductToFiveCount.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };


    return {
        // 取得所有訂單資料
        orders, getOrdersList,
        // 取得單筆產品資料
        order, getOneOrderData,
        // 刪除訂單
        selectedIds, deleteSelectedOrders,
        // 取得前 6 筆資料
        ordersToSix, getOrdersListToSix,
        // 取得前 5 筆熱門商品
        hotProductToFiveName, hotProductToFiveCount, getHotProduct,
    }
})