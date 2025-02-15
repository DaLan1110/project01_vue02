<script setup>
import { ref, watch } from "vue";

// 接收來自父元件的 props
const propsImg = defineProps({
  imgRest: Boolean, // 父元件會傳入 imgRest
});

const tempImageUrl = ref("");
const emit = defineEmits(["updateAvatar", "resetImage"]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      tempImageUrl.value = reader.result; // 將檔案讀取結果賦值給 tempImageUrl
      emit("updateAvatar", { name: file.name, data: reader.result }); // 將檔名和數據發送給父元件
    };
    reader.readAsDataURL(file); // 將檔案讀取為 Data URL
  }
};

const resetImage = () => {
  tempImageUrl.value = ""; // 清空圖片 URL
};

// // 監聽 imgRest 的變化
watch(
  () => propsImg.imgRest,
  (newVal) => {
    if (newVal === true) {
      resetImage(); // 當 imgRest 為 false 時，重置圖片
    }
  }
);
</script>

<template>
  <div class="row align-items-center productData-responsive-justify">
    <div class="col-10">
      <label for="inputGroupFile01">產品圖片</label>
      <input
        type="file"
        class="form-control"
        id="inputGroupFile01"
        @change="handleFileChange"
      />
    </div>
    <div class="col-10 d-flex justify-content-center mt-4">
      <div class="product-data-style-img">
        <i class="material-icons icon-style-avatar" v-if="!tempImageUrl"
          >image</i
        >
        <img
          :src="tempImageUrl"
          alt=""
          style="width: 100%; height: 100%; object-fit: cover"
          v-if="tempImageUrl"
        />
      </div>
    </div>
  </div>
</template>

<style>
.product-data-style-img {
  width: 400px;
  height: 400px;
  background-color: #d0d0d0;
  border-radius: 10%;
  margin-top: 20px;
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center; /* 垂直置中 */
  overflow: hidden;
}

.icon-style-avatar {
  font-size: 48px; /* 調整圖標大小 */
  color: #ffffff; /* 圖標顏色 */
}

@media (max-width: 930px) {
  .product-data-style-img {
    height: 300px;
    width: 300px;
  }
}

@media (max-width: 1200px) {
  .productData-responsive-justify {
    justify-content: center !important;
  }
}
</style>