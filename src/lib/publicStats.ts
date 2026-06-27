import connectDB from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { STATUS } from "@/constants";

export type PublicStats = {
  totalCasesFiled: number;
  decisionsMade: number;
};

export async function getPublicStats(): Promise<PublicStats> {
  await connectDB();

  const [totalCasesFiled, decisionsMade] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({
      status: {
        $in: [STATUS.DECIDED, STATUS.CLOSED],
      },
    }),
  ]);

  return {
    totalCasesFiled,
    decisionsMade,
  };
}
