<template>
    <div class="w-full h-full">
      <apexchart
        type="bar"
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
    bars: {
      type: Array,
      default: () => []
    },
    stacked: {
      type: Boolean,
      default: true
    }
  });
  
  const series = computed(() => {
    return props.bars.map(bar => ({
      name: bar.name,
      data: props.data.map(item => item[bar.key])
    }));
  });
  
  const chartOptions = computed(() => {
    return {
      chart: {
        type: 'bar',
        height: '100%',
        stacked: props.stacked,
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 3
        }
      },
      colors: props.bars.map(bar => bar.color),
      dataLabels: {
        enabled: false
      },
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