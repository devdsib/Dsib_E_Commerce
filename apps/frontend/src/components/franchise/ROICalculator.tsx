"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ROICalculator() {
  const [cityType, setCityType] = useState("Tier 2");
  const [studentsPerMonth, setStudentsPerMonth] = useState(50);
  const [courseFee, setCourseFee] = useState(3000);

  // Constants
  const monthlyRent = cityType === "Tier 1" ? 40000 : cityType === "Tier 2" ? 25000 : 15000;
  const trainerSalary = 20000;
  const marketingExp = 10000;
  const miscExp = 5000;
  const totalFixedCosts = monthlyRent + trainerSalary + marketingExp + miscExp;
  
  const kitCostPerStudent = 800; // Variable cost
  
  // Calculations
  const revenue = studentsPerMonth * courseFee;
  const variableCosts = studentsPerMonth * kitCostPerStudent;
  const profit = revenue - variableCosts - totalFixedCosts;
  
  const initialInvestment = cityType === "Tier 1" ? 500000 : cityType === "Tier 2" ? 350000 : 250000;
  const monthlyROI = ((profit / initialInvestment) * 100).toFixed(1);
  const breakevenMonths = Math.ceil(initialInvestment / Math.max(profit, 1));

  return (
    <Card className="bg-background shadow-xl border-accent/20 border-2">
      <CardContent className="p-6 sm:p-8">
        <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Interactive Earning Potential</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">City Type</label>
              <div className="flex gap-2">
                {["Tier 1", "Tier 2", "Tier 3"].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setCityType(tier)}
                    className={`flex-1 py-2 px-3 text-sm rounded-md font-medium transition-colors border ${cityType === tier ? 'bg-accent text-white border-accent' : 'bg-muted/30 hover:bg-muted border-transparent'}`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-2 flex justify-between">
                <span>Students per Month</span>
                <span className="text-accent">{studentsPerMonth}</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="200" 
                step="5"
                value={studentsPerMonth} 
                onChange={(e) => setStudentsPerMonth(Number(e.target.value))} 
                className="w-full accent-accent"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-2 flex justify-between">
                <span>Avg Course Fee (₹)</span>
                <span className="text-accent">₹{courseFee.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="1500" 
                max="10000" 
                step="500"
                value={courseFee} 
                onChange={(e) => setCourseFee(Number(e.target.value))} 
                className="w-full accent-accent"
              />
            </div>
          </div>
          
          <div className="bg-muted/20 p-6 rounded-xl border border-border flex flex-col justify-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Estimated Monthly Revenue</p>
              <p className="text-3xl font-bold text-foreground">₹{revenue.toLocaleString()}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Estimated Monthly Profit</p>
              <p className="text-3xl font-bold text-green-600">₹{profit.toLocaleString()}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly ROI</p>
                <p className="text-lg font-bold text-accent">{monthlyROI}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Breakeven</p>
                <p className="text-lg font-bold text-foreground">{breakevenMonths} Months</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-6 text-center italic">
          * This is an estimation model. Actual figures may vary based on location, marketing efforts, and operational efficiency. Fixed costs modeled: Rent, Trainer, Marketing.
        </p>
      </CardContent>
    </Card>
  );
}
