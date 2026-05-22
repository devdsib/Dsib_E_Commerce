"use client";

import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Rocket, Brain, Code, Cpu, Target, Award, 
  MapPin, CheckCircle2, DollarSign, Users, ChevronRight, MessageCircle 
} from "lucide-react";
import ROICalculator from "@/components/franchise/ROICalculator";
import LeadForm from "@/components/franchise/LeadForm";

export default function FranchisePage() {
  const [activeTab, setActiveTab] = useState("micro");

  return (
    <div className="relative bg-background overflow-hidden">
      <Head>
        <title>Start a Robotics Franchise | DSIB Tech Partner Program</title>
        <meta name="description" content="Build the future of STEM education. Partner with DSIB Tech and launch Robotics, IoT & Embedded Systems training in your city. High ROI franchise opportunity." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Start a Robotics Franchise | DSIB Tech Partner Program",
              "description": "Start your own Robotics Learning Center. High ROI franchise in Tamil Nadu.",
              "mainEntity": {
                "@type": "Offer",
                "name": "DSIB Tech Franchise Opportunity",
                "description": "Become a franchise partner for Robotics and STEM education.",
                "priceCurrency": "INR",
                "price": "250000",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "DSIB Tech"
                }
              }
            })
          }}
        />
      </Head>

      {/* SECTION 1: HERO BANNER */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 border border-accent/20">
              <Rocket className="w-4 h-4" />
              <span>South India's Fastest Growing EdTech Franchise</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Start Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">Robotics Learning Center</span> with DSIB Tech
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Build the future of STEM education. Partner with DSIB Tech and launch Robotics, IoT & Embedded Systems training in your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="text-white font-bold h-14 px-8 text-lg" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Apply for Franchise
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-background/50 backdrop-blur-sm hover:bg-muted/50 border-border">
                Download Brochure
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold text-foreground">13+ Years</p>
                <p className="text-sm text-muted-foreground">Experience</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">10,000+</p>
                <p className="text-sm text-muted-foreground">Students Trained</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Industry Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100+</p>
                <p className="text-sm text-muted-foreground">Institutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY ROBOTICS BUSINESS? */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Invest in a Robotics Education Business?</h2>
            <p className="text-lg text-muted-foreground">The STEM education market is booming, and the engineering skill gap is widening. Bridge the gap and build a highly profitable business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Schools", icon: Target, desc: "NEP 2020 mandates coding & robotics from 6th grade. Huge untapped B2B market." },
              { title: "Colleges", icon: Brain, desc: "Engineering students need hands-on IoT & embedded systems projects to get hired." },
              { title: "Training Centers", icon: MapPin, desc: "Parents are actively seeking after-school STEM programs for kids aged 8-16." },
              { title: "Industry", icon: Cpu, desc: "Companies are desperately looking for trained talent in AI, IoT, and Robotics." }
            ].map((item, i) => (
              <Card key={i} className="border-border hover:border-accent/50 transition-colors bg-background">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY CHOOSE DSIB */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why Choose DSIB Tech?</h2>
              <p className="text-lg text-muted-foreground mb-8">We don't just provide curriculum; we provide a complete business ecosystem designed for your success.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Proven Curriculum", "DSIB Robotics Kits", "Embedded Systems", 
                  "IoT Programs", "Marketing Support", "Teacher Training", 
                  "Student Certification", "Technical Support", "Lab Setup Guidance", "Business Mentoring"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="font-medium text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" alt="Students learning robotics" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="text-2xl font-bold">100% Practical Training</p>
                    <p className="opacity-90">Industry-aligned syllabus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FRANCHISE MODELS */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Franchise Models</h2>
            <p className="text-lg text-muted-foreground">Choose a model that fits your investment capacity and business goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Micro Franchise",
                desc: "Suitable for small towns & individuals",
                investment: "₹2 - 3 Lakhs",
                space: "300 - 500 sq.ft",
                margin: "40% - 50%",
                roi: "8 - 10 Months"
              },
              {
                title: "City Franchise",
                desc: "Suitable for tier 1 & 2 cities",
                investment: "₹5 - 8 Lakhs",
                space: "800 - 1200 sq.ft",
                margin: "50% - 60%",
                roi: "10 - 12 Months",
                popular: true
              },
              {
                title: "Master Franchise",
                desc: "Suitable for district level control",
                investment: "₹15 - 20 Lakhs",
                space: "1500+ sq.ft",
                margin: "Revenue Share",
                roi: "12 - 18 Months"
              }
            ].map((model, i) => (
              <Card key={i} className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${model.popular ? 'border-accent shadow-accent/20 shadow-xl' : 'border-border'}`}>
                {model.popular && <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MOST POPULAR</div>}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{model.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 h-10">{model.desc}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Investment</span>
                      <span className="font-bold">{model.investment}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Space Required</span>
                      <span className="font-bold">{model.space}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Profit Margin</span>
                      <span className="font-bold">{model.margin}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-muted-foreground">Expected ROI</span>
                      <span className="font-bold">{model.roi}</span>
                    </div>
                  </div>
                  
                  <Button className={`w-full ${model.popular ? 'text-white' : ''}`} variant={model.popular ? 'default' : 'outline'} style={model.popular ? { backgroundColor: "hsl(var(--cta))" } : {}} onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Get Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHAT YOU GET */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Partner Benefits: What You Get</h2>
            <p className="text-lg text-muted-foreground">We provide a turnkey solution to launch and grow your business.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {[
              { icon: Award, title: "Brand Usage Right", desc: "Use DSIB Tech's trusted brand name" },
              { icon: Code, title: "LMS Access", desc: "Digital platform for student learning" },
              { icon: Users, title: "Teacher Training", desc: "Comprehensive technical train-the-trainer" },
              { icon: Target, title: "Marketing Kit", desc: "Social media assets, flyers, standees" },
              { icon: Cpu, title: "Starter Kits", desc: "Initial hardware kits for lab setup" },
              { icon: CheckCircle2, title: "Certifications", desc: "Co-branded certificates for students" },
              { icon: MapPin, title: "Website Listing", desc: "Your center listed on our main portal" },
              { icon: MessageCircle, title: "Tech Support", desc: "Dedicated AMC & technical assistance" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-foreground/70" />
                </div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: EARNING POTENTIAL CALCULATOR */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <ROICalculator />
        </div>
      </section>

      {/* SECTION 9: PROCESS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">Your Journey to Success</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-start relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-border z-0" />
            
            {[
              { num: "01", title: "Apply", desc: "Fill the inquiry form" },
              { num: "02", title: "Discussion", desc: "Call with our experts" },
              { num: "03", title: "Agreement", desc: "Sign franchise MOU" },
              { num: "04", title: "Setup", desc: "Lab & material setup" },
              { num: "05", title: "Training", desc: "Train-the-trainer program" },
              { num: "06", title: "Launch", desc: "Start generating revenue" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/6 mb-8 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-background border-4 border-accent text-accent flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  {step.num}
                </div>
                <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: LEAD FORM */}
      <section id="lead-form" className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Take the First Step Today.</h2>
              <p className="text-xl text-background/80 mb-8">Join the fastest-growing STEM network in South India. Fill out the form to get the complete franchise prospectus.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">High Profit Margins</h4>
                    <p className="text-background/60">Low operational costs, high returns.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Future-Proof Business</h4>
                    <p className="text-background/60">AI and Robotics demand is booming.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <Card className="bg-background text-foreground border-none shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Franchise Inquiry</h3>
                  <LeadForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50 flex gap-3 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <Button className="flex-1 text-white font-bold h-12" style={{ backgroundColor: "hsl(var(--cta))" }} onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
          Apply Now
        </Button>
        <Button variant="outline" className="h-12 w-14 shrink-0 border-green-600 text-green-600 bg-green-50" onClick={() => window.open('https://wa.me/919876543210', '_blank')}>
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
}
