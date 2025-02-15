<script setup>
</script>

<template>
  <div class="card button-card-style">
    <div class="card-header button-card-header">
      <h4 class="mt-3" style="font-weight: 600">快速操作</h4>
    </div>
    <div class="card-body button-card-style-body">
      <router-link to="/product/create" class="icon-container">
        <i class="material-icons">add_card</i>
        <span class="home-button-text">新增產品</span>
      </router-link>
      <router-link to="/product" class="icon-container">
        <i class="material-icons">store</i>
        <span class="home-button-text">產品管理</span>
      </router-link>
      <router-link to="/order" class="icon-container">
        <i class="material-icons">article</i>
        <span class="home-button-text">訂單管理</span>
      </router-link>
      <router-link to="/member" class="icon-container">
        <i class="material-icons">manage_accounts</i>
        <span class="home-button-text">用戶管理</span>
      </router-link>
      <router-link to="/company" class="icon-container">
        <i class="material-icons">supervisor_account</i>
        <span class="home-button-text">公司管理</span>
      </router-link>
    </div>
  </div>
</template>

<style>
.button-card-style {
  height: 100%; /* 填滿父容器的高度 */
  width: 100%; /* 填滿父容器的寬度 */
  background-color: #fff; /* 白色背景 */
  border: 1px solid #ddd; /* 邊框 */
  border-radius: 10%; /* 圓角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  display: flex;
  flex-direction: column; /* 內容垂直排列 */
  box-sizing: border-box;
}

/* 卡片內容 */
.button-card-style-body {
  display: flex;
  justify-content: space-evenly; /* 按鈕左右均分 */
  align-items: center; /* 垂直置中 */
  flex-grow: 1; /* 填滿剩餘空間 */
}

.icon-container {
  display: flex;
  flex-direction: column; /* 圖標與文字上下排列 */
  align-items: center; /* 垂直置中 */
  text-decoration: none; /* 移除連結下劃線 */
  color: #8e8e8e; /* 預設藍色 */
  font-size: 14px; /* 文字大小 */
  transition: color 0.3s ease;
}

.icon-container i {
  font-size: 42px; /* 圖標大小 */
  margin-bottom: 5px; /* 圖標與文字間距 */
}

.icon-container span {
  font-size: 14px; /* 文字大小 */
  font-weight: 500; /* 文字加粗 */
}

.icon-container:hover {
  color: #0056b3; /* 滑鼠懸停改為深藍色 */
}

.icon-container:hover span {
  font-weight: 700; /* 滑鼠懸停時文字加粗 */
}

@media (max-width: 550px) {
  .home-button-text {
    font-size: 12px !important;
  }
}
</style>