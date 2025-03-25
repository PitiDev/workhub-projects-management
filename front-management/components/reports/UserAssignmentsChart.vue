<template>
  <div>
    <div class="flex flex-col mb-4">
      <div v-if="sortedData.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
        No data available
      </div>
      <div v-else class="overflow-x-auto">
        <div v-for="(user, index) in sortedData" :key="user.id" class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium truncate text-gray-800 dark:text-gray-200">{{ user.full_name }}</span>
            <span class="text-gray-600 dark:text-gray-400">{{ user.assigned_tasks }} tasks ({{ formatPercentage(user.percentage) }}%)</span>
          </div>
          <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full" 
              :class="getBarColor(index)"
              :style="{ width: `${user.percentage}%` }"
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
  return [...props.data].sort((a, b) => b.percentage - a.percentage).slice(0, 10);
});

const formatPercentage = (value) => {
  return parseFloat(value).toFixed(1);
};

const getBarColor = (index) => {
  const colors = [
    'bg-blue-500 dark:bg-blue-600',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-purple-500 dark:bg-purple-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-red-500 dark:bg-red-600',
    'bg-orange-500 dark:bg-orange-600',
    'bg-yellow-500 dark:bg-yellow-600',
    'bg-green-500 dark:bg-green-600',
    'bg-teal-500 dark:bg-teal-600',
    'bg-cyan-500 dark:bg-cyan-600'
  ];
  
  return colors[index % colors.length];
};
</script>