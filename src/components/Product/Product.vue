<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/products";
import { useMenuStore } from "@/stores/menu";
import AddImgProduct from "@/components/Img/AddImg_product.vue";
import PaginationMember from "../AppLayout/Pagination.vue";

const productStore = useProductStore();
const { products, selectedIds } = storeToRefs(productStore);

const menuStore = useMenuStore();
const { hideAddImgProduct } = storeToRefs(menuStore);

// 視窗 910px
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  // 視窗 910px
  windowWidth.value = window.innerWidth;
  // hideAddImgProduct
  hideAddImgProduct.value = window.matchMedia("(max-width: 600px)").matches;
};

const loading = ref(true);
const selectAll = ref(false); // 用於控制「全選」狀態
const img_path = "https://project01-back-end.onrender.com/img/product/";

// 分頁
const paginatedMembers = ref({});
const itemsPerPage = ref(5);
const currentPage = ref("");
const totalPages = ref("");
const getPaginatedMembers = (data) => {
  paginatedMembers.value = data;
};
const getCurrentPage = (data) => {
  currentPage.value = data;
};
const getTotalPages = (data) => {
  totalPages.value = data;
};

// 取得所有
const getProductData = async () => {
  await productStore.getProductData();
  // 延遲 0.5 秒後顯示資料
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
getProductData();

// 產品上下架
const handleProductExhibit = (id, exhibit) => {
  productStore.updateProductExhibit(id, exhibit);
};

// 全選或取消全選
const toggleSelectAll = () => {
  products.value.forEach((item) => {
    item.isChecked = selectAll.value;
  });
  // 只取得已選成員的 ID
  selectedIds.value = products.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};
// 檢查是否已全選
const checkIfAllSelected = (item) => {
  selectAll.value = products.value.every((item) => item.isChecked);
  console.log("Selected Product: ", item);

  // 只取得已選成員的 ID
  selectedIds.value = products.value
    .filter((item) => item.isChecked) // 篩選出已選中的成員
    .map((item) => item.id); // 取得已選成員的 id

  console.log("Selected Product IDs: ", selectedIds);
};

// 刪除產品
const handleDeleteProduct = () => {
  const confirmation = confirm("確定要刪除嗎?");
  if (confirmation) {
    productStore.deleteSelectedProducts();
  }
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWindowWidth);
});
</script>

