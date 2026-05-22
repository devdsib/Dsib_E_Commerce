"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

export default function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    occupation: "",
    investmentBudget: "",
    experience: "",
    interestedArea: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiClient.post("/leads/franchise", formData);
      toast.success("Application Submitted! Our team will contact you shortly.");
      setFormData({
        name: "", email: "", phone: "", district: "", occupation: "",
        investmentBudget: "", experience: "", interestedArea: ""
      });
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi DSIB Tech! I am ${formData.name || "interested"}, looking to start a robotics franchise in ${formData.district || "my district"}. Please share details.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">Full Name *</label>
          <Input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">Phone Number *</label>
          <Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">Email Address *</label>
          <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">District/City *</label>
          <Input required name="district" value={formData.district} onChange={handleChange} placeholder="Chennai, Coimbatore..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">Current Occupation</label>
          <Input name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Engineer, Teacher, Business..." />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground/80">Interested Area</label>
          <Input name="interestedArea" value={formData.interestedArea} onChange={handleChange} placeholder="Robotics, IoT..." />
        </div>
      </div>
      
      <div className="space-y-1.5 mt-2">
        <label className="text-sm font-medium text-foreground/80">Investment Budget</label>
        <select 
          name="investmentBudget" 
          value={formData.investmentBudget} 
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select Budget</option>
          <option value="Under 2 Lakhs">Under 2 Lakhs</option>
          <option value="2-5 Lakhs">2-5 Lakhs</option>
          <option value="5-10 Lakhs">5-10 Lakhs</option>
          <option value="10 Lakhs+">10 Lakhs+</option>
        </select>
      </div>

      <div className="space-y-1.5 mt-2">
        <label className="text-sm font-medium text-foreground/80">Do you have prior experience in EdTech or Training?</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="experience" value="Yes" checked={formData.experience === "Yes"} onChange={handleChange} className="accent-accent" /> Yes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="experience" value="No" checked={formData.experience === "No"} onChange={handleChange} className="accent-accent" /> No
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          type="submit" 
          className="flex-1 text-white font-bold h-12" 
          style={{ backgroundColor: "hsl(var(--cta))" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 h-12 text-green-600 border-green-600 hover:bg-green-50"
          onClick={handleWhatsApp}
        >
          Discuss on WhatsApp
        </Button>
      </div>
    </form>
  );
}
