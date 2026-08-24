import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import User from "@/models/User";
import { STATUS } from "@/constants";
import { ROLES } from "@/constants/roles";

export type PublicStats = {
  totalCasesFiled: number;
  decisionsMade: number;
  totalJurors: number;
};

export async function getPublicStats(): Promise<PublicStats> {
  await connectDB();

  const [totalCasesFiled, decisionsMade, totalJurors] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({
      status: {
        $in: [STATUS.DECIDED, STATUS.CLOSED],
      },
    }),
    User.countDocuments({
      role: ROLES.JUROR,
      isBanned: false,
    }),
  ]);

  return {
    totalCasesFiled,
    decisionsMade,
    totalJurors,
  };
}
