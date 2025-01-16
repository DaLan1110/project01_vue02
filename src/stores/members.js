import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useMemberStore = defineStore('memberStore', () => {
    // 取得所有會員資料
    const members = ref([])
    const getMemberData = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/members");
            members.value = res.data;
            // console.log(members.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 立即格式化日期
            members.value = members.value.map((member) => ({
                ...member,
                create_at: formatDate(member.create_at),
                update_at: formatDate(member.update_at),
                isChecked: false, // 初始化 checkbox 狀態
            }));
            console.log("處理", members.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 取得單筆會員資料
    const member = ref({});
    const getOneMemberData = async (routePathId) => {
        try {
            const res = await axios.get(`https://project01-back-end.onrender.com/members/get/${routePathId}`);
            member.value = res.data;
            console.log(member.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };


    // 更改 會員權限
    const updateMemberPermissions = async (id, permissions) => {
        try {
            const updateData = ({
                permissions
            });
            const response = await axios.put(`https://project01-back-end.onrender.com/members/updatePermissions/${id}`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            // 處理成功響應
            console.log('權限更新成功:', response.data);
            alert('權限更新成功');

            // 重新獲取公司成員數據以確保狀態同步
            await getMemberData();
        } catch (error) {
            // 處理錯誤
            console.error('更新權限時發生錯誤:', error);
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

    // 新增會員
    const newMemberData = ref({
        member_account: '',
        member_password: '',
        member_email: '',
        member_phone: ''
    });
    // 清空 newMemberData 資料
    const resetNewMemberData = () => {
        newMemberData.value = {
            member_account: '',
            member_password: '',
            member_email: '',
            member_phone: ''
        };
    };
    const createMemberAccount = async () => {
        try {
            const res = await axios.post(
                "https://project01-back-end.onrender.com/members/createMember",
                newMemberData.value,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("檔案建立成功", res.data);

            alert("建立成功");
            resetNewMemberData();
        } catch (error) {
            if (error.response) {
                // 請求成功發出且伺服器也回應了狀態碼，但狀態代碼超出了 2xx 的範圍
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);

                // 顯示錯誤信息
                if (error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert("發生錯誤，請稍後再試。");
                }
            } else if (error.request) {
                // 請求已經成功發起，但沒有收到回應
                // `error.request` 在瀏覽器中是 XMLHttpRequest 的實例，
                // 而在node.js中是 http.ClientRequest 的實例
                console.log(error.request);
                alert("請求未收到回應。");
            } else {
                // 發送請求時出了點問題
                console.log("Error", error.message);
                alert("發生錯誤，請稍後再試。");
            }
        }
    };

    // 刪除會員
    const selectedIds = ref([]); // 用於存儲選中的使用者 ID
    const deleteSelectedMembers = async () => {
        if (selectedIds.value.length === 0) {
            alert("請選擇至少一名成員進行刪除");
            return;
        }

        try {
            // 遍歷選中的成員 ID 列表
            for (const Id of selectedIds.value) {
                try {
                    // 1. 獲取每個成員的資料以便刪除頭像
                    const getDeleteMemberrData = await axios.get(`https://project01-back-end.onrender.com/members/get/${Id}`);
                    const avatarFilename = getDeleteMemberrData.data.member_avatar;

                    // 2. 刪除圖檔（如果存在且不為空）
                    if (avatarFilename && avatarFilename.trim() !== "") {
                        try {
                            await axios.delete(`https://project01-back-end.onrender.com/members/deleteMemberAvatar/${avatarFilename}`);
                            console.log("頭像已刪除:", avatarFilename);
                        } catch (error) {
                            console.error(`刪除頭像失敗，成員ID: ${Id}, 頭像: ${avatarFilename}`, error);
                        }
                    }
                } catch (error) {
                    console.error(`獲取成員資料失敗，成員ID: ${Id}`, error);
                }
            }

            // 使用 DELETE 請求刪除選定的成員
            const response = await axios.delete("https://project01-back-end.onrender.com/members/deleteMoreMembers", {
                data: { ids: selectedIds.value }, // 在 data 中傳遞選定的 ID 列表
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("刪除成功！");
            await getMemberData();
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

    // 更新會員資料
    const tempImageUrl = ref(""); // 臨時存放上傳的頭像 URL
    const tempImageUrlName = ref(""); // 臨時存放上傳的頭像 檔名
    const generateRandomString = (length) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };
    const updateMemberData = async (routePathId) => {
        try {
            // 刪除舊頭像
            // 1. 確認是否有新頭像要上傳
            let avatarFilename =
                tempImageUrl.value || member.value.member_avatar;

            // 如果存在，表示要上傳新頭像
            if (tempImageUrl.value) {
                // 獲取當前的用戶數據以便刪除舊的圖檔
                const currentMemberData = await axios.get(`https://project01-back-end.onrender.com/members/get/${routePathId}`);
                const oldAvatarFilename = currentMemberData.data.member_avatar;

                // 2. 刪除舊的圖檔（如果存在且不為空）
                if (oldAvatarFilename && oldAvatarFilename.trim() !== "") {
                    try {
                        await axios.delete(`https://project01-back-end.onrender.com/members/deleteMemberAvatar/${oldAvatarFilename}`);
                        console.log("舊頭像已刪除:", oldAvatarFilename);
                    } catch (error) {
                        console.error("刪除舊頭像時發生錯誤:", error);
                    }
                }

                // 上傳頭像
                const base64Response = await fetch(tempImageUrl.value);
                const blob = await base64Response.blob(); // 将 Data URL 轉換為 Blob

                // 取得文件 .jpg / .png 檔類型
                const fileExtension = tempImageUrlName.value.split(".").pop();

                const randomFileName = `${generateRandomString(10)}.${fileExtension}`; // 10 為隨機字符長度

                const file = new File([blob], randomFileName, {
                    type: "image/png",
                }); // 創建文件對象

                const formData = new FormData();
                formData.append("avatar", file);

                const uploadResponse = await axios.post(
                    "https://project01-back-end.onrender.com/members/uploadMemberAvatar",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // 上传成功后，获取文件名
                avatarFilename = uploadResponse.data.filename;
                console.log("頭像上傳成功:", avatarFilename);
            }

            // 3. 構造更新的數據
            const updatedData = {
                member_avatar: avatarFilename,
                member_name: member.value.member_name,
                member_email: member.value.member_email,
                member_phone: member.value.member_phone,
            };

            // 將資料發送到後端進行更新
            const response = await axios.put(
                `https://project01-back-end.onrender.com/members/updateMember/${routePathId}`,
                updatedData
            );
            console.log("資料已更新成功");
            console.log(member);
            alert(response.data.message);

        } catch (error) {
            console.error("更新資料時發生錯誤:", error);
        }
    }


    return {
        // 取得所有會員資料
        members, getMemberData,
        // 取得單筆會員資料
        member, getOneMemberData,
        // 更改 會員權限
        updateMemberPermissions,
        // 新增會員
        newMemberData, createMemberAccount, resetNewMemberData,
        // 刪除會員
        selectedIds, deleteSelectedMembers,
        // 更新會員資料
        tempImageUrl, tempImageUrlName, updateMemberData,
    }
})