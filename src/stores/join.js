import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useJoinStore = defineStore('joinStore', () => {
    // 取得所有加盟資料
    const joins = ref([])
    const getJoinsList = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/joinUs");
            joins.value = res.data;
            console.log(joins.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 立即格式化日期
            joins.value = joins.value.map((join) => ({
                ...join,
                create_at: formatDate(join.create_at),
                update_at: formatDate(join.update_at),
                isChecked: false, // 初始化 checkbox 狀態
            }));
            console.log("處理", joins.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 取得單筆產品資料
    const join = ref({});
    const getOneJoinData = async (routePathId) => {
        try {
            const res = await axios.get(`https://project01-back-end.onrender.com/joinUs/get/${routePathId}`);
            join.value = res.data;

            // 格式化 create_at 時間
            const date = new Date(join.value.create_at);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

            join.value.create_at = formattedDate;

            console.log(join.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 刪除多個加盟
    const selectedIds = ref([]); // 用於存儲選中的使用者 ID
    const deleteSelectedJoins = async () => {
        if (selectedIds.value.length === 0) {
            alert("請選擇至少一個加盟進行刪除");
            return;
        }

        try {
            // 使用 DELETE 請求刪除選定的成員
            const response = await axios.delete("https://project01-back-end.onrender.com/joinUs/deleteMoreJoinUs", {
                data: { ids: selectedIds.value }, // 在 data 中傳遞選定的 ID 列表
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("刪除成功！");
            await getJoinsList();
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

    // 刪除單一加盟
    const deleteOneJoin = async (id) => {
        try {
            // 使用 DELETE 請求刪除選定的成員
            const response = await axios.delete(`https://project01-back-end.onrender.com/joinUs/deleteJoinUs/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("已刪除加盟");
            await getJoinsList();
        } catch (error) {
            console.error("刪除失敗:", error);

            let errorMsg = "發生錯誤，請稍後再試。";
            if (error.response) {
                // 伺服器有回應
                errorMsg = error.response.data?.message || `伺服器錯誤：${error.response.status}`;
            } else if (error.request) {
                // 未收到伺服器回應
                errorMsg = "伺服器未回應，請檢查網路連線或稍後再試。";
            } else {
                // 其他錯誤
                errorMsg = error.message;
            }

            alert(errorMsg);
        }
    }

    // 新增 送出加盟
    const newJoinData = ref({
        join_us_name: '',
        join_us_phone: '',
        join_us_email: '',
        join_us_address: ''
    })
    const insertNewJoin = async () => {
        try {
            // 發送 POST 請求到後端
            const res = await axios.post(
                "https://project01-back-end.onrender.com/joinUs/createJoinUs",
                newJoinData.value,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // 如果成功，處理響應
            alert("加盟已成功提交！");
            await getJoinsList();
        } catch (error) {
            console.error("提交加盟時出現錯誤", error);
            alert("提交失敗，請稍後再試！");
        }
    }

    // 更新 加盟狀態
    const updateJoinState = async (id) => {
        console.log("傳遞的 ID:", id);
        try {
            const response = await axios.put(`https://project01-back-end.onrender.com/joinUs/updatePermissions/${id}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            // 處理成功響應
            console.log('加盟同意成功:', response.data);
            alert('已同意加盟');
            await getJoinsList();
        } catch (error) {
            // 處理錯誤
            console.error('更新加盟狀態時發生錯誤:', error);
            let errorMsg = '發生錯誤，請稍後再試。';

            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.request) {
                errorMsg = '請求未收到回應。';
            }

            alert(errorMsg);
        }
    }

    // 更新 加盟資料
    const updateJoinData = async (name, phone, email, address, id) => {
        try {
            const updateData = {
                join_us_name: name,
                join_us_phone: phone,
                join_us_email: email,
                join_us_address: address
            }
            // 將資料發送到後端進行更新
            const response = await axios.put(
                `https://project01-back-end.onrender.com/joinUs/updateJoinUs/${id}`,
                updateData
            );

            // 成功的響應處理
            console.log("資料已更新成功", response.data);
            // await getOneJoinData(id);
            alert('更新成功');
        } catch (error) {
            // 更詳細的錯誤處理
            if (error.response) {
                // 後端有返回錯誤響應
                console.error(
                    `更新資料失敗，錯誤碼: ${error.response.status}, 訊息: ${error.response.data.error}`
                );
                alert(error.response.data.message); // 顯示後端返回的錯誤訊息
            } else if (error.request) {
                // 請求已發送，但未收到響應
                console.error("未收到伺服器的響應，請檢查伺服器狀態");
                alert('未收到伺服器的響應，請稍後再試');
            } else {
                // 其他錯誤
                console.error("更新資料時發生錯誤:", error.message);
                alert('發生錯誤，請稍後再試');
            }
        }
    }

    return {
        // 取得所有加盟資料
        joins, getJoinsList,
        // 取得單筆產品資料
        join, getOneJoinData,
        // 刪除多個加盟
        selectedIds, deleteSelectedJoins,
        // 刪除單一加盟
        deleteOneJoin,
        // 新增 送出加盟
        newJoinData, insertNewJoin,
        // 更新 加盟狀態
        updateJoinState,
        // 更新 加盟資料
        updateJoinData,
    }
})