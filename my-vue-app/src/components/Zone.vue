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

</style>
