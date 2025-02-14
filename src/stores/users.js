import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useUserStore = defineStore('userStore', () => {
    const form = ref({
        user_account: "",
        user_password: "",
        user_email: "",
    });

    const hasBlurred = ref({
        user_account: false,
        user_password: false,
        user_email: false,
    });

    const errors = ref({});

    const resetForm = () => {
        form.value = {
            user_account: "",
            user_password: "",
            user_email: "",
        };
    };

    const resetHasBlurred = () => {
        hasBlurred.value = {
            user_account: false,
            user_password: false,
            user_email: false,
        };
    };

    const resetErrors = () => {
        errors.value = {};
    };

    const createUserAccount = async () => {
        try {
            const res = await axios.post(
                "https://project01-back-end.onrender.com/users/create",
                form.value,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("檔案建立成功", res.data);

            alert("建立成功");

            // 重置 from
            resetForm();
            // 重置 hasBlurred
            resetHasBlurred();
            // 重置 errors
            resetErrors();
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

    const formLogin = ref({
        user_account: "",
        user_password: "",
    });

    const errorLogin = ref({});

    const resetFormLogin = () => {
        formLogin.value = {
            user_account: "",
            user_password: "",
        };
    };

    const resetErrorLogin = () => {
        errorLogin.value = {};
    };

    const user_data = ref({
        username: "",
        permissions: "",
        user_avatar: "",
    });

    const setUser = (data) => {
        user_data.value = data;
    };

    const isAuthenticated = ref(false); // 用來檢查用戶是否已登入

    const loginUserAccount = async () => {

        try {
            const res = await axios.post(
                "https://project01-back-end.onrender.com/users/login",
                formLogin.value,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("登入成功", res.data);

            // 檢查權限是否為 '關閉'
            const userPermissions = res.data.user.user_data.permissions;
            if (userPermissions === '關閉') {
                alert('權限已關閉，請聯絡老闆');
                // 如果權限是'關閉'，直接返回，不繼續執行以下的登入邏輯
                return;
            }

            // 儲存 JWT
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user_data", JSON.stringify(res.data.user.user_data));

            setUser({
                username: res.data.user.user_data.username || "使用者",
                permissions: res.data.user.user_data.permissions || "職位",
                user_avatar: res.data.user.user_data.user_avatar,
            });

            isAuthenticated.value = true;

            alert(res.data.message || "登入成功");
            return res.data;
        }
        catch (error) {
            let errorMsg = "發生錯誤，請稍後再試。";
            if (error.response) {
                // 請求成功發出且伺服器也回應了狀態碼，但狀態代碼超出了 2xx 的範圍
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);

                // 顯示錯誤信息
                if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            } else if (error.request) {
                // 請求已經成功發起，但沒有收到回應
                // `error.request` 在瀏覽器中是 XMLHttpRequest 的實例，
                // 而在node.js中是 http.ClientRequest 的實例
                console.log(error.request);
                errorMsg = "請求未收到回應。";
            } else {
                // 發送請求時出了點問題
                console.log("Error", error.message);
            }
            errorLogin.value = { general: errorMsg };
        }
    }

    // 檢查 JWT
    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        const storedUserData = localStorage.getItem('user_data');
        if (token && storedUserData) {
            try {
                const res = await axios.get('https://project01-back-end.onrender.com/users/checkJwt', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                isAuthenticated.value = res.data.valid;
                setUser(JSON.parse(storedUserData)); // 恢復用戶數據
                console.log("驗證成功")
            } catch (error) {
                isAuthenticated.value = false;
                console.error("JWT 驗證失敗", error);
            }
        } else {
            isAuthenticated.value = false;
        }
    };

    // 登出
    const logoutUserAccount = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data'); // 移除存储的用户数据
        // user_data.value = {
        //     username: '',
        //     permissions: '',
        //     user_avatar: '',
        // };
        resetFormLogin();
        resetErrorLogin();
        isAuthenticated.value = false;
        console.log("登出成功");
    };

    const companyMember = ref([]);

    // 查看 公司員工資料
    const getCompanyMemberData = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/users");
            companyMember.value = res.data;
            console.log(companyMember.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 定義 permissions 排序優先順序
            const permissionOrder = ["老闆", "主管", "員工", "關閉"];

            // 立即格式化日期並排序
            companyMember.value = companyMember.value
                .map((member) => ({
                    ...member,
                    create_at: formatDate(member.create_at),
                    update_at: formatDate(member.update_at),
                    isChecked: false, // 初始化 checkbox 狀態
                }))
                .sort((a, b) => {
                    // 根據 permissions 排序
                    return permissionOrder.indexOf(a.permissions) - permissionOrder.indexOf(b.permissions);
                });

            console.log("處理後的資料", companyMember.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 更改 公司員工權限
    const updateUserPermissions = async (userId, permissions) => {
        try {
            const updateData = ({
                userId: parseInt(userId, 10),
                permissions
            });
            const response = await axios.put('https://project01-back-end.onrender.com/users/savePermissions', updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            // 處理成功響應
            console.log('權限更新成功:', response.data);
            alert('權限更新成功');

            // 重新獲取公司成員數據以確保狀態同步
            await getCompanyMemberData();
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
                    const getDeleteUserData = await axios.get(`https://project01-back-end.onrender.com/users/get/${Id}`);
                    const avatarFilename = getDeleteUserData.data.user_avatar;

                    const publicIdToImg = avatarFilename
                        .split("/")          // 先按 "/" 切割
                        .pop()                // 取得最後一段（即檔名和副檔名）
                        .replace(/\.[^.]+$/, ""); // 移除副檔名

                    console.log('publicIdToImg', publicIdToImg);

                    // 2. 刪除圖檔（如果存在且不為空）
                    if (publicIdToImg && publicIdToImg.trim() !== "") {
                        try {
                            await axios.delete(`https://project01-back-end.onrender.com/uploadImg/deleteImageToUser/${publicIdToImg}`);
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
            const response = await axios.delete("https://project01-back-end.onrender.com/users/deleteMoreUsers", {
                data: { ids: selectedIds.value }, // 在 data 中傳遞選定的 ID 列表
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("刪除成功！");
            await getCompanyMemberData();
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

    const userDataInUpdate = ref({
        user_avatar: "",
        user_account: "",
        username: "",
        user_email: "",
    });

    const tempImageUrl = ref(""); // 臨時存放上傳的頭像 URL
    const tempImageUrlName = ref(""); // 臨時存放上傳的頭像 檔名

    const updateUserData = async (routePathId) => {
        try {
            // 1. 確認是否有新頭像要上傳，如果有則獲取當前的用戶數據並刪除舊頭像
            let avatarFilename =
                tempImageUrl.value || userDataInUpdate.value.user_avatar;

            // 如果存在，表示要上傳新頭像
            if (tempImageUrl.value) {
                // 獲取當前的用戶數據以便刪除舊的圖檔
                const currentUserData = await axios.get(`https://project01-back-end.onrender.com/users/get/${routePathId}`);
                const oldAvatarFilename = currentUserData.data.user_avatar;
                console.log('oldAvatarFilename', oldAvatarFilename);

                const publicIdToImg = oldAvatarFilename
                    .split("/")          // 先按 "/" 切割
                    .pop()                // 取得最後一段（即檔名和副檔名）
                    .replace(/\.[^.]+$/, ""); // 移除副檔名

                console.log('publicIdToImg', publicIdToImg);

                // 2. 刪除舊的圖檔（如果存在且不為空）
                if (publicIdToImg && publicIdToImg.trim() !== "") {
                    try {
                        await axios.delete(`https://project01-back-end.onrender.com/uploadImg/deleteImageToUser/${publicIdToImg}`);
                        console.log("舊頭像已刪除:", oldAvatarFilename);
                    } catch (error) {
                        console.error("刪除舊頭像時發生錯誤:", error);
                    }
                }


                const base64Response = await fetch(tempImageUrl.value);
                const blob = await base64Response.blob(); // 将 Data URL 转换为 Blob

                // 取得文件 .jpg / .png 檔類型
                const fileExtension = tempImageUrlName.value.split(".").pop();

                const randomFileName = `${generateRandomString(10)}.${fileExtension}`; // 10 為隨機字符長度

                const file = new File([blob], randomFileName, {
                    type: `image/${fileExtension}`,
                }); // 創建文件對象

                const formData = new FormData();
                formData.append("image", file);

                const uploadResponse = await axios.post(
                    "https://project01-back-end.onrender.com/uploadImg/uploadImgToUser",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // 上传成功后，获取文件名
                avatarFilename = uploadResponse.data.data.imageUrl;
                console.log("頭像上傳成功:", avatarFilename);
            }

            // 3. 構造更新的數據
            const updatedData = {
                user_avatar: avatarFilename,
                username: userDataInUpdate.value.username,
                user_email: userDataInUpdate.value.user_email,
            };

            const plainUserData = { ...user_data.value };  // 獲取原始值

            // 從 localStorage 獲取當前登入用戶的資料
            const loggedInUser = JSON.parse(localStorage.getItem("user_data"));
            // 確保獲取到的 loggedInUser 不為 null
            if (loggedInUser) {
                const loggedInUserId = loggedInUser.id; // 獲取用戶 ID

                console.log('ID', loggedInUserId);
                console.log('routePathId', routePathId)
                if (loggedInUserId == routePathId) {
                    // 更新 user_data
                    // 畫面渲染
                    user_data.value = {
                        ...user_data.value,
                        user_avatar: avatarFilename,
                        username: userDataInUpdate.value.username,
                    };

                    // 提取原始的 user_data
                    // 將新的 user_data 寫進 localStorage
                    plainUserData.user_avatar = avatarFilename;
                    plainUserData.username = userDataInUpdate.value.username;

                    // 更新 localStorage
                    localStorage.setItem("user_data", JSON.stringify(plainUserData));
                }
            } else {
                console.error('無法從 localStorage 獲取用戶資料');
            }

            // 將資料發送到後端進行更新
            const response = await axios.put(
                `https://project01-back-end.onrender.com/users/update/${routePathId}`,
                updatedData
            );
            console.log("資料已更新成功");
            console.log(user_data);
            alert(response.data.message);

        } catch (error) {
            console.error("更新資料時發生錯誤:", error);
        }
    }

    const updateUserPwdData = ref('');

    const updateUserPwd = async (pathUserId, user_password) => {
        try {
            // 確保 user_password 是普通的 JavaScript 變數
            const updateDataPwd = {
                user_password
            };

            const res = await axios.put(
                `https://project01-back-end.onrender.com/users/edit/${pathUserId}`,
                updateDataPwd,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("密碼修改成功", res.data);

            alert("密碼修改成功");
        } catch (error) {
            console.error("失敗:", error);

            let errorMsg = "發生錯誤，請稍後再試。";
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            } else if (error.request) {
                errorMsg = "請求未收到回應。";
            }

            alert(errorMsg);
        }
    }

    return { form, hasBlurred, errors, resetForm, resetHasBlurred, resetErrors, createUserAccount, formLogin, errorLogin, resetFormLogin, resetErrorLogin, isAuthenticated, user_data, setUser, loginUserAccount, checkAuthStatus, logoutUserAccount, companyMember, getCompanyMemberData, updateUserPermissions, selectedIds, deleteSelectedMembers, userDataInUpdate, tempImageUrl, tempImageUrlName, updateUserData, updateUserPwdData, updateUserPwd }
});