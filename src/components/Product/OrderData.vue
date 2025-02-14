<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useOrderStore } from "@/stores/order";
import AddImgProduct from "@/components/Img/AddImg_product.vue";
import PaginationMember from "../AppLayout/Pagination.vue";

const route = useRoute();
const routePathId = route.params.id;

const orderStore = useOrderStore();
const { order } = storeToRefs(orderStore);

// 分頁
const paginatedMembers = ref({});
const itemsPerPage = ref(3);
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

const getOneOrderData = () => {
  orderStore.getOneOrderData(routePathId);
};
getOneOrderData();

const completeOrderState = () => {
  const confirmation = confirm("確定要完成訂單嗎?");
  if (confirmation) {
    orderStore.updateCompleteOrderState(routePathId);
  }
};

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
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <div class="card-title-style">
          <h4 class="mt-3" style="font-weight: 600">訂單資料</h4>
        </div>
      </div>
      <div class="card-body">
        <div class="row d-flex align-items-center justify-content-center">
          <div class="col-5">
            <label for="product_price">訂單編號</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.order_number"
                readonly
              />
            </div>
          </div>
          <div class="col-5">
            <label for="product_price">訂單狀態</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.order_state"
                readonly
              />
            </div>
          </div>
          <div class="col-5">
            <label for="product_price">會員帳號</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.member_account"
                readonly
              />
            </div>
          </div>
          <div class="col-5">
            <label for="product_price">會員名稱</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.member_name"
                readonly
              />
            </div>
          </div>
          <div class="col-5">
            <label for="product_price">下訂時間</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.create_at"
                readonly
              />
            </div>
          </div>
          <div class="col-5">
            <label for="product_price">付款方式</label>
            <div class="my-2 d-flex align-items-center">
              <input
                type="text"
                id="product_price"
                name="product_price"
                class="form-control"
                v-model="order.order_pay"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row d-flex align-items-center justify-content-center">
          <table
            class="table table-bordered orderdata-table mt-4"
            style="width: 90%"
            v-if="windowWidth > 910"
          >
            <thead>
              <tr>
                <th width="5%" class="text-center">編號</th>
                <th width="15%" class="text-center">預覽圖</th>
                <th width="10%" class="text-center">產品名稱</th>
                <th width="10%" class="text-center">產品數量</th>
                <th width="10%" class="text-center">產品價格</th>
                <th width="10%" class="text-center">甜度</th>
                <th width="10%" class="text-center">溫度</th>
                <th width="14%" class="text-center">加料選擇</th>
                <th width="6%" class="text-center">查看</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paginatedMembers"
                :key="item.id"
                style="height: 40px"
              >
                <td class="text-center align-middle">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="text-center align-middle">
                  <AddImgProduct
                    :img_avatar="item.shop_img"
                    v-if="item.shop_img"
                  />
                  <i class="material-icons icon-style-avatar" v-else>image</i>
                </td>
                <td class="text-center align-middle">{{ item.shop_name }}</td>
                <td class="text-center align-middle">
                  {{ item.shop_quantity }}
                </td>
                <td class="text-center align-middle">
                  NT. ${{ item.shop_total }}
                </td>
                <td class="text-center align-middle">
                  {{ item.shop_sweetness }}
                </td>
                <td class="text-center align-middle">{{ item.shop_ice }}</td>
                <td class="text-center align-middle">{{ item.shop_add }}</td>
                <td class="text-center align-middle">
                  <RouterLink
                    :to="{
                      path: '/product/' + item.productId + '/update',
                      state: { orderId: order.id },
                    }"
                    class="edit-btn-style add-user-btn orderdata-btn"
                  >
                    查看
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 卡片呈現方式 -->
          <div class="card-list col-12" v-else>
            <div
              class="orderdata-cardto910"
              v-for="(item, index) in paginatedMembers"
              :key="index"
            >
              <p class="member-cardlist-item">
                <strong>產品名稱:</strong>{{ item.shop_name }}
              </p>
              <p class="member-cardlist-item">
                <strong>產品數量:</strong>{{ item.shop_quantity }}
              </p>
              <p class="member-cardlist-item">
                <strong>產品價格:</strong>NT. ${{ item.shop_total }}
              </p>
              <AddImgProduct
                :img_avatar="item.shop_img"
                v-if="item.shop_img"
                class="product-img-910"
              />
              <p class="member-cardlist-item">
                <strong>甜度:</strong>{{ item.shop_sweetness }}
              </p>
              <p class="member-cardlist-item">
                <strong>冰塊:</strong>{{ item.shop_ice }}
              </p>
              <p class="member-cardlist-item">
                <strong>加料選擇:</strong>{{ item.shop_add }}
              </p>
              <p class="member-cardlist-item">
                <strong>查看:</strong>
                <RouterLink
                  :to="{
                    path: '/product/' + item.productId + '/update',
                    state: { orderId: order.id },
                  }"
                  class="edit-btn-style add-user-btn orderdata-btn"
                >
                  查看
                </RouterLink>
              </p>
            </div>
          </div>
        </div>

        <!-- 分頁控制 -->
        <PaginationMember
          :dataPage="order.shoppingList"
          :itemsPerPage="itemsPerPage"
          @paginatedMembers="getPaginatedMembers"
          @currentPage="getCurrentPage"
          @totalPages="getTotalPages"
        />

        <div
          class="text-end fw-bold order-totalto910"
          style="margin-right: 4.5%; margin-top: -3%"
        >
          <h3>總金額: NT ${{ order.order_total }} 元</h3>
        </div>

        <div class="d-flex justify-content-end order-btnto910">
          <button
            v-if="order.order_state === '已收款'"
            class="btn-style add-btn me-3"
            @click="completeOrderState"
          >
            完成訂單
          </button>
          <RouterLink to="/order" class="btn-style cancel-btn">返回</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.total-amount {
  text-align: right; /* 對齊右邊 */
  font-weight: bold; /* 字體加粗 */
  margin-right: 100px !important; /* 右邊設置 20px 間距 */
}

