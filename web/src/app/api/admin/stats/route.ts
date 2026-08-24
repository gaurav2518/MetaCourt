import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Complaint from "@/models/Complaint";
import User from "@/models/User";
import JurorApplication from "@/models/JurorApplication";

import { ROLES, STATUS } from "@/constants";

export async function GET() {
  try {
    await connectDB();

    const user = await requireAuth();
    requireRole(user, [ROLES.ADMIN]);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      casesByStatus,
      casesByCategory,
      casesPerDay,
      usersByRole,
      pendingJurorApplications,
    ] = await Promise.all([
      Complaint.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      Complaint.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),

      Complaint.aggregate([
        {
          $match: {
            createdAt: {
              $gte: last30Days,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      JurorApplication.countDocuments({
        status: STATUS.PENDING,
      }),
    ]);

    return NextResponse.json(
      {
        casesByStatus,
        casesByCategory,
        casesPerDay,
        usersByRole,
        pendingJurorApplications,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch admin statistics",
      },
      { status: 500 }
    );
  }
}