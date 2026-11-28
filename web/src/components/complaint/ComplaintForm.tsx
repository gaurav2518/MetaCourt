"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Check, ChevronLeft, ChevronRight, FileText, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

import { API_BASE_URL } from "@/config/api";
import { CATEGORIES } from "@/constants";
import { useComplaints } from "@/hooks/useComplaints";
import { type UploadedEvidenceFile } from "@/hooks/useUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import EvidenceUpload from "@/components/complaint/EvidenceUpload";

const evidenceFileSchema = z.object({
	url: z.string().url(),
	publicId: z.string().min(1),
	fileType: z.enum(["image", "pdf", "document", "video"]),
	fileName: z.string().min(1),
	fileSize: z.number().nonnegative(),
});

const stepOneSchema = z.object({
	title: z.string().min(3, "Title is required (minimum 3 characters)").max(200, "Title must be at most 200 characters"),
	description: z.string().min(10, "Description is required (minimum 10 characters)").max(5000, "Description must be at most 5000 characters"),
	category: z.enum(CATEGORIES),
});

const stepTwoSchema = z.object({
	oppositeParty: z.object({
		name: z.string().min(2, "Opposite party name is required"),
		email: z.string().email("Valid opposite party email is required"),
		organization: z.string().optional(),
		description: z.string().optional(),
	}),
});

const stepThreeSchema = z.object({
	evidence: z.array(evidenceFileSchema).max(10, "You can upload up to 10 files").optional(),
});

const complaintFormSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema);

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

type StepIndex = 0 | 1 | 2;

const STEPS = [
	{
		id: 1,
		title: "Case details",
		description: "Title, description, and category",
	},
	{
		id: 2,
		title: "Opposite party",
		description: "Who needs to respond",
	},
	{
		id: 3,
		title: "Evidence",
		description: "Upload supporting files",
	},
] as const;

const STEP_FIELDS: Array<Array<FieldPath<ComplaintFormValues>>> = [
	["title", "description", "category"],
	["oppositeParty.name", "oppositeParty.email", "oppositeParty.organization", "oppositeParty.description"],
	["evidence"],
];

