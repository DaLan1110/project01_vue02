<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { validationField, validationForm } from "@/hook/validationHook";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/products";
import AddImgProductData from "@/components/Img/AddImg_productData.vue";

const sweetChooses = ref([
  {
    itemName: "全糖",
    itemId: "chkSweetAll",
    itemchkName: "chkSweet",
  },
  {
    itemName: "半糖",
    itemId: "chkSweetHalf",
    itemchkName: "chkSweet",
  },
  {
    itemName: "少糖",
    itemId: "chkSweetFew",
    itemchkName: "chkSweet",
  },
  {
    itemName: "無糖",
    itemId: "chkSweetNone",
    itemchkName: "chkSweet",
  },
]);

const temperatureChooses = ref([
  {
    itemName: "正常",
    itemId: "chkTemperatureAll",
  },
  {
    itemName: "少冰",
    itemId: "chkTemperatureHalf",
  },
  {
    itemName: "微冰",
    itemId: "chkTemperatureFew",
  },
  {
    itemName: "去冰",
    itemId: "chkTemperatureNone",
  },
  {
    itemName: "溫的",
    itemId: "chkTemperatureWarm",
  },
  {
    itemName: "熱的",
    itemId: "chkTemperatureHot",
  },
]);

const addChooses = ref([
  {
    itemName: "珍珠",
    itemId: "chkPearl",
  },
  {
    itemName: "粉圓",
    itemId: "chkPink",
  },
  {
    itemName: "布丁",
    itemId: "chkPudding",
  },
  {
    itemName: "椰果",
    itemId: "chkCoconut",
  },
]);

const productLabels = ref([
  {
    itemName: "季節限定",
    itemId: "radioLableSeason",
  },
  {
    itemName: "果粒茶系列",
    itemId: "radioLabelPieces",
  },
  {
    itemName: "鮮果茶系列",
    itemId: "radioLabelFresh",
  },
  {
    itemName: "原味茶系列",
    itemId: "radioLabelOriginal",
  },
  {
    itemName: "香醇茶系列",
    itemId: "radioLabelMellow",
  },
]);

const addressChooses = ref([
  {
    itemName: "北",
    itemId: "chkNorth",
  },
  {
    itemName: "中",
    itemId: "chkMiddle",
  },
  {
    itemName: "南",
    itemId: "chkSouth",
  },
  {
    itemName: "花東",
    itemId: "chkEast",
  },
]);

const productStore = useProductStore();

const imgRest = ref(false);

const { newProductData, tempImageUrl, tempImageUrlName } =
  storeToRefs(productStore);

const { resetNewMemberData } = productStore;

const errors = ref({});

const handleAvatarUpdate = ({ name, data }) => {
  tempImageUrl.value = data; // 可以將數據保存到本地狀態
  tempImageUrlName.value = name;
  newProductData.value.product_img = name;
  console.log("文件名字:", name);
  console.log("文件數據:", data); // 可以看到文件的 Data URL
  // 可以繼續上船數據到服務器或處理器
};

const handleCreateProduct = async () => {
  try {
    await productStore.createProductData(); // 等待函數完成
    imgRest.value = true; // 只有在成功後才設置為 true

    // 定義要檢查的特定欄位
    const fieldsToCheck = [
      "product_exhibit",
      "product_classify",
      "product_sweetness",
      "product_ice",
      "product_address",
    ];

    fieldsToCheck.forEach((field) => {
      const value = newProductData.value[field]; // 獲取欄位的值
      const initialErrors = validationField(field, value); // 獲取初始錯誤訊息
      if (initialErrors && initialErrors.length) {
        errors.value[field] = initialErrors; // 如果有錯誤，則顯示錯誤
      }
    });
  } catch (error) {
    imgRest.value = false;
  }
};

