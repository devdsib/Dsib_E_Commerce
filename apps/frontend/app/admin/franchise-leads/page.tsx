"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/api-client";
import { Loader2, Download, Search, Edit } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface FranchiseLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  occupation: string;
  investmentBudget: string;
  experience: string;
  interestedArea: string;
  status: string;
  priorityScore: number;
  createdAt: string;
}

export default function AdminFranchiseLeadsPage() {
  const { token, user } = useAuthStore();
  const [leads, setLeads] = useState<FranchiseLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await apiClient.get("/leads/franchise", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data.leads || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load franchise leads");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/leads/franchise/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Lead status updated");
      fetchLeads();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const exportCSV = () => {
    const headers = "Name,Email,Phone,District,Occupation,Investment Budget,Experience,Interested Area,Status,Priority Score,Date\n";
    const csv = leads.map(l => 
      `"${l.name}","${l.email}","${l.phone}","${l.district}","${l.occupation || ''}","${l.investmentBudget || ''}","${l.experience || ''}","${l.interestedArea || ''}","${l.status}","${l.priorityScore}","${new Date(l.createdAt).toLocaleDateString()}"`
    ).join("\n");
    
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `franchise_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== "ADMIN") return <div className="p-10 text-center">Unauthorized Access</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Franchise Leads</h1>
          <p className="text-muted-foreground mt-1">Manage partner inquiries and franchise applications.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="border-accent text-accent hover:bg-accent/10">
          <Download className="w-4 h-4 mr-2" /> Export to CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, district, or email..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              Loading leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Profile</th>
                    <th className="px-6 py-4 font-semibold">Budget</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="bg-background hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-bold">
                          {lead.priorityScore}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{lead.name}</p>
                        <p className="text-muted-foreground">{lead.phone}</p>
                        <p className="text-muted-foreground text-xs">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">{lead.district}</td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{lead.occupation || "N/A"}</p>
                        <p className="text-muted-foreground text-xs">Exp: {lead.experience || "N/A"}</p>
                        <p className="text-muted-foreground text-xs mt-1">Area: {lead.interestedArea || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-green-600">
                        {lead.investmentBudget || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="text-sm border rounded p-1"
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="DISCUSSION">Discussion</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
