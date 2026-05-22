import { Router } from "express";
import { createFranchiseLead, getFranchiseLeads, updateLeadStatus } from "../controllers/lead.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Public route to submit lead
router.post("/franchise", createFranchiseLead);

// Admin routes
router.get("/franchise", requireAuth, requireAdmin, getFranchiseLeads);
router.patch("/franchise/:id/status", requireAuth, requireAdmin, updateLeadStatus);

export default router;
