import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Mail, Calculator } from "lucide-react";
import { SalaryResults } from "./SalaryResults";
import { currencies } from "./CurrencyList";

type ExchangeRates = {
  [key: string]: number;
};

type SalaryData = {
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

export function SalaryCalculator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [salaryData, setSalaryData] = useState<SalaryData>({
    baseSalary: 0,
    targetSalary: 0,
    inflationRate: 2.5,
    absoluteIncrease: 0,
    percentageGrowth: 0,
    prevYearly: 0,
    newYearly: 0,
    newYearlyInflation: 0,
    convertedPrevYearly: 0,
    convertedNewYearly: 0,
    convertedInflationAdjusted: 0,
    realIncreasePercentage: 0,
    inputCurrency: "USD",
    conversionCurrency: "EUR",
  });
  
  const [formValues, setFormValues] = useState({
    baseSalary: "",
    targetSalary: "",
    inflationRate: "2.5",
    inputCurrency: "USD",
    conversionCurrency: "EUR",
    email: "",
  });

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        toast({
          title: "Error",
          description: "Failed to fetch exchange rates. Using default values.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    fetchExchangeRates();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const calculateSalary = () => {
    setLoading(true);
    
    const baseSalary = parseFloat(formValues.baseSalary);
    const targetSalary = parseFloat(formValues.targetSalary);
    const inflationRate = parseFloat(formValues.inflationRate);
    const inputCurrency = formValues.inputCurrency;
    const conversionCurrency = formValues.conversionCurrency;

    if (isNaN(baseSalary) || isNaN(targetSalary)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid salary amounts.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const absoluteIncrease = targetSalary - baseSalary;
    const percentageGrowth = (absoluteIncrease / baseSalary) * 100;
    const prevYearly = baseSalary * 12;
    const newYearly = targetSalary * 12;
    const newYearlyInflation = newYearly / (1 + inflationRate / 100);
    const realIncreasePercentage = ((newYearlyInflation / prevYearly) - 1) * 100;
    
    let convertedPrevYearly = 0;
    let convertedNewYearly = 0;
    let convertedInflationAdjusted = 0;
    
    if (exchangeRates[inputCurrency] && exchangeRates[conversionCurrency]) {
      const conversionFactor = exchangeRates[conversionCurrency] / exchangeRates[inputCurrency];
      convertedPrevYearly = prevYearly * conversionFactor;
      convertedNewYearly = newYearly * conversionFactor;
      convertedInflationAdjusted = newYearlyInflation * conversionFactor;
    }

    const newSalaryData = {
      baseSalary,
      targetSalary,
      inflationRate,
      absoluteIncrease,
      percentageGrowth,
      prevYearly,
      newYearly,
      newYearlyInflation,
      convertedPrevYearly,
      convertedNewYearly,
      convertedInflationAdjusted,
      realIncreasePercentage,
      inputCurrency,
      conversionCurrency,
    };
    
    setSalaryData(newSalaryData);
    setHasCalculated(true);
    setLoading(false);
    
    setTimeout(() => {
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 500);
  };

  const sendEmailReport = () => {
    const email = formValues.email;
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report sent",
      description: "Your salary analysis has been sent to your email.",
    });
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-lg border-slate-200/60 dark:border-slate-800/60 glass-card overflow-hidden transition-all duration-500 ease-in-out">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Salary Growth Calculator
            </CardTitle>
          </div>
          <CardDescription>
            Calculate your salary growth and adjust for inflation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Current Monthly Salary</Label>
              <Input
                id="baseSalary"
                placeholder="Enter your current monthly salary"
                type="number"
                value={formValues.baseSalary}
                onChange={handleInputChange}
                className="input-focus-ring"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetSalary">Target Monthly Salary</Label>
              <Input
                id="targetSalary"
                placeholder="Enter your target monthly salary"
                type="number"
                value={formValues.targetSalary}
                onChange={handleInputChange}
                className="input-focus-ring"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inflationRate">Annual Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                placeholder="Enter annual inflation rate"
                type="number"
                step="0.1"
                value={formValues.inflationRate}
                onChange={handleInputChange}
                className="input-focus-ring"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inputCurrency">Input Currency</Label>
                <Select
                  value={formValues.inputCurrency}
                  onValueChange={(value) => handleSelectChange("inputCurrency", value)}
                >
                  <SelectTrigger className="w-full input-focus-ring">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search currencies..."
                        className="mb-2"
                        onChange={(e) => {
                          const search = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('[data-currency]');
                          items.forEach(item => {
                            const text = item.textContent?.toLowerCase() || '';
                            (item as HTMLElement).style.display = text.includes(search) ? '' : 'none';
                          });
                        }}
                      />
                    </div>
                    {currencies.map((currency) => (
                      <SelectItem 
                        key={currency.code} 
                        value={currency.code}
                        data-currency="true"
                      >
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conversionCurrency">Conversion Currency</Label>
                <Select
                  value={formValues.conversionCurrency}
                  onValueChange={(value) => handleSelectChange("conversionCurrency", value)}
                >
                  <SelectTrigger className="w-full input-focus-ring">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search currencies..."
                        className="mb-2"
                        onChange={(e) => {
                          const search = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('[data-currency]');
                          items.forEach(item => {
                            const text = item.textContent?.toLowerCase() || '';
                            (item as HTMLElement).style.display = text.includes(search) ? '' : 'none';
                          });
                        }}
                      />
                    </div>
                    {currencies.map((currency) => (
                      <SelectItem 
                        key={currency.code} 
                        value={currency.code}
                        data-currency="true"
                      >
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full group transition-all" 
            onClick={calculateSalary}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Calculate <Calculator className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      {hasCalculated && showResults && (
        <div 
          ref={resultsRef}
          className={`mt-8 transition-all duration-500 ease-in-out ${
            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SalaryResults 
            data={salaryData} 
            email={formValues.email}
            onEmailChange={handleInputChange}
            onSendEmail={sendEmailReport}
          />
        </div>
      )}
    </>
  );
}
