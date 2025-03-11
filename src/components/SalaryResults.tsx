
import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, TrendingUp, DollarSign, Percent, BarChart2 } from "lucide-react";
import { ChartComponent } from "./ChartComponent";

type SalaryResultsProps = {
  data: {
    baseSalary: number;
    targetSalary: number;
    inflationRate: number;
    absoluteIncrease: number;
    percentageGrowth: number;
    prevYearly: number;
    newYearly: number;
    newYearlyInflation: number;
    convertedPrevYearly: number;
    convertedNewYearly: number;
    convertedInflationAdjusted: number;
    realIncreasePercentage: number;
    inputCurrency: string;
    conversionCurrency: string;
  };
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendEmail: () => void;
};

export function SalaryResults({ data, email, onEmailChange, onSendEmail }: SalaryResultsProps) {
  const resultsItems = [
    {
      label: "Absolute Increase",
      value: `${data.absoluteIncrease.toFixed(0)} ${data.inputCurrency}`,
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      delay: 0
    },
    {
      label: "Percentage Growth",
      value: `${data.percentageGrowth.toFixed(1)}%`,
      icon: <Percent className="h-4 w-4 text-blue-500" />,
      delay: 1
    },
    {
      label: "Previous Yearly Salary",
      value: `${data.prevYearly.toFixed(0)} ${data.inputCurrency}`,
      icon: <BarChart2 className="h-4 w-4 text-purple-500" />,
      delay: 2
    },
    {
      label: "New Yearly Salary",
      value: `${data.newYearly.toFixed(0)} ${data.inputCurrency}`,
      icon: <TrendingUp className="h-4 w-4 text-indigo-500" />,
      delay: 3
    },
    {
      label: "Inflation Adjusted Salary",
      value: `${data.newYearlyInflation.toFixed(0)} ${data.inputCurrency}`,
      icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
      delay: 4
    },
    {
      label: "Converted Previous Yearly",
      value: `${data.convertedPrevYearly.toFixed(0)} ${data.conversionCurrency}`,
      icon: <DollarSign className="h-4 w-4 text-purple-500" />,
      delay: 5
    },
    {
      label: "Converted New Yearly",
      value: `${data.convertedNewYearly.toFixed(0)} ${data.conversionCurrency}`,
      icon: <DollarSign className="h-4 w-4 text-indigo-500" />,
      delay: 6
    },
    {
      label: "Converted Inflation Adjusted",
      value: `${data.convertedInflationAdjusted.toFixed(0)} ${data.conversionCurrency}`,
      icon: <DollarSign className="h-4 w-4 text-orange-500" />,
      delay: 7
    }
  ];

  const careerAdvice = data.realIncreasePercentage < 5
    ? `Your nominal raise is ${data.percentageGrowth.toFixed(1)}%, but after inflation the real increase is ${data.realIncreasePercentage.toFixed(1)}%. Consider negotiating higher.`
    : `Great work! Your nominal raise is ${data.percentageGrowth.toFixed(1)}% and your real increase is ${data.realIncreasePercentage.toFixed(1)}%. Keep growing!`;

  // Generate 10-year projection data
  const generateProjectionData = () => {
    const nominal = [];
    const real = [];
    let currentNominal = data.newYearly;
    
    for (let year = 0; year <= 10; year++) {
      if (year === 0) {
        nominal.push(data.prevYearly);
        real.push(data.prevYearly);
      } else {
        currentNominal = currentNominal * (1 + data.percentageGrowth / 100);
        nominal.push(currentNominal);
        real.push(currentNominal / Math.pow(1 + data.inflationRate / 100, year));
      }
    }
    
    return {
      labels: Array.from({ length: 11 }, (_, i) => i.toString()),
      datasets: [
        {
          label: "Nominal Salary",
          data: nominal,
          borderColor: "rgba(99, 102, 241, 1)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
        },
        {
          label: "Inflation Adjusted",
          data: real,
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        },
      ],
    };
  };

  // Comparison chart data
  const comparisonData = {
    labels: ["Current Yearly", "New Yearly"],
    datasets: [
      {
        label: "Salary",
        data: [data.prevYearly, data.newYearly],
        backgroundColor: ["rgba(79, 70, 229, 0.7)", "rgba(16, 185, 129, 0.7)"],
        borderColor: ["rgba(79, 70, 229, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="w-full mx-auto shadow-xl border-slate-200/60 dark:border-slate-800/60 glass-card overflow-hidden gradient-border">
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-blue-400 dark:to-indigo-300">
          Salary Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resultsItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center p-3 rounded-lg bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/50 animate-in shadow-sm hover:shadow-md transition-shadow"
              style={{ "--index": item.delay } as React.CSSProperties}
            >
              <div className="mr-3 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-lg font-medium">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 animate-in shadow-sm" style={{ "--index": "8" } as React.CSSProperties}>
          <h3 className="font-medium mb-1 text-blue-700 dark:text-blue-300 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
            Professional Career Analysis
          </h3>
          <p className="text-blue-600 dark:text-blue-400">{careerAdvice}</p>
        </div>
        
        <div className="space-y-6 animate-in" style={{ "--index": "9" } as React.CSSProperties}>
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-medium mb-4 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-primary" />
              Salary Comparison
            </h3>
            <div className="h-[250px]">
              <ChartComponent 
                type="bar"
                data={comparisonData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.formattedValue} ${data.inputCurrency}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return `${value} ${data.inputCurrency}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-medium mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              10-Year Growth Projection
            </h3>
            <div className="h-[300px]">
              <ChartComponent 
                type="line"
                data={generateProjectionData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: ${parseInt(context.formattedValue).toLocaleString()} ${data.inputCurrency}`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Years'
                      }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return `${value} ${data.inputCurrency}`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 p-4 border rounded-lg border-slate-200 dark:border-slate-800 animate-in bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm" style={{ "--index": "10" } as React.CSSProperties}>
          <h3 className="font-medium flex items-center">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            Email Report
          </h3>
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={onEmailChange}
              className="input-focus-ring"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" onClick={onSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Send Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
