import React, { useEffect, useRef, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface NutritionChartProps {
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
}

export const NutritionChart = React.memo(function NutritionChart({
  kcal,
  protein,
  fat,
  carbohydrates,
  fibre,
}: NutritionChartProps) {
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null);

  // Calculate calories from macronutrients (memoized for performance)
  const nutritionData = useMemo(() => {
    const proteinKcal = protein * 4;
    const fatKcal = fat * 9;
    const carbsKcal = carbohydrates * 4;
    const fibreKcal = fibre * 2; // Approximate
    const otherKcal = Math.max(0, kcal - proteinKcal - fatKcal - carbsKcal - fibreKcal);
    const hasValidData = protein > 0 || fat > 0 || carbohydrates > 0 || fibre > 0;

    return {
      proteinKcal,
      fatKcal,
      carbsKcal,
      fibreKcal,
      otherKcal,
      hasValidData,
    };
  }, [protein, fat, carbohydrates, fibre, kcal]);

  const { proteinKcal, fatKcal, carbsKcal, fibreKcal, otherKcal, hasValidData } = nutritionData;

  const data = {
    labels: ["Białko", "Tłuszcze", "Węglowodany", "Błonnik", "Inne"],
    datasets: [
      {
        data: [proteinKcal, fatKcal, carbsKcal, fibreKcal, otherKcal],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // Green for protein
          "rgba(239, 68, 68, 0.8)", // Red for fat
          "rgba(59, 130, 246, 0.8)", // Blue for carbs
          "rgba(168, 85, 247, 0.8)", // Purple for fiber
          "rgba(156, 163, 175, 0.8)", // Gray for other
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(156, 163, 175, 1)",
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 0.9)",
          "rgba(239, 68, 68, 0.9)",
          "rgba(59, 130, 246, 0.9)",
          "rgba(168, 85, 247, 0.9)",
          "rgba(156, 163, 175, 0.9)",
        ],
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const label = context.label || "";
            const value = context.parsed;
            const percentage = ((value / kcal) * 100).toFixed(1);

            // Get grams for the specific nutrient
            let grams = 0;
            switch (context.dataIndex) {
              case 0:
                grams = protein;
                break;
              case 1:
                grams = fat;
                break;
              case 2:
                grams = carbohydrates;
                break;
              case 3:
                grams = fibre;
                break;
              default:
                grams = value / 4; // Approximate for "other"
            }

            return `${label}: ${grams.toFixed(1)}g (${value.toFixed(1)} kcal, ${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  // Cleanup chart on unmount
  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <>
      {!hasValidData ? (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-white/60 text-sm">Brak danych odżywczych</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          {/* Chart Header */}
          <div className="mb-4">
            <h5 className="text-md font-semibold text-white mb-2 text-center">Rozkład kaloryczny</h5>
            <p className="text-xs text-blue-100/70 text-center mb-4">Łącznie: {kcal} kcal</p>
          </div>

          {/* Doughnut Chart */}
          <div className="h-64 relative">
            <Doughnut
              ref={chartRef}
              data={data}
              options={options}
              aria-label="Wykres kołowy przedstawiający rozkład wartości odżywczych"
              role="img"
            />
          </div>

          {/* Accessibility table for screen readers */}
          <div className="sr-only">
            <table>
              <caption>Wartości odżywcze w gramach i kaloriach</caption>
              <thead>
                <tr>
                  <th>Składnik</th>
                  <th>Gramy</th>
                  <th>Kalorie</th>
                  <th>Procent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Białko</td>
                  <td>{protein.toFixed(1)}g</td>
                  <td>{proteinKcal.toFixed(1)} kcal</td>
                  <td>{((proteinKcal / kcal) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Tłuszcze</td>
                  <td>{fat.toFixed(1)}g</td>
                  <td>{fatKcal.toFixed(1)} kcal</td>
                  <td>{((fatKcal / kcal) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Węglowodany</td>
                  <td>{carbohydrates.toFixed(1)}g</td>
                  <td>{carbsKcal.toFixed(1)} kcal</td>
                  <td>{((carbsKcal / kcal) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>Błonnik</td>
                  <td>{fibre.toFixed(1)}g</td>
                  <td>{fibreKcal.toFixed(1)} kcal</td>
                  <td>{((fibreKcal / kcal) * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
});