function formatCategoryLabel(category: string) {
	return category
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function applyStepErrors(
	issues: z.ZodIssue[],
	setError: ReturnType<typeof useForm<ComplaintFormValues>>["setError"]
) {
	issues.forEach((issue) => {
		const path = issue.path.join(".") as FieldPath<ComplaintFormValues>;

		if (!path) {
			return;
		}

		setError(path, { type: "manual", message: issue.message });
	});
}

export default function ComplaintForm() {
	const router = useRouter();
	const { fileComplaint, loading, error: complaintError } = useComplaints();
	const [currentStep, setCurrentStep] = useState<StepIndex>(0);
	const [uploadedEvidence, setUploadedEvidence] = useState<UploadedEvidenceFile[]>([]);
	const [lookupLoading, setLookupLoading] = useState(false);
	const [lookupResult, setLookupResult] = useState<{ exists: boolean; name?: string } | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		clearErrors,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ComplaintFormValues>({
		resolver: zodResolver(complaintFormSchema),
		defaultValues: {
			title: "",
			description: "",
			category: CATEGORIES[0],
			oppositeParty: {
				name: "",
				email: "",
				organization: "",
				description: "",
			},
			evidence: [],
		},
		mode: "onTouched",
	});

	const oppositePartyEmail = watch("oppositeParty.email");

	useEffect(() => {
		const trimmed = (oppositePartyEmail || "").trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!trimmed || !emailRegex.test(trimmed)) {
			setLookupResult(null);
			setLookupLoading(false);
			return;
		}

		setLookupLoading(true);
		const timer = setTimeout(async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/api/users/lookup?email=${encodeURIComponent(trimmed)}`, {
					credentials: "include",
				});
				if (res.ok) {
					const data = await res.json();
					if (data.exists) {
						setLookupResult({ exists: true, name: data.user?.name });
						const currentName = getValues("oppositeParty.name");
						if (!currentName && data.user?.name) {
							setValue("oppositeParty.name", data.user.name, { shouldValidate: true });
						}
					} else {
						setLookupResult({ exists: false });
					}
				} else {
					setLookupResult(null);
				}
			} catch {
				setLookupResult(null);
			} finally {
				setLookupLoading(false);
			}
		}, 400);

		return () => clearTimeout(timer);
	}, [oppositePartyEmail, getValues, setValue]);

	// Accurate step progress:
	// When starting Step 1, 0 steps are completed (0%)
	// When advancing to Step 2, 1 step is completed (33%)
	// When advancing to Step 3, 2 steps are completed (66%)
	const stepProgress = useMemo(() => {
		return Math.round((currentStep / STEPS.length) * 100);
	}, [currentStep]);

	function syncEvidence(files: UploadedEvidenceFile[]) {
		setUploadedEvidence(files);
		setValue("evidence", files, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
	}

	function validateStep(step: StepIndex) {
		const currentValues = getValues();
		const fields = STEP_FIELDS[step];

		clearErrors(fields);

		const result = [stepOneSchema, stepTwoSchema, stepThreeSchema][step].safeParse(currentValues);

		if (!result.success) {
			applyStepErrors(result.error.issues, setError);
			return false;
		}

		return true;
	}

	async function goNext() {
		if (!validateStep(currentStep)) {
			return;
		}

		setCurrentStep((step) => Math.min(step + 1, 2) as StepIndex);
	}

	function goBack() {
		setCurrentStep((step) => Math.max(step - 1, 0) as StepIndex);
	}

	const submitComplaint = handleSubmit(async (values) => {
		const payload: Parameters<typeof fileComplaint>[0] = {
			...values,
			evidence: uploadedEvidence,
		};

		const complaint = await fileComplaint(payload);
		router.push(`/complainant/cases/${complaint.caseId}`);
	});

	const isBusy = loading || isSubmitting;

	return (
		<div className="w-full space-y-6">
			{/* Top Step Counter & Header */}
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--color-gold)]">
							Dispute Filing Wizard
						</p>
						<h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
							Start a New Case
						</h2>
					</div>

					<div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
						<FileText className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
						<span>Step {currentStep + 1} of {STEPS.length}</span>
					</div>
				</div>

				{/* Progress Indicator */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
						<span className="font-semibold text-[var(--color-text-secondary)]">{STEPS[currentStep].title}</span>
						<span className="font-mono">{stepProgress === 0 ? "0% completed" : `${stepProgress}% completed`}</span>
					</div>
					<div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
						<div
							className="h-full rounded-full bg-[var(--color-accent-primary)] transition-all duration-300"
							style={{ width: `${stepProgress}%` }}
						/>
					</div>
				</div>

				{/* Step Cards Grid */}
				<div className="grid gap-3 sm:grid-cols-3">
					{STEPS.map((step, index) => {
						const active = index === currentStep;
						const completed = index < currentStep;

						return (
							<div
								key={step.id}
								className={`rounded-xl border px-4 py-3 transition duration-150 ${
									active
										? "border-[var(--color-accent-primary)]/50 bg-[var(--color-accent-glow)] text-[var(--color-text-primary)] shadow-sm"
										: completed
										? "border-[rgba(16,185,129,0.30)] bg-[rgba(16,185,129,0.08)] text-[var(--color-success)]"
										: "border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/60 text-[var(--color-text-muted)]"
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
											active
												? "bg-[var(--color-accent-primary)] text-white shadow-sm"
												: completed
												? "bg-[var(--color-success)] text-white"
												: "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
										}`}
									>
										{completed ? <Check className="h-4 w-4" /> : step.id}
									</div>

									<div className="min-w-0">
										<p className="text-xs font-bold truncate">{step.title}</p>
										<p className="text-[11px] opacity-75 truncate">{step.description}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Form Inputs by Step */}
			<form onSubmit={(event) => event.preventDefault()} className="space-y-6 pt-2">
				{currentStep === 0 && (
					<div className="grid gap-5">
						<Input
							id="title"
							label="Case Title"
							placeholder="Briefly describe the dispute (e.g. Unauthorized Account Debit)"
							error={errors.title?.message}
							{...register("title")}
						/>

						<Textarea
							id="description"
							label="Detailed Description of Facts"
							placeholder="Explain what happened in detail. Include dates, transaction amounts, agreed terms, and attempts to resolve."
							helperText="Minimum 10 characters. Include clear facts to help community jurors review your claim."
							error={errors.description?.message}
							rows={6}
							{...register("description")}
						/>

						<Select
							id="category"
							label="Dispute Category"
							helperText="Choose the category that best matches your dispute claim."
							error={errors.category?.message}
							options={CATEGORIES.map((category) => ({
								value: category,
								label: formatCategoryLabel(category),
							}))}
							{...register("category")}
						/>
					</div>
				)}

				{currentStep === 1 && (
					<div className="space-y-5">
						<div className="rounded-xl border border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-glow)] px-4 py-3 text-xs leading-5 text-[var(--color-text-secondary)]">
							<span className="font-semibold text-[var(--color-accent-primary)]">Notice:</span> The respondent will receive a formal notification to inspect these facts and submit their defense statement and counter-evidence.
						</div>

						<div className="grid gap-5 md:grid-cols-2">
							<Input
								id="oppositeParty.name"
								label="Respondent / Opposite Party Name"
								placeholder="Full name or company name"
								error={errors.oppositeParty?.name?.message}
								{...register("oppositeParty.name")}
							/>

							<div className="space-y-1.5">
								<Input
									id="oppositeParty.email"
									label="Respondent Email Address"
									type="email"
									placeholder="respondent@example.com"
									error={errors.oppositeParty?.email?.message}
									{...register("oppositeParty.email")}
								/>

								{lookupLoading && (
									<div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] animate-in fade-in">
										<Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-accent-primary)]" />
										<span>Checking user database...</span>
									</div>
								)}

								{!lookupLoading && lookupResult && lookupResult.exists && (
									<div className="flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.1)] px-3 py-2 text-xs text-[var(--color-success)] animate-in fade-in">
										<CheckCircle2 className="h-4 w-4 shrink-0" />
										<span>
											<strong>✓ Registered User:</strong> {lookupResult.name || "MetaCourt Member"}
										</span>
									</div>
								)}

								{!lookupLoading && lookupResult && !lookupResult.exists && (
									<div className="flex items-start gap-2 rounded-xl border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.1)] px-3 py-2 text-xs text-[var(--color-gold)] animate-in fade-in">
										<AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
										<span>
											<strong>⚠️ This email is not registered yet.</strong> They will need to register with this email to respond.
										</span>
									</div>
								)}
							</div>

							<Input
								id="oppositeParty.organization"
								label="Organization / Company (Optional)"
								placeholder="Company, platform, or service provider"
								helperText="Optional"
								error={errors.oppositeParty?.organization?.message}
								{...register("oppositeParty.organization")}
							/>

							<Textarea
								id="oppositeParty.description"
								label="Additional Identification Notes (Optional)"
								placeholder="Any extra details to identify this party (account ID, invoice number, etc.)"
								helperText="Optional"
								error={errors.oppositeParty?.description?.message}
								className="md:col-span-2"
								rows={3}
								{...register("oppositeParty.description")}
							/>
						</div>
					</div>
				)}

				{currentStep === 2 && (
					<div className="space-y-5">
						<div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4 py-3 text-xs leading-5 text-[var(--color-text-secondary)]">
							Upload receipts, contracts, communication logs, or PDFs. Files are hashed to establish proof on Ethereum Sepolia.
						</div>

						<EvidenceUpload
							onChange={syncEvidence}
							initialFiles={uploadedEvidence}
							label="Supporting Evidence Files"
							helperText="Upload up to 10 files (Images, PDFs, Documents up to 10MB each)."
						/>

						{errors.evidence && (
							<p className="text-xs text-[var(--color-danger)]">{errors.evidence.message}</p>
						)}
					</div>
				)}

				{(complaintError || Object.keys(errors).length > 0) && currentStep === 2 && (
					<div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-xs text-[var(--color-danger)]">
						{complaintError || "Please review the highlighted fields before submitting."}
					</div>
				)}

				{/* Wizard Navigation Buttons */}
				<div className="flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-xs text-[var(--color-text-muted)]">
						{currentStep === 2
							? "Review attached evidence and submit to seal the case record on-chain."
							: "Click Next to proceed to the next step of the filing wizard."}
					</div>

					<div className="flex items-center gap-3">
						{currentStep > 0 && (
							<Button type="button" variant="secondary" onClick={goBack} disabled={isBusy}>
								<ChevronLeft className="mr-1.5 h-4 w-4" />
								<span>Back</span>
							</Button>
						)}

						{currentStep < 2 ? (
							<Button type="button" onClick={goNext} disabled={isBusy}>
								<span>Next Step</span>
								<ChevronRight className="ml-1.5 h-4 w-4" />
							</Button>
						) : (
							<Button
								type="button"
								onClick={() => void submitComplaint()}
								isLoading={isBusy}
								disabled={isBusy}
							>
								Submit Complaint & Anchor Hash
							</Button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
