<template>
  <div class="h-full w-full">
    <div v-if="!chartData || chartData.length === 0" class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      No time tracking data available
    </div>
    <div v-else class="h-full w-full" ref="chartContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

const chartContainer = ref(null);
let chart = null;

// Computed to normalize the data for chart
const chartData = computed(() => {
  if (!props.data || props.data.length === 0) return [];
  
  return props.data.map(item => ({
    date: typeof item.date === 'string' ? item.date : new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    hours: Math.round((item.minutes_logged / 60) * 100) / 100,
    minutes: item.minutes_logged
  }));
});

// Function to initialize the chart
const initChart = () => {
  if (!chartContainer.value || !chartData.value || chartData.value.length === 0) return;
  
  // Make sure we're on client side
  if (typeof window === 'undefined' || !window.document) return;
  
  try {
    // Create a simple SVG-based chart since we don't want external dependencies
    const container = chartContainer.value;
    container.innerHTML = '';
    
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    
    // Calculate min/max
    const data = chartData.value;
    const maxValue = Math.max(...data.map(d => d.hours)) * 1.1; // Add 10% padding
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
    container.appendChild(svg);
    
    // Create chart group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Add grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = height - (i / gridCount) * height;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#e5e7eb');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '5,5');
      g.appendChild(line);
      
      // Add y-axis labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', -10);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('alignment-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('fill', '#9ca3af');
      text.textContent = `${Math.round((i / gridCount) * maxValue)}h`;
      g.appendChild(text);
    }
    
    // Add vertical axis label
    const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisLabel.setAttribute('transform', `rotate(-90)`);
    yAxisLabel.setAttribute('x', -height / 2);
    yAxisLabel.setAttribute('y', -40);
    yAxisLabel.setAttribute('text-anchor', 'middle');
    yAxisLabel.setAttribute('font-size', '12');
    yAxisLabel.setAttribute('fill', '#6b7280');
    yAxisLabel.textContent = 'Hours';
    g.appendChild(yAxisLabel);
    
    // Draw bars
    const barWidth = width / data.length * 0.7;
    const padding = width / data.length * 0.15;
    
    data.forEach((d, i) => {
      const barHeight = (d.hours / maxValue) * height;
      const x = i * (barWidth + padding) + padding;
      const y = height - barHeight;
      
      // Bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x);
      bar.setAttribute('y', y);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', barHeight);
      bar.setAttribute('fill', '#3b82f6');
      bar.setAttribute('rx', '2');
      
      // Add hover tooltip
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${d.date}: ${d.hours} hours (${d.minutes} minutes)`;
      bar.appendChild(title);
      
      g.appendChild(bar);
      
      // X-axis labels
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + barWidth / 2);
      text.setAttribute('y', height + 20);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#6b7280');
      
      // Format date label based on how many we're showing
      text.textContent = d.date;
      text.setAttribute('transform', `rotate(45, ${x + barWidth / 2}, ${height + 20})`);
      
      g.appendChild(text);
    });
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', width / 2);
    title.setAttribute('y', 0);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '14');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#4b5563');
    title.textContent = 'Time Logged by Day';
    g.appendChild(title);
    
    chart = {
      container: container,
      svg: svg,
      destroy: () => {
        if (container) {
          container.innerHTML = '';
        }
      }
    };
  } catch (error) {
    console.error('Error creating chart:', error);
    if (chartContainer.value) {
      chartContainer.value.innerHTML = `<div class="p-4 text-red-500">Error creating chart: ${error.message}</div>`;
    }
  }
};

// Clean up
const destroyChart = () => {
  if (chart && chart.destroy) {
    chart.destroy();
    chart = null;
  }
};

// Initialize chart on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    // Delay rendering to allow container to be properly sized
    setTimeout(() => {
      initChart();
    }, 100);
  }
});

// Re-initialize chart when data changes
watch(chartData, () => {
  destroyChart();
  initChart();
}, { deep: true });

// Re-initialize on window resize
let resizeTimeout;
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    destroyChart();
    initChart();
  }, 300);
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
  destroyChart();
});
</script>