// hook
const onInputBlur = (e, inputText) => {
  const inputValueMap = {
    product_sweetness: newProductData.value.product_sweetness,
    product_ice: newProductData.value.product_ice,
    product_address: newProductData.value.product_address,
  };

  const inputValue =
    inputValueMap[inputText] !== undefined
      ? inputValueMap[inputText] // 如果有對應的值，則使用它
      : e.target.value; // 否則使用 input 的值

  const inputErrors = validationField(inputText, inputValue);
  inputErrors && inputErrors.length
    ? (errors.value[inputText] = inputErrors)
    : (errors.value[inputText] = null);
};

const isFormValid = computed(() => {
  // 確保 newProductData 存在並且所有屬性都有值
  if (
    !newProductData.value ||
    !newProductData.value.product_name ||
    !newProductData.value.product_price ||
    !newProductData.value.product_exhibit ||
    !newProductData.value.product_classify ||
    !newProductData.value.product_sweetness ||
    !newProductData.value.product_ice ||
    !newProductData.value.product_address ||
    !newProductData.value.product_img
  ) {
    return false; // 當任一屬性不存在時返回 false
  }

  // 檢查是否有圖片，確保 product_img 有值
  if (!newProductData.value.product_img) {
    return false; // 如果沒有圖片資料則返回 false
  }

  const {
    product_name,
    product_price,
    product_exhibit,
    product_classify,
    product_sweetness,
    product_ice,
    product_address,
  } = newProductData.value;
  // 驗證表單
  return validationForm({
    product_name,
    product_price,
    product_exhibit,
    product_classify,
    product_sweetness,
    product_ice,
    product_address,
  }).formIsValid;
});

// 視窗 910px
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