<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title-style">
          <h4 class="mt-3" style="font-weight: 600">產品</h4>
          <div class="float-end">
            <RouterLink
              to="/product/create"
              class="company-btn-style add-user-btn"
              style="margin-right: 6px"
              >新增產品</RouterLink
            >
            <button
              class="company-btn-style delete-user-btn"
              @click="handleDeleteProduct"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <table
          class="table table-bordered product-table"
          v-if="windowWidth > 930"
        >
          <thead>
            <tr>
              <th width="5%" class="text-center">編號</th>
              <th width="15%" class="text-center">產品名稱</th>
              <th width="15%" class="text-center">預覽圖</th>
              <th width="12%" class="text-center">產品價格</th>
              <th width="10%" class="text-center">上/下架</th>
              <th width="10%" class="text-center">建立時間</th>
              <th width="10%" class="text-center">更新時間</th>
              <th width="10%" class="text-center">修改</th>
              <th width="8%" class="text-center">
                <div class="checkbox-title-style">
                  全選
                  <input
                    type="checkbox"
                    style="margin-left: 5px"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-if="!loading && paginatedMembers.length > 0">
            <tr v-for="(product, index) in paginatedMembers" :key="index">
              <td class="text-center align-middle">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="text-center align-middle">
                {{ product.product_name }}
              </td>
              <td class="text-center align-middle">
                <AddImgProduct
                  :img_path="img_path"
                  :img_avatar="product.product_img"
                  v-if="product.product_img"
                />
                <i class="material-icons icon-style-avatar" v-else>image</i>
              </td>
              <td class="text-center align-middle">
                NT. ${{ product.product_price }}
              </td>
              <td class="text-center align-middle">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  v-model="product.product_exhibit"
                >
                  <option selected disabled>請選擇</option>
                  <option value="上架">上架</option>
                  <option value="下架">下架</option>
                </select>
              </td>
              <td class="text-center align-middle">{{ product.create_at }}</td>
              <td class="text-center align-middle">{{ product.update_at }}</td>
              <td class="text-center align-middle">
                <div class="product-button-container">
                  <RouterLink
                    :to="{ path: 'product/' + product.id + '/update' }"
                    class="edit-btn-style add-user-btn product-btn1325 me-2"
                  >
                    修改
                  </RouterLink>
                  <button
                    class="edit-btn-style add-user-btn"
                    @click="
                      handleProductExhibit(product.id, product.product_exhibit)
                    "
                  >
                    儲存
                  </button>
                </div>
              </td>
              <td class="text-center align-middle">
                <input
                  type="checkbox"
                  v-model="product.isChecked"
                  @change="checkIfAllSelected(product)"
                />
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="9" class="text-center align-middle">Loading</td>
            </tr>
          </tbody>
        </table>

        <!-- 卡片呈現方式 -->
        <div class="card-list col-12" v-else>
          <div
            class="product-cardto910 col-12"
            v-for="(product, index) in paginatedMembers"
            :key="index"
          >
            <p class="member-cardlist-item">
              <strong>產品名稱:</strong> {{ product.product_name }}
            </p>
            <p class="member-cardlist-item">
              <strong>產品價格:</strong> NT. ${{ product.product_price }}
            </p>
            <AddImgProduct
              :img_path="img_path"
              :img_avatar="product.product_img"
              v-if="product.product_img && !hideAddImgProduct"
              class="product-img-910"
            />

            <p class="member-cardlist-item">
              <strong>建立時間:</strong> {{ product.create_at }}
            </p>
            <p class="member-cardlist-item">
              <strong>更新時間:</strong> {{ product.update_at }}
            </p>
            <p class="member-cardlist-item d-flex">
              <strong class="horizontal-text">上/下架:</strong
              ><select
                class="form-select"
                aria-label="Default select example"
                v-model="product.product_exhibit"
              >
                <option selected disabled>請選擇</option>
                <option value="上架">上架</option>
                <option value="下架">下架</option>
              </select>
            </p>
            <p class="member-cardlist-item align-items-center">
              <strong>修改:</strong>
              <RouterLink
                :to="{ path: 'product/' + product.id + '/update' }"
                class="edit-btn-style add-user-btn product-btn1325"
              >
                修改
              </RouterLink>
              <button
                class="edit-btn-style add-user-btn"
                @click="
                  handleProductExhibit(product.id, product.product_exhibit)
                "
              >
                儲存
              </button>
              <input
                type="checkbox"
                v-model="product.isChecked"
                @change="checkIfAllSelected(product)"
                class="ms-auto"
              />
            </p>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="products"
          :itemsPerPage="itemsPerPage"
          @paginatedMembers="getPaginatedMembers"
          @currentPage="getCurrentPage"
          @totalPages="getTotalPages"
        />
      </div>
    </div>
  </div>
</template>

<style>
.product-cardto910 {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.product-cardto910 p {
  margin: 0.5rem 0;
  padding-bottom: 10px; /* 增加底部內邊距 */
  border-bottom: 1px solid #ddd; /* 為每個 p 元素添加底部邊框 */
}

.product-cardto910 p:last-child {
  border-bottom: none; /* 最後一個 p 元素去掉底部邊框 */
}

.product-img-910 {
  position: absolute;
  top: 10px; /* 根據需求調整圖片的垂直位置 */
  right: 20px; /* 將圖片固定在右側 */
  object-fit: cover; /* 確保圖片比例 */
  border-radius: 4px;

  display: inline-block;
  background: white;
  padding: 3px;
  z-index: 1;
}

@media (max-width: 1450px) {
  .product-table thead th:nth-child(2),
  .product-table tbody td:nth-child(2) {
    width: 10%;
  }

  .product-table thead th:nth-child(4),
  .product-table tbody td:nth-child(4) {
    width: 10%;
  }
}

@media (max-width: 1325px) {
  td .product-btn1325 {
    margin-right: 0 !important;
    display: inline-block; /* 保持按钮的宽度 */
  }

  .product-button-container {
    display: flex;
    flex-direction: column; /* 让按钮垂直排列 */
    gap: 10px; /* 按钮之间的间距 */
  }
}

@media (max-width: 1200px) {
  .product-table thead th:nth-child(6),
  .product-table tbody td:nth-child(6) {
    display: none;
  }

  .product-table thead th:nth-child(7),
  .product-table tbody td:nth-child(7) {
    display: none;
  }
}

@media (max-width: 1100px) {
  .product-table thead th:nth-child(1),
  .product-table tbody td:nth-child(1) {
    width: 7%;
  }

  .product-table thead th:nth-child(3),
  .product-table tbody td:nth-child(3) {
    width: 13%;
  }
}

@media (max-width: 1000px) {
  .product-table thead th:nth-child(3),
  .product-table tbody td:nth-child(3) {
    width: 11%;
  }

  .product-table thead th:nth-child(5),
  .product-table tbody td:nth-child(5) {
    width: 12%;
  }
}
</style>
