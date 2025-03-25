<template>
  <div>
    <div class="h-72">
      <time-chart-component :data="formattedData" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';

const TimeChartComponent = defineAsyncComponent(() => import('./TimeChartComponent.vue'));

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const formattedData = computed(() => {
  return props.data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    minutes_logged: entry.minutes_logged
  }));
});
</script>