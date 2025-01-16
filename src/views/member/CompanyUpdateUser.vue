<script setup>
import { ref } from 'vue'
import CompanyUpdate from "@/components/Member/CompanyUpdate.vue";

const companyPwd = ref(true);

const headerTitle = ref("修改個人人員資料");
</script>

<template>
  <div>
    <CompanyUpdate :companyPwd="companyPwd" :headerTitle="headerTitle"/>
  </div>
</template>

<style>
</style>