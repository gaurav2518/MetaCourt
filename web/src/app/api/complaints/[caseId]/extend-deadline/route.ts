import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Complaint from "@/models/Complaint";
import { ROLES, STATUS } from "@/constants";

const extendDeadlineSchema = z.object({
  additionalDays: z.number().int().min(1).max(30),
  reason: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();
    requireRole(user, [ROLES.ADMIN]);

    const { caseId } = await params;
    const body = await req.json();
    const { additionalDays } = extendDeadlineSchema.parse(body);

    const complaint = await Complaint.findOne({ caseId });
    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
    }

    if (complaint.status === STATUS.DECIDED) {
      return NextResponse.json(
        { message: "Cannot extend deadline on a decided complaint" },
        { status: 400 }
      );
    }

    if (!complaint.assignedJurors || complaint.assignedJurors.length === 0) {
      return NextResponse.json(
        { message: "No jurors are assigned to this case yet" },
        { status: 400 }
      );
    }

    // Base the extension on current deadline if it's in the future, or current time if expired
    const baseDate =
      complaint.votingDeadline && new Date(complaint.votingDeadline) > new Date()
        ? new Date(complaint.votingDeadline)
        : new Date();

    const newDeadline = new Date(baseDate);
    newDeadline.setDate(newDeadline.getDate() + additionalDays);

    complaint.votingDeadline = newDeadline;

    // Ensure status remains or is set to voting
    if (complaint.status !== STATUS.VOTING && complaint.status !== STATUS.DECIDED) {
      complaint.status = STATUS.VOTING;
    }

    await complaint.save();

    return NextResponse.json(
      {
        message: `Voting deadline successfully extended by ${additionalDays} day(s).`,
        votingDeadline: complaint.votingDeadline,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
