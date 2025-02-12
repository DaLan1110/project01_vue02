<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { validationField, validationForm } from "@/hook/validationHook";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/products";
import AddImgProductUpdate from "@/components/Img/AddImg_productUpdate.vue";
import ProductUpdate910 from "@/components/Product/ProductUpdate910.vue";

const route = useRoute();
const routePathId = route.params.id;

const orderId = history.state.orderId;
if (orderId) {
  console.log(orderId); // 應該正確顯示 orderId
} else {
  console.log("沒有 orderId");
}

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
const {
  product,
  tempImageUrl,
  tempImageUrlName,
  selectedSweetness,
  selectedIce,
  selectedAdd,
  selectedAddress,
} = storeToRefs(productStore);

const img_path = "https://project01-back-end.onrender.com/img/product/";
const errors = ref({});

const handleAvatarUpdate = ({ name, data }) => {
  tempImageUrl.value = data; // 可以將數據保存到本地狀態
  tempImageUrlName.value = name;
  console.log("文件名字:", name);
  console.log("文件數據:", data); // 可以看到文件的 Data URL
  // 可以繼續上船數據到服務器或處理器
};

// 讀取單筆資料
const handleProductDataById = async () => {
  await productStore.getOneProductData(routePathId);
  productStore.initSelected();
};
handleProductDataById();

// 更新產品資料
const handleUpdateProductData = async () => {
  await productStore.updateProductData(routePathId);
  productStore.getOneProductData(routePathId);
};

// hook
const onInputBlur = (e, inputText) => {
  const inputValueMap = {
    product_sweetness: selectedSweetness.value,
    product_ice: selectedIce.value,
    product_address: selectedAddress.value,
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

// 確保 newProductData 存在並且所有屬性都有值
watch(
  () => [
    selectedSweetness.value,
    selectedIce.value,
    selectedAddress.value,
    selectedAdd.value,
    product.value.product_name,
  ],
  ([newSweet, newIce, newAddress, newAdd, newName]) => {
    console.log(newSweet, newIce, newAddress, newAdd, newName);
    product.value.product_sweetness = selectedSweetness.value;
    product.value.product_ice = selectedIce.value;
    product.value.product_address = selectedAddress.value;
    product.value.product_add = selectedAdd.value;
  }
);

const isFormValid = computed(() => {
  if (
    !product.value ||
    !product.value.product_name ||
    !product.value.product_price ||
    !product.value.product_exhibit ||
    !product.value.product_classify ||
    !selectedSweetness.value ||
    !selectedIce.value ||
    !selectedAddress.value
  ) {
    return false; // 當任一屬性不存在時返回 false
  }
  const {
    product_name,
    product_price,
    product_exhibit,
    product_classify,
    product_sweetness,
    product_ice,
    product_address,
  } = product.value;
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

onMounted(() => {
  // 視窗 910px
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="container mt-5" style="display: flex; justify-content: center">
    <div class="card col-12">
      <div class="card-header mt-2"><h4 class="mt-1">修改產品</h4></div>
      <div
        class="card-body d-flex justify-content-center"
        v-if="windowWidth > 910"
      >
        <div class="col-6 col-xl-5">
          <AddImgProductUpdate
            :img_path="img_path"
            :img_avatar="product.product_img"
            @updateAvatar="handleAvatarUpdate"
          />
        </div>
        <div class="col-6 col-xl-5">
          <div class="mt-4">
            <label for="product_name">產品名稱</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              class="form-control"
              v-model="product.product_name"
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
              v-model="product.product_price"
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
            <label for="sugar">上 / 下架</label>
            <div class="my-2 d-flex align-items-center">
              <select
                name="sugar"
                id="sugar"
                class="form-select"
                v-model="product.product_exhibit"
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
            <label for="radioLabel">產品標籤</label>
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
                  v-model="product.product_classify"
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
            <label for="">可選擇甜度</label>
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
                  v-model="selectedSweetness"
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
            <label for="chkTemperature">可選擇溫度</label>
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
                  v-model="selectedIce"
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
            <label for="chkAdd">可選擇加料</label>
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
                  name="chkAdd"
                  :value="item.itemName"
                  v-model="selectedAdd"
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
            <label for="chkAddress">販賣地區</label>
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
                  v-model="selectedAddress"
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

          <div class="mt-4 d-flex justify-content-end">
            <RouterLink
              :to="{ path: '/order/' + orderId + '/data' }"
              v-if="orderId"
              class="btn-style add-btn me-2"
              >返回訂單</RouterLink
            >
            <button
              class="me-2 btn-style add-btn"
              :disabled="!isFormValid"
              @click="handleUpdateProductData"
            >
              儲存
            </button>
            <RouterLink to="/product" class="btn-style cancel-btn"
              >返回</RouterLink
            >
          </div>
        </div>
      </div>

      <ProductUpdate910 v-else />
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

@media (max-width: 1450px) {
  .product-row-style {
    flex-wrap: wrap !important; /* 允許項目換行 */
  }
}
</style>