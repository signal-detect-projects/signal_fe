<template>
  <CatTable/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import CatTable from './components/CatTable.vue';

export default defineComponent({
  name: 'App',
  components: {
    CatTable
  }
});
</script>

<style>

</style>
