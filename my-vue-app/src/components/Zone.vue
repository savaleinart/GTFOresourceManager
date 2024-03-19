<script setup>
import {ref} from 'vue'

const props = defineProps(['zoneNumber']);
</script>

<template>
  <button>
    <h1>Zone {{ props.zoneNumber }}</h1>
  </button>
</template>

<style scoped>
  h1{
    font-size: 3.2ch;
    padding: 0px;
    margin: 0px;
  }

  button{
    padding: 4px;
    margin: 0px;
    background-color: transparent;
    border: none;
  }
  button:hover{
    padding: 4px;
    margin: 0px;
    border: none;
    background-color: transparent;
  }
</style>
