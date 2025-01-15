"use client"
import { Bar } from 'react-chartjs-2';
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

export default function BarChart() {
  const barData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Active Users',
        data: [123, 521, 302, 459, 252, 289, 112],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderRadius: 10, // Rounded edges
        barPercentage: 0.6, // Adjust bar width
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
        grid: {
          drawOnChartArea: true, // Draw grid lines only on the chart area
          drawTicks: false, // Hide tick marks
          lineWidth: 1,
          color: '#E5E7EB', // Light gray for vertical lines
          borderDash: [4, 4], // Dashed lines
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
          callback: function (value, index) {
            // Get the label (day) and value from the dataset
            const dayLabel = this.getLabelForValue(value); // Day (e.g., Sun, Mon)
            const chartValue = barData.datasets[0].data[index]; // Value from the dataset

            // Return formatted label: day + newline + value
            return `${dayLabel}\n${chartValue}`; // Corrected template literal
          },
        },
      },
      y: {
        grid: {
          display: false, // Disable horizontal grid lines
        },
        ticks: {
          display: false, // Remove Y-axis values
        },
      },
    },
  };

  return (
    <>
      
        <Bar data={barData} options={barOptions} />
    </>
  );
}
