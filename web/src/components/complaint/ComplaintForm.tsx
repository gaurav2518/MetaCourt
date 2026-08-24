"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Check, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";

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
	title: z.string().min(3, "Title is required").max(200, "Title must be at most 200 characters"),
	description: z.string().min(10, "Description is required").max(5000, "Description must be at most 5000 characters"),
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

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
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

	const stepProgress = useMemo(() => ((currentStep + 1) / STEPS.length) * 100, [currentStep]);

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
		<section className="mx-auto w-full max-w-4xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 sm:p-6 lg:p-8">
			<div className="space-y-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] p-5 sm:p-6 lg:p-8">
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent-primary)]">File a complaint</p>
							<h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
								Start a new case
							</h1>
						</div>

						<div className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] sm:flex">
							<FileText className="h-4 w-4 text-[var(--color-accent-primary)]" />
							Step {currentStep + 1} of {STEPS.length}
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between gap-3 text-xs font-medium text-[var(--color-text-muted)]">
							<span>{STEPS[currentStep].title}</span>
							<span>{Math.round(stepProgress)}% complete</span>
						</div>
							<div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
							<div
								className={`h-full rounded-full bg-[var(--color-accent-primary)] transition-all ${
									currentStep === 0 ? "w-1/3" : currentStep === 1 ? "w-2/3" : "w-full"
								}`}
							/>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{STEPS.map((step, index) => {
							const active = index === currentStep;
							const completed = index < currentStep;

							return (
								<div
									key={step.id}
									className={`rounded-lg border px-4 py-3 transition ${
										active
											? "border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)] text-[var(--color-text-primary)]"
											: completed
											? "border-[rgba(16,185,129,0.30)] bg-[rgba(16,185,129,0.10)] text-[var(--color-success)]"
											: "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
												active
													? "bg-[var(--color-accent-primary)] text-white"
													: completed
													? "bg-[var(--color-success)] text-white"
													: "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)]"
											}`}
										>
											{completed ? <Check className="h-4 w-4" /> : step.id}
										</div>

										<div>
											<p className="text-sm font-medium">{step.title}</p>
											<p className="text-xs opacity-80">{step.description}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<form onSubmit={(event) => event.preventDefault()} className="space-y-6">
					{currentStep === 0 && (
						<div className="grid gap-5">
							<Input
								id="title"
								label="Title"
								placeholder="Briefly describe the dispute"
								error={errors.title?.message}
								{...register("title")}
							/>

							<Textarea
								id="description"
								label="Description"
								placeholder="Explain what happened in detail"
								helperText="Include dates, locations, and the key facts that support your complaint."
								error={errors.description?.message}
								{...register("description")}
							/>

							<Select
								id="category"
								label="Category"
								helperText="Choose the closest fit for this complaint."
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
							<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-glow)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
								This person will be notified and can respond.
							</div>

							<div className="grid gap-5 md:grid-cols-2">
								<Input
									id="oppositeParty.name"
									label="Name"
									placeholder="Full name or organization contact"
									error={errors.oppositeParty?.name?.message}
									{...register("oppositeParty.name")}
								/>

								<Input
									id="oppositeParty.email"
									label="Email"
									type="email"
									placeholder="contact@example.com"
									error={errors.oppositeParty?.email?.message}
									{...register("oppositeParty.email")}
								/>

								<Input
									id="oppositeParty.organization"
									label="Organization"
									placeholder="Company, institution, or department"
									helperText="Optional"
									error={errors.oppositeParty?.organization?.message}
									{...register("oppositeParty.organization")}
								/>

								<Textarea
									id="oppositeParty.description"
									label="Additional notes"
									placeholder="Anything useful to identify or contact this party"
									helperText="Optional"
									error={errors.oppositeParty?.description?.message}
									className="md:col-span-2"
									{...register("oppositeParty.description")}
								/>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className="space-y-5">
							<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]">
								Optional but recommended. Upload documents, screenshots, or PDFs that support your complaint.
							</div>

							<EvidenceUpload
								onChange={syncEvidence}
								initialFiles={uploadedEvidence}
								label="Evidence files"
								helperText="Upload up to 10 files. Accepted: images, PDFs, and documents."
							/>

							{errors.evidence && (
								<p className="text-sm text-[var(--color-danger)]">{errors.evidence.message}</p>
							)}
						</div>
					)}

					{(complaintError || Object.keys(errors).length > 0) && currentStep === 2 && (
						<div className="rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
							{complaintError || "Please review the highlighted fields before submitting."}
						</div>
					)}

					<div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
						<div className="text-xs leading-5 text-[var(--color-text-muted)]">
							{currentStep === 2
								? "Review the uploaded evidence and submit the complaint to create a new case."
								: "Use Back and Next to move through the complaint details."}
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							{currentStep > 0 ? (
								<Button type="button" variant="secondary" onClick={goBack} disabled={isBusy}>
									<ChevronLeft className="mr-2 h-4 w-4" />
									Back
								</Button>
							) : null}

							{currentStep < 2 ? (
								<Button type="button" onClick={goNext} disabled={isBusy}>
									Next
									<ChevronRight className="ml-2 h-4 w-4" />
								</Button>
							) : (
								<Button
									type="button"
									onClick={() => void submitComplaint()}
									isLoading={isBusy}
									disabled={isBusy}
								>
									Submit complaint
								</Button>
							)}
						</div>
					</div>
				</form>
			</div>
		</section>
	);
}
