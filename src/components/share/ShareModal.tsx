import { toPng } from "html-to-image";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PolicyTrait } from "@/data/services";
import type { BudgetState } from "@/types";
import { ShareCard } from "./ShareCard";

type Archetype = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isCompound: boolean;
  primaryId: string;
  secondaryId?: string;
};

type GovernanceStyle = {
  name: string;
  emoji: string;
};

type ShareModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archetype: Archetype | null;
  policyTraits: PolicyTrait[];
  governanceStyle: GovernanceStyle | null;
  state: BudgetState;
};

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
    if (!cardRef.current) {
      return;
    }

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
    if (!imageUrl) {
      return;
    }

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
    if (!imageUrl) {
      return;
    }

    const link = document.createElement("a");
    link.download = `govern-${archetype?.name.toLowerCase().replace(/\s+/g, "-") || "budget"}.png`;
    link.href = imageUrl;
    link.click();
  };

  const handleShareX = async () => {
    if (!imageUrl) {
      return;
    }

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
      `My government is ${archetype?.name || "The Balanced"}${hybridText}!${traitsText}\n\nI allocated a national budget on Govern. Try it yourself!`
    );

    // Open X compose window
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden bg-white p-0 sm:max-w-[680px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-semibold text-xl">
            Share Your Results
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Share your government identity with the world
          </DialogDescription>
        </DialogHeader>

        {/* Hidden card for image generation */}
        <div
          aria-hidden="true"
          className="-left-[9999px] -top-[9999px] absolute"
        >
          <ShareCard
            archetype={archetype}
            governanceStyle={governanceStyle}
            policyTraits={policyTraits}
            ref={cardRef}
            state={state}
          />
        </div>

        {/* Preview */}
        <div className="p-6 pt-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            {isGenerating || !imageUrl ? (
              <div className="flex aspect-[3/2] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            ) : (
              <img
                alt="Share preview"
                className="h-auto w-full"
                height={400}
                src={imageUrl}
                width={600}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 p-6 pt-0 sm:flex-row">
          <Button
            className="flex-1 cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50"
            disabled={!imageUrl || isGenerating}
            onClick={handleCopyImage}
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-teal-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Image
              </>
            )}
          </Button>
          <Button
            className="flex-1 cursor-pointer border-gray-200 text-gray-700 hover:bg-gray-50"
            disabled={!imageUrl || isGenerating}
            onClick={handleDownload}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            className="flex-1 cursor-pointer bg-black text-white hover:bg-gray-900"
            onClick={handleShareX}
          >
            <svg
              aria-label="X (Twitter) logo"
              className="mr-2 h-4 w-4"
              fill="currentColor"
              role="img"
              viewBox="0 0 24 24"
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
