<template>
    <div class="w-full h-full">
      <apexchart
        type="radar"
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
    dataKeys: {
      type: Array,
      required: true
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    colors: {
      type: Array,
      default: () => ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    }
  });
  
  const formatKeyName = (key) => {
    return key.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const series = computed(() => {
    return props.data.map(item => ({
      name: item[props.nameKey],
      data: props.dataKeys.map(key => item[key])
    }));
  });
  
  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'radar',
        height: '100%',
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif'
      },
      colors: props.colors.slice(0, props.data.length),
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.1
      },
      markers: {
        size: 4
      },
      xaxis: {
        categories: props.dataKeys.map(key => formatKeyName(key)),
        labels: {
          style: {
            colors: Array(props.dataKeys.length).fill('#64748b')
          }
        }
      },
      yaxis: {
        max: 100,
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: '#64748b'
        }
      },
      tooltip: {
        theme: 'light'
      }
    };
  });
  </script>