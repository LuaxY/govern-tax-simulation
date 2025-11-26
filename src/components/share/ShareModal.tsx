import { useState, useRef, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareCard } from "./ShareCard";
import { Copy, Download, Loader2, Check } from "lucide-react";
import type { BudgetState } from "@/types";
import type { PolicyTrait } from "@/data/services";

interface Archetype {
	id: string;
	name: string;
	description: string;
	emoji: string;
	isCompound: boolean;
	primaryId: string;
	secondaryId?: string;
}

interface GovernanceStyle {
	name: string;
	emoji: string;
}

interface ShareModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	archetype: Archetype | null;
	policyTraits: PolicyTrait[];
	governanceStyle: GovernanceStyle | null;
	state: BudgetState;
}

export function ShareModal({
	open,
	onOpenChange,
	archetype,
	policyTraits,
	governanceStyle,
	state,
}: ShareModalProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);

	const generateImage = useCallback(async () => {
		if (!cardRef.current) return;

		setIsGenerating(true);
		try {
			// Small delay to ensure DOM is fully rendered
			await new Promise((resolve) => setTimeout(resolve, 100));

			const dataUrl = await toPng(cardRef.current, {
				cacheBust: true,
				pixelRatio: 2, // Higher quality
			});
			setImageUrl(dataUrl);
		} catch (error) {
			console.error("Failed to generate image:", error);
		} finally {
			setIsGenerating(false);
		}
	}, []);

	// Generate image when modal opens
	useEffect(() => {
		if (open) {
			setImageUrl(null);
			setCopied(false);
			// Small delay to ensure the hidden card is rendered
			const timer = setTimeout(generateImage, 150);
			return () => clearTimeout(timer);
		}
	}, [open, generateImage]);

	const handleCopyImage = async () => {
		if (!imageUrl) return;

		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": blob }),
			]);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy image:", error);
			// Fallback: download the image if clipboard fails
			handleDownload();
		}
	};

	const handleDownload = () => {
		if (!imageUrl) return;

		const link = document.createElement("a");
		link.download = `govern-${archetype?.name.toLowerCase().replace(/\s+/g, "-") || "budget"}.png`;
		link.href = imageUrl;
		link.click();
	};

	const handleShareX = async () => {
		if (!imageUrl) return;

		// Try to copy image to clipboard first
		try {
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": blob }),
			]);
		} catch (error) {
			console.error("Failed to copy image:", error);
		}

		// Build the share text
		const traitEmojis = policyTraits
			.slice(0, 3)
			.map((t) => t.emoji)
			.join("");
		const hybridText = archetype?.isCompound ? " (Hybrid)" : "";
		const traitsText = traitEmojis ? ` ${traitEmojis}` : "";
		const url = encodeURIComponent(window.location.origin);
		const text = encodeURIComponent(
			`My government is ${archetype?.name || "The Balanced"}${hybridText}!${traitsText}\n\nI allocated a national budget on Govern. Try it yourself!`,
		);

		// Open X compose window
		window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[680px] p-0 overflow-hidden bg-white">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle className="text-xl font-semibold">
						Share Your Results
					</DialogTitle>
					<DialogDescription className="text-gray-500">
						Share your government identity with the world
					</DialogDescription>
				</DialogHeader>

				{/* Hidden card for image generation */}
				<div
					className="absolute -left-[9999px] -top-[9999px]"
					aria-hidden="true"
				>
					<ShareCard
						ref={cardRef}
						archetype={archetype}
						policyTraits={policyTraits}
						governanceStyle={governanceStyle}
						state={state}
					/>
				</div>

				{/* Preview */}
				<div className="p-6 pt-4">
					<div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
						{isGenerating || !imageUrl ? (
							<div className="w-full aspect-[3/2] flex items-center justify-center">
								<Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
							</div>
						) : (
							<img
								src={imageUrl}
								alt="Share preview"
								className="w-full h-auto"
							/>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
					<Button
						variant="outline"
						onClick={handleCopyImage}
						disabled={!imageUrl || isGenerating}
						className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
					>
						{copied ? (
							<>
								<Check className="w-4 h-4 mr-2 text-teal-600" />
								Copied!
							</>
						) : (
							<>
								<Copy className="w-4 h-4 mr-2" />
								Copy Image
							</>
						)}
					</Button>
					<Button
						variant="outline"
						onClick={handleDownload}
						disabled={!imageUrl || isGenerating}
						className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
					>
						<Download className="w-4 h-4 mr-2" />
						Download
					</Button>
					<Button
						onClick={handleShareX}
						className="flex-1 bg-black hover:bg-gray-900 text-white cursor-pointer"
					>
						<svg
							className="w-4 h-4 mr-2"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
						Share on X
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
