import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useProductStore = defineStore('productStore', () => {
    // 取得所有產品資料
    const products = ref([])
    const getProductData = async () => {
        try {
            const res = await axios.get("https://project01-back-end.onrender.com/products");
            products.value = res.data;
            // console.log(prodcts.value);
            const formatDate = (dateStr) => {
                return new Date(dateStr).toISOString().substring(0, 10); // 格式化為 YYYY-MM-DD
            };

            // 立即格式化日期
            products.value = products.value.map((prodct) => ({
                ...prodct,
                create_at: formatDate(prodct.create_at),
                update_at: formatDate(prodct.update_at),
                isChecked: false, // 初始化 checkbox 狀態
            }));
            console.log("處理", products.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 取得單筆產品資料
    const product = ref({});
    const getOneProductData = async (routePathId) => {
        try {
            const res = await axios.get(`https://project01-back-end.onrender.com/products/get/${routePathId}`);
            product.value = res.data;
            console.log(product.value);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    // 更改 產品上下架
    const updateProductExhibit = async (id, exhibit) => {
        try {
            const updateData = ({
                exhibit
            });
            const response = await axios.put(`https://project01-back-end.onrender.com/products/updateExhibit/${id}`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
            // 處理成功響應
            console.log('產品上下架更新成功:', response.data);
            alert('產品上下架更新成功');

            // 重新獲取公司成員數據以確保狀態同步
            await getProductData();
        } catch (error) {
            // 處理錯誤
            console.error('更新時發生錯誤:', error);
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

    // 新增產品
    const newProductData = ref({
        product_name: '',
        product_price: '',
        product_img: '',
        product_sweetness: [],
        product_ice: [],
        product_exhibit: '',
        product_add: [],
        product_classify: '',
        product_address: []
    });
    // 清空 newProductData 資料
    const resetNewMemberData = () => {
        newProductData.value = {
            product_name: '',
            product_price: '',
            product_img: '',
            product_sweetness: [],
            product_ice: [],
            product_exhibit: '',
            product_add: [],
            product_classify: '',
            product_address: []
        }
    };
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
    const createProductData = async () => {
        try {
            // 1. 確認是否有產品圖要上傳
            let productFilename = tempImageUrl.value;

            // 如果存在，表示要傳新頭像
            if (tempImageUrl.value) {
                // 上傳產品圖
                const base64Response = await fetch(tempImageUrl.value);
                const blob = await base64Response.blob(); // 将 Data URL 轉換為 Blob

                // 取得文件 .jpg / .png 檔類型
                const fileExtension = tempImageUrlName.value.split(".").pop();

                const randomFileName = `${generateRandomString(10)}.${fileExtension}`; // 10 為隨機字符長度

                const file = new File([blob], randomFileName, {
                    type: `image/${fileExtension}`,
                }); // 創建文件對象

                const formData = new FormData();
                formData.append("image", file);

                try {
                    const uploadResponse = await axios.post(
                        "https://project01-back-end.onrender.com/uploadImg/uploadImg",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    productFilename = uploadResponse.data.data.imageUrl;
                    console.log("產品圖上傳成功:", productFilename);

                } catch (uploadError) {
                    console.error("上傳產品圖時發生錯誤:", uploadError);
                    throw new Error("產品圖上傳失敗"); // 拋出錯誤以終止後續操作
                }

                // 將上傳成功的文件名賦值給 newProductData.product_img
                if (productFilename) {
                    newProductData.value.product_img = productFilename; // 設置圖片 URL
                }

                // 2. 將 product_sweetness 陣列轉換為逗號分隔的字串
                newProductData.value.product_sweetness = newProductData.value.product_sweetness.join(',');
                newProductData.value.product_ice = newProductData.value.product_ice.join(',');
                newProductData.value.product_add = newProductData.value.product_add.join(',');
                newProductData.value.product_address = newProductData.value.product_address.join(',');

                const res = await axios.post(
                    "https://project01-back-end.onrender.com/products/createProduct",
                    newProductData.value,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("檔案建立成功", res.data);
            }

            alert("建立成功");
            resetNewMemberData();
        } catch (error) {
            // 錯誤處理邏輯不變
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                if (error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert("發生錯誤，請稍後再試。");
                }
            } else if (error.request) {
                console.log(error.request);
                alert("請求未收到回應。");
            } else {
                console.log("Error", error.message);
                alert("發生錯誤，請稍後再試。");
            }
            throw error;
        }
    };

    // 刪除產品
    const selectedIds = ref([]); // 用於存儲選中的使用者 ID
    const deleteSelectedProducts = async () => {
        if (selectedIds.value.length === 0) {
            alert("請選擇至少一個產品進行刪除");
            return;
        }

        try {
            // 遍歷選中的成員 ID 列表
            for (const Id of selectedIds.value) {
                try {
                    // 1. 獲取每個成員的資料以便刪除頭像
                    const getDeleteProductData = await axios.get(`https://project01-back-end.onrender.com/products/get/${Id}`);
                    const productFilename = getDeleteProductData.data.product_img;

                    const publicIdToImg = productFilename
                        .split("/")          // 先按 "/" 切割
                        .slice(-2)           // 取最後兩段（資料夾 + 檔名）
                        .join("/")           // 用 "/" 重新組合
                        .replace(/\.[^.]+$/, ""); // 移除副檔名

                    console.log('publicIdToImg', publicIdToImg);

                    // 2. 刪除圖檔（如果存在且不為空）
                    if (publicIdToImg && publicIdToImg.trim() !== "") {
                        try {
                            await axios.delete(`https://project01-back-end.onrender.com/uploadImg/deleteImage/${publicIdToImg}`);
                            console.log("圖檔已刪除:", productFilename);
                        } catch (error) {
                            console.error(`刪除產品圖示失敗，ID: ${Id}, 頭像: ${productFilename}`, error);
                        }
                    }
                } catch (error) {
                    console.error(`獲取產品圖示失敗，ID: ${Id}`, error);
                }
            }

            // 使用 DELETE 請求刪除選定的成員
            const response = await axios.delete("https://project01-back-end.onrender.com/products/deleteMoreProducts", {
                data: { ids: selectedIds.value }, // 在 data 中傳遞選定的 ID 列表
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("刪除成功:", response.data);
            alert("刪除成功！");
            await getProductData();
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

    // 更新產品
    const selectedSweetness = ref([]);
    const selectedIce = ref([]);
    const selectedAdd = ref([]);
    const selectedAddress = ref([]);
    const initSelected = () => {
        selectedSweetness.value = product.value.product_sweetness.split(',');
        selectedIce.value = product.value.product_ice.split(',');
        selectedAdd.value = product.value.product_add.split(',');
        selectedAddress.value = product.value.product_address.split(',');
    };
    const updateProductData = async (routePathId) => {
        try {
            // 刪除舊頭像
            // 1. 確認是否有新頭像要上傳
            let productFilename =
                tempImageUrl.value || product.value.product_img;

            // 如果存在，表示要上傳新頭像
            if (tempImageUrl.value) {
                // 獲取當前的用戶數據以便刪除舊的圖檔
                const currentProductData = await axios.get(`https://project01-back-end.onrender.com/products/get/${routePathId}`);
                const oldProductFilename = currentProductData.data.product_img;
                console.log('oldProductFilename', oldProductFilename);

                const publicIdToImg = oldProductFilename
                    .split("/")          // 先按 "/" 切割
                    .slice(-2)           // 取最後兩段（資料夾 + 檔名）
                    .join("/")           // 用 "/" 重新組合
                    .replace(/\.[^.]+$/, ""); // 移除副檔名

                console.log('publicIdToImg', publicIdToImg);

                // 刪除舊的圖檔（如果存在且不為空）
                if (publicIdToImg && publicIdToImg.trim() !== "") {
                    try {
                        await axios.delete(`https://project01-back-end.onrender.com/uploadImg/deleteImage/${publicIdToImg}`);
                        console.log("舊圖檔已刪除:", oldProductFilename);
                    } catch (error) {
                        console.error("刪除舊圖檔時發生錯誤:", error);
                    }
                }

                // 上傳頭像
                const base64Response = await fetch(tempImageUrl.value);
                const blob = await base64Response.blob(); // 将 Data URL 轉換為 Blob

                // 取得文件 .jpg / .png 檔類型
                const fileExtension = tempImageUrlName.value.split(".").pop();

                const randomFileName = `${generateRandomString(10)}.${fileExtension}`; // 10 為隨機字符長度

                const file = new File([blob], randomFileName, {
                    type: `image/${fileExtension}`,
                }); // 創建文件對象

                const formData = new FormData();
                formData.append("image", file);

                const uploadResponse = await axios.post(
                    "https://project01-back-end.onrender.com/uploadImg/uploadImg",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // 上传成功后，获取文件名
                productFilename = uploadResponse.data.data.imageUrl;
                console.log("圖檔上傳成功:", productFilename);
            }

            // 2. 將 product_sweetness 陣列轉換為逗號分隔的字串
            product.value.product_sweetness = product.value.product_sweetness.join(',');
            product.value.product_ice = product.value.product_ice.join(',');
            product.value.product_add = product.value.product_add.join(',');
            product.value.product_address = product.value.product_address.join(',');

            // 3. 構造更新的數據
            const updatedData = {
                product_img: productFilename,
                product_name: product.value.product_name,
                product_price: product.value.product_price,
                product_exhibit: product.value.product_exhibit,
                product_sweetness: product.value.product_sweetness,
                product_ice: product.value.product_ice,
                product_add: product.value.product_add,
                product_classify: product.value.product_classify,
                product_address: product.value.product_address,
            };

            // 將資料發送到後端進行更新
            const response = await axios.put(
                `https://project01-back-end.onrender.com/products/updateProduct/${routePathId}`,
                updatedData
            );
            console.log("資料已更新成功");
            console.log(product);
            alert(response.data.message);
            await getOneProductData(routePathId);
        } catch (error) {
            // 錯誤處理邏輯不變
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                if (error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert("發生錯誤，請稍後再試。");
                }
            } else if (error.request) {
                console.log(error.request);
                alert("請求未收到回應。");
            } else {
                console.log("Error", error.message);
                alert("發生錯誤，請稍後再試。");
            }
            throw error;
        }
    }

    return {
        // 取得所有產品資料
        products, getProductData,
        // 取得單筆產品資料
        product, getOneProductData,
        // 更改產品上下架
        updateProductExhibit,
        // 新增產品
        newProductData, tempImageUrl, tempImageUrlName, createProductData,
        // 刪除產品
        selectedIds, deleteSelectedProducts,
        // 更新產品資料
        selectedSweetness, selectedIce, selectedAdd, selectedAddress, initSelected, updateProductData
    }
})