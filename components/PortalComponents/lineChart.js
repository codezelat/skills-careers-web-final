"use client"
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const lineData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Job Posts',
        data: [9, 10, 18, 22, 13, 25, 15],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => ` ${tooltipItem.raw}`,
        },
        backgroundColor: '#4F46E5',
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
        padding: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        position: 'top', // Display x-axis at the top
        grid: {
          drawOnChartArea: true, // Draw vertical lines
          drawTicks: false, // Hide tick marks
          lineWidth: 1,
          color: '#E5E7EB', // Light gray for vertical lines
          borderDash: [4, 4], // Dashed lines
          border: false, // Remove top border
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          callback: function (value, index, ticks) {
            const dayLabel = this.getLabelForValue(value); // Day (e.g., Sun, Mon)
            const chartValue = lineData.datasets[0].data[index]; // Value from the dataset
            return `${dayLabel}\n${chartValue}`; // Corrected template literal
          },
        },
      },
      y: {
        grid: {
          display: false, // No horizontal grid lines
          border: false, // Remove left border
        },
        ticks: {
          display: false, // Remove Y-axis values
        },
      },
    },
  };

  const customXLabelPlugin = {
    id: 'customXLabelPlugin',
    afterDraw(chart) {
      const {
        ctx,
        scales: { x },
      } = chart;

      x.ticks.forEach((tick, index) => {
        const value = chart.data.datasets[0].data[index]; // Get the value
        ctx.save();
        ctx.fillStyle = '#001571'; // Set the custom color
        ctx.font = '12px Arial'; // Set font style and size
        ctx.textAlign = 'center';
        ctx.fillText(value, x.getPixelForValue(tick.value), x.bottom + 20); // Position under day label
        ctx.restore();
      });
    },
  };

  return (
    <>
       
        <Line data={lineData} options={lineOptions} plugins={[customXLabelPlugin]} />
    </>
  );
}
