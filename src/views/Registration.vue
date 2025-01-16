<script setup>
import Registration from '../components/Registration/Registration.vue';
</script>

<template>
  <div>
    <Registration class="registration-style-row"/>
  </div>
</template>

<style>
.registration-style-row{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: #27272c;
    font-family: 'Fira sans', sans-serif;
}
</style>