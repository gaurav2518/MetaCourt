import ComplaintForm from "@/components/complaint/ComplaintForm";

export default function FileComplaintPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">File a New Complaint</h1>
        <p className="mt-1 text-sm text-slate-400">Follow the steps to submit your complaint.</p>
      </header>

      <main>
        <ComplaintForm />
      </main>
    </div>
  );
}