// 在組件加載時檢查錯誤
onMounted(() => {
  resetNewMemberData();

  // 定義要檢查的特定欄位
  const fieldsToCheck = [
    "product_exhibit",
    "product_classify",
    "product_sweetness",
    "product_ice",
    "product_address",
  ];

  fieldsToCheck.forEach((field) => {
    const value = newProductData.value[field]; // 獲取欄位的值
    const initialErrors = validationField(field, value); // 獲取初始錯誤訊息
    if (initialErrors && initialErrors.length) {
      errors.value[field] = initialErrors; // 如果有錯誤，則顯示錯誤
    }
  });

  // 視窗 910px
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="card-body d-flex justify-content-center">
    <div div class="col-12">
      <AddImgProductData
        @updateAvatar="handleAvatarUpdate"
        :imgRest="imgRest"
      />
      <div class="d-flex justify-content-center">
        <div class="col-10">
          <div class="mt-4">
            <label for="product_name">產品名稱</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              class="form-control"
              v-model="newProductData.product_name"
              @blur="onInputBlur($event, 'product_name')"
            />
            <ul
              class="input-error-style"
              v-if="errors.product_name && errors.product_name.length"
            >
              <li v-for="(error, index) in errors.product_name" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="product_price">產品價格</label>
            <input
              type="number"
              id="product_price"
              name="product_price"
              class="form-control"
              v-model="newProductData.product_price"
              @blur="onInputBlur($event, 'product_price')"
            />
            <ul
              class="input-error-style"
              v-if="errors.product_price && errors.product_price.length"
            >
              <li v-for="(error, index) in errors.product_price" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="member_phone">上 / 下架</label>
            <div class="my-2 d-flex align-items-center">
              <select
                name="sugar"
                id="sugar"
                class="form-select"
                v-model="newProductData.product_exhibit"
                @change="onInputBlur($event, 'product_exhibit')"
              >
                <option selected disabled value="">---請選擇---</option>
                <option value="上架">上架</option>
                <option value="下架">下架</option>
              </select>
            </div>
            <ul
              class="input-error-style"
              v-if="errors.product_exhibit && errors.product_exhibit.length"
            >
              <li v-for="(error, index) in errors.product_exhibit" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="member_email">產品標籤</label>
            <div class="my-2 d-flex align-items-center product-row-style">
              <div
                class="form-check form-check-inline product-check-style"
                v-for="(item, index) in productLabels"
                :key="index"
              >
                <input
                  type="radio"
                  class="form-check-input"
                  :id="item.itemId"
                  name="radioLabel"
                  :value="item.itemName"
                  v-model="newProductData.product_classify"
                  @change="onInputBlur($event, 'product_classify')"
                />
                <label
                  :for="item.itemId"
                  class="form-check-label product-label-name"
                  >{{ item.itemName }}</label
                >
              </div>
            </div>
            <ul
              class="input-error-style"
              v-if="errors.product_classify && errors.product_classify.length"
            >
              <li
                v-for="(error, index) in errors.product_classify"
                :key="index"
              >
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="member_email">可選擇甜度</label>
            <div class="my-2 d-flex align-items-center">
              <div
                class="form-check form-check-inline"
                v-for="(item, index) in sweetChooses"
                :key="index"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="item.itemId"
                  :name="item.itemchkName"
                  :value="item.itemName"
                  v-model="newProductData.product_sweetness"
                  @change="onInputBlur($event, 'product_sweetness')"
                />
                <label
                  :for="item.itemId"
                  class="form-check-label product-label-name"
                  >{{ item.itemName }}</label
                >
              </div>
            </div>
            <ul
              class="input-error-style"
              v-if="errors.product_sweetness && errors.product_sweetness.length"
            >
              <li
                v-for="(error, index) in errors.product_sweetness"
                :key="index"
              >
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="member_email">可選擇溫度</label>
            <div class="my-2 d-flex align-items-center product-row-style">
              <div
                class="form-check form-check-inline product-check-style"
                v-for="(item, index) in temperatureChooses"
                :key="index"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="item.itemId"
                  name="chkTemperature"
                  :value="item.itemName"
                  v-model="newProductData.product_ice"
                  @change="onInputBlur($event, 'product_ice')"
                />
                <label
                  :for="item.itemId"
                  class="form-check-label product-label-name"
                  >{{ item.itemName }}</label
                >
              </div>
            </div>
            <ul
              class="input-error-style"
              v-if="errors.product_ice && errors.product_ice.length"
            >
              <li v-for="(error, index) in errors.product_ice" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="mt-4">
            <label for="member_email">可選擇加料</label>
            <div class="my-2 d-flex align-items-center">
              <div
                class="form-check form-check-inline"
                v-for="(item, index) in addChooses"
                :key="index"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="item.itemId"
                  name="chkSweet"
                  :value="item.itemName"
                  v-model="newProductData.product_add"
                />
                <label
                  :for="item.itemId"
                  class="form-check-label product-label-name"
                  >{{ item.itemName }}</label
                >
              </div>
            </div>
          </div>
          <div class="mt-4">
            <label for="member_email">販賣地區</label>
            <div class="my-2 d-flex align-items-center">
              <div
                class="form-check form-check-inline"
                v-for="(item, index) in addressChooses"
                :key="index"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  :id="item.itemId"
                  name="chkAddress"
                  :value="item.itemName"
                  v-model="newProductData.product_address"
                  @change="onInputBlur($event, 'product_address')"
                />
                <label
                  :for="item.itemId"
                  class="form-check-label product-label-name"
                  >{{ item.itemName }}</label
                >
              </div>
            </div>
            <ul
              class="input-error-style"
              v-if="errors.product_address && errors.product_address.length"
            >
              <li v-for="(error, index) in errors.product_address" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button
          class="me-2 btn-style add-btn"
          @click="handleCreateProduct"
          :disabled="!isFormValid"
        >
          新增
        </button>
        <RouterLink to="/product" class="btn-style cancel-btn">返回</RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
.btn-style {
  border-radius: 4px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.add-btn {
  border: 1px solid #6c6c6c;
  color: #272727;
  background-color: #ffffff;
  font-weight: 900;
  font-size: 12px;
}

.add-btn:hover {
  color: #ffffff;
  background-color: #272727;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  border: none;
  color: #ffffff;
  background-color: #e6367e;
}

.cancel-btn:hover {
  opacity: 0.8;
}

.product-check-style {
  flex: 0 0 10%;
}

.product-label-name {
  white-space: nowrap; /* 防止文字換行 */
}

@media (max-width: 760px) {
  .product-row-style {
    flex-wrap: wrap !important; /* 允許項目換行 */
  }
}
</style>