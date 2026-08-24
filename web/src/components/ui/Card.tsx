import React from "react";

type CardVariant = "glass" | "solid";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: CardVariant;
	hoverable?: boolean;
}

export default function Card({
	children,
	variant = "glass",
	hoverable = false,
	className = "",
	...rest
}: CardProps) {
	const baseStyles = "overflow-hidden rounded-xl border p-6 transition duration-150";
	
	const variants = {
		glass: "border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
		solid: "border-[var(--color-border)] bg-[var(--color-bg-primary)]",
	};

	const hoverStyles = hoverable ? "hover:border-[var(--color-accent-primary)]" : "";

	return (
		<div
			className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
			{...rest}
		>
			{children}
		</div>
	);
}

// Subcomponents for structured Card layout
Card.Header = function CardHeader({
	children,
	className = "",
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`mb-4 border-b border-[var(--color-border-subtle)] pb-4 ${className}`} {...rest}>
			{children}
		</div>
	);
};

Card.Body = function CardBody({
	children,
	className = "",
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`${className}`} {...rest}>
			{children}
		</div>
	);
};

Card.Footer = function CardFooter({
	children,
	className = "",
	...rest
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={`mt-4 border-t border-[var(--color-border-subtle)] pt-4 ${className}`} {...rest}>
			{children}
		</div>
	);
};
