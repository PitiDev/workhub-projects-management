<template>
    <div class="w-full h-full">
      <apexchart
        type="pie"
        height="100%"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  const props = defineProps({
    data: {
      type: Array,
      required: true
    },
    dataKey: {
      type: String,
      default: 'value'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    colors: {
      type: Array,
      default: () => ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']
    }
  });
  
  const series = computed(() => {
    return props.data.map(item => item[props.dataKey]);
  });
  
  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'pie',
        height: '100%',
        fontFamily: 'Inter, sans-serif'
      },
      labels: props.data.map(item => item[props.nameKey]),
      colors: props.colors,
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: '#64748b'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return Math.round(val) + '%';
        }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function(val) {
            return val;
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  });
  </script>