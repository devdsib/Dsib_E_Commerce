import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const createFranchiseLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      name, email, phone, district, occupation, 
      investmentBudget, experience, interestedArea 
    } = req.body;

    if (!name || !email || !phone || !district) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Basic priority scoring logic
    let priorityScore = 0;
    if (investmentBudget === "10 Lakhs+" || investmentBudget === "5-10 Lakhs") priorityScore += 5;
    if (experience === "Yes") priorityScore += 3;
    if (occupation?.toLowerCase().includes("engineer") || occupation?.toLowerCase().includes("business")) priorityScore += 2;

    const lead = await prisma.franchiseLead.create({
      data: {
        name,
        email,
        phone,
        district,
        occupation,
        investmentBudget,
        experience,
        interestedArea,
        priorityScore
      }
    });

    // Trigger Webhook for CRM/Sheets (e.g. Zapier / Make.com)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
        console.log(`✅ Webhook triggered for lead: ${lead.email}`);
      } catch (webhookError) {
        console.error("❌ Failed to trigger webhook:", webhookError);
        // We do not fail the request if the webhook fails
      }
    }

    res.status(201).json({ message: "Lead submitted successfully", lead });
  } catch (error) {
    next(error);
  }
};

export const getFranchiseLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.franchiseLead.findMany({
      orderBy: [
        { priorityScore: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    res.json({ leads });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await prisma.franchiseLead.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    res.json({ message: "Lead updated successfully", lead });
  } catch (error) {
    next(error);
  }
};
