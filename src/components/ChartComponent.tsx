
import { useRef, useEffect } from "react";
import { Chart, registerables } from 'chart.js';
import { useTheme } from "./ThemeProvider";

// Register Chart.js components
Chart.register(...registerables);

type ChartComponentProps = {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
  data: any;
  options?: any;
};

export function ChartComponent({ type, data, options = {} }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { theme } = useTheme();

  // Colors for dark/light mode
  const getThemeColors = () => {
    return {
      gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      textColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // If there's an existing chart, destroy it
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        
        // Theme colors
        const { gridColor, textColor } = getThemeColors();
        
        // Default options based on theme
        const defaultOptions = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
                font: {
                  family: '"Inter", sans-serif'
                }
              }
            },
            tooltip: {
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              titleColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
              bodyColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              borderWidth: 1,
              padding: 10,
              boxPadding: 5,
              cornerRadius: 8,
              bodyFont: {
                family: '"Inter", sans-serif'
              },
              titleFont: {
                family: '"Inter", sans-serif',
                weight: 'bold'
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: gridColor
              },
              ticks: {
                color: textColor,
                font: {
                  family: '"Inter", sans-serif'
                }
              }
            },
            y: {
              grid: {
                color: gridColor
              },
              ticks: {
                color: textColor,
                font: {
                  family: '"Inter", sans-serif'
                }
              }
            }
          }
        };
        
        // Merge default options with provided options
        const mergedOptions = { 
          ...defaultOptions,
          ...options,
          scales: {
            ...defaultOptions.scales,
            ...(options.scales || {})
          },
          plugins: {
            ...defaultOptions.plugins,
            ...(options.plugins || {}),
            legend: {
              ...defaultOptions.plugins.legend,
              ...(options.plugins?.legend || {})
            },
            tooltip: {
              ...defaultOptions.plugins.tooltip,
              ...(options.plugins?.tooltip || {})
            }
          }
        };
        
        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type,
          data,
          options: mergedOptions
        });
      }
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options, theme]);

  // Update chart when theme changes
  useEffect(() => {
    if (chartInstance.current) {
      const { gridColor, textColor } = getThemeColors();
      
      if (chartInstance.current.options.scales?.x) {
        chartInstance.current.options.scales.x.grid.color = gridColor;
        chartInstance.current.options.scales.x.ticks.color = textColor;
      }
      
      if (chartInstance.current.options.scales?.y) {
        chartInstance.current.options.scales.y.grid.color = gridColor;
        chartInstance.current.options.scales.y.ticks.color = textColor;
      }
      
      if (chartInstance.current.options.plugins?.legend?.labels) {
        chartInstance.current.options.plugins.legend.labels.color = textColor;
      }
      
      if (chartInstance.current.options.plugins?.tooltip) {
        chartInstance.current.options.plugins.tooltip.backgroundColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)';
        chartInstance.current.options.plugins.tooltip.titleColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        chartInstance.current.options.plugins.tooltip.bodyColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        chartInstance.current.options.plugins.tooltip.borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      }
      
      chartInstance.current.update();
    }
  }, [theme]);

  return <canvas ref={chartRef} />;
}