.add-user-btn {
  border: 1px solid #6c6c6c;
  color: #272727;
  background-color: #ffffff;
  font-weight: 900;
  font-size: 12px;
  white-space: nowrap; /* 禁止文字換行 */
  text-align: center;
}

.add-user-btn:hover {
  color: #ffffff;
  background-color: #272727;
}

.orderdata-cardto910 {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.orderdata-cardto910 p {
  margin: 0.5rem 0;
  padding-bottom: 10px; /* 增加底部內邊距 */
  border-bottom: 1px solid #ddd; /* 為每個 p 元素添加底部邊框 */
}

.orderdata-cardto910 p:last-child {
  border-bottom: none; /* 最後一個 p 元素去掉底部邊框 */
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

@media (max-width: 1325px) {
  .orderdata-table thead th:nth-child(4),
  .orderdata-table tbody td:nth-child(4),
  .orderdata-table thead th:nth-child(5),
  .orderdata-table tbody td:nth-child(5),
  .orderdata-table thead th:nth-child(6),
  .orderdata-table tbody td:nth-child(6),
  .orderdata-table thead th:nth-child(7),
  .orderdata-table tbody td:nth-child(7) {
    width: 8%;
  }

  .orderdata-table thead th:nth-child(8),
  .orderdata-table tbody td:nth-child(8) {
    width: 9%;
  }
}

@media (max-width: 1200px) {
  .orderdata-table thead th:nth-child(2),
  .orderdata-table tbody td:nth-child(2) {
    width: 5%;
  }

  .orderdata-table thead th:nth-child(4),
  .orderdata-table tbody td:nth-child(4),
  .orderdata-table thead th:nth-child(6),
  .orderdata-table tbody td:nth-child(6),
  .orderdata-table thead th:nth-child(7),
  .orderdata-table tbody td:nth-child(7) {
    width: 6%;
  }

  .orderdata-table thead th:nth-child(8),
  .orderdata-table tbody td:nth-child(8) {
    width: 8%;
  }
}

@media (max-width: 1065px) {
  .orderdata-table thead th:nth-child(4),
  .orderdata-table tbody td:nth-child(4) {
    width: 5%;
  }

  .orderdata-table thead th:nth-child(9),
  .orderdata-table tbody td:nth-child(9) {
    width: 7%;
  }

  table th,
  table td {
    text-align: center; /* 文字置中 */
    vertical-align: middle; /* 垂直置中 */
  }

  table th,
  table td {
    word-wrap: break-word; /* 長文字自動換行 */
  }

  table {
    width: 100%; /* 表格寬度全屏 */
    table-layout: auto; /* 表格自適應寬度 */
  }
}

@media (max-width: 960px) {
  .orderdata-btn {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 910px) {
  .order-totalto910 {
    margin-right: 0 !important; /* 取消右邊外邊距 */
    margin-top: 5px !important; /* 取消上方外邊距 */
  }

  .order-btnto910 {
    margin-top: 15px !important; /* 取消上方外邊距 */
  }
}
</style>
