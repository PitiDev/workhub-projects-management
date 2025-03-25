<template>
  <div>
    <div class="flex flex-col mb-4">
      <div v-if="sortedData.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
        No project data available
      </div>
      <div v-else class="overflow-x-auto">
        <div v-for="(project, index) in sortedData" :key="project.id" class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium truncate text-gray-800 dark:text-gray-200">{{ project.name }}</span>
            <span class="text-gray-600 dark:text-gray-400">
              {{ project.completed_tasks }}/{{ project.total_tasks }} tasks 
              ({{ formatPercentage(project.completion_percentage) }}%)
            </span>
          </div>
          <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-green-500 dark:bg-green-600 rounded-full" 
              :style="{ width: `${project.completion_percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const sortedData = computed(() => {
  return [...props.data]
    .filter(project => project.total_tasks > 0)
    .sort((a, b) => b.completion_percentage - a.completion_percentage);
});

const formatPercentage = (value) => {
  return parseFloat(value).toFixed(1);
};
</script>