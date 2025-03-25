<template>
    <div class="w-full h-full">
      <apexchart
        type="line"
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
    xKey: {
      type: String,
      default: 'name'
    },
    lines: {
      type: Array,
      default: () => []
    }
  });
  
  const series = computed(() => {
    return props.lines.map(line => ({
      name: line.name,
      data: props.data.map(item => item[line.key])
    }));
  });
  
  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'line',
        height: '100%',
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif'
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: props.lines.map(line => line.color),
      xaxis: {
        categories: props.data.map(item => item[props.xKey]),
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#64748b'
        }
      },
      tooltip: {
        theme: 'light'
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            legend: {
              position: 'bottom',
              horizontalAlign: 'center'
            }
          }
        }
      ]
    };
  });
  </script>