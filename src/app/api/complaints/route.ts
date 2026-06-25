import { NextResponse } from 'next/server';
import { z } from 'zod';

import connectDB from '@/lib/mongodb';
import { requireAuth} from '@/middleware/auth';
import { ROLES } from '@/constants/roles';
import {generateCaseId } from '@/lib/utils';
import {CATEGORIES} from '@/constants/categories';

import Complaint from "@/models/Complaint";
import Evidence from "@/models/Evidence";

import { generateComplaintHash } from "@/lib/hash";
import { getContract } from "@/lib/web3";

const complaintSchema = z.object({
  title: z.string().min(3, "Title is required").max(200),
  description: z.string().min(10, "Description is required").max(5000),
  category: z.enum([
    CATEGORIES[0],
    CATEGORIES[1],
    CATEGORIES[2],
    CATEGORIES[3],
    CATEGORIES[4],
    CATEGORIES[5],
  ]),
  oppositeParty: z.object({
    name: z.string().min(2, "Opposite party name is required"),
    email: z.string().email("Valid opposite party email is required"),
    organization: z.string().optional(),
    description: z.string().optional(),
    userId: z.string().optional(),
  }),
  evidence: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        fileType: z.enum(["image", "pdf", "document", "video"]).optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await requireAuth();

    const body = await req.json();

    const validatedData = complaintSchema.parse(body);

    const totalComplaints = await Complaint.countDocuments();

    const caseId = generateCaseId(totalComplaints + 1);

    const complaint = await Complaint.create({
      caseId,
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      status: "pending",

      complainantId: user.userId,

      oppositeParty: {
        name: validatedData.oppositeParty.name,
        email: validatedData.oppositeParty.email,
        organization: validatedData.oppositeParty.organization || "",
        description: validatedData.oppositeParty.description || "",
        userId: validatedData.oppositeParty.userId || null,
      },

      evidence: [],
      defenseStatement: null,
      defenseEvidence: [],

      assignedJurors: [],
      jurorCount: 3,
      votingDeadline: null,

      complaintHash: null,
      blockchainTxHash: null,

      decision: "pending",
      decisionTxHash: null,
      decidedAt: null,

      priority: "medium",
    });

    const evidenceDocs = await Evidence.insertMany(
      validatedData.evidence.map((file) => ({
        complaintId: complaint._id,
        uploadedBy: user.userId,
        uploadedByRole: "complainant",
        fileUrl: file.url,
        publicId: file.publicId,
        fileType: file.fileType || "document",
        fileName: file.fileName || "uploaded-file",
        fileSize: file.fileSize || 0,
        ipfsHash: null,
      }))
    );

    complaint.evidence = evidenceDocs.map((evidence) => evidence._id);

    await complaint.save();

    try{
      const complaintHash = generateComplaintHash({
        caseId: complaint.caseId,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        complainantId: complaint.complainantId.toString(),
        createdAt: complaint.createdAt
      });

      const contract = getContract();

      const tx = await contract.fileCase(complaint.caseId, complaintHash);

      await tx.wait();

      complaint.complaintHash = complaintHash;
      complaint.blockchainTxHash = tx.hash;

      await complaint.save();
    }catch (blockchainError) {
      console.error("Blockchain registration failed: ", blockchainError);
    }

    return NextResponse.json(
      {
        message: "Complaint filed successfully",
        complaint,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to file complaint" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await requireAuth();
    const userId = user.userId;

    const { searchParams } = new URL(req.url);
    const as = searchParams.get("as");

    let filter = {};

    if (user.role === ROLES.ADMIN) {
      filter = {};
    } else if (user.role === ROLES.JUROR) {
      filter = { assignedJurors: userId };
    } else {
      if (as === "complainant") {
        filter = { complainantId: userId };
      } else if (as === "opposite_party") {
        filter = { "oppositeParty.userId": userId };
      } else {
        filter = {
          $or: [
            { complainantId: userId },
            { "oppositeParty.userId": userId },
          ],
        };
      }
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate("evidence")
      .populate("complainantId", "name")
      .populate("oppositeParty.userId", "name")
      .lean();

    return NextResponse.json({ complaints }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}