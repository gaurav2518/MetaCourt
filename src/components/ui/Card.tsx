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
	const baseStyles = "rounded-[2rem] border border-white/10 p-5 shadow-2xl transition duration-300 overflow-hidden";
	
	const variants = {
		glass: "bg-white/5 backdrop-blur-xl shadow-black/20",
		solid: "bg-slate-950/70 shadow-black/30",
	};

	const hoverStyles = hoverable ? "hover:border-cyan-500/30 hover:shadow-cyan-500/5 hover:-translate-y-0.5" : "";

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
		<div className={`border-b border-white/10 pb-4 mb-4 ${className}`} {...rest}>
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
		<div className={`border-t border-white/10 pt-4 mt-4 ${className}`} {...rest}>
			{children}
		</div>
	);
};
