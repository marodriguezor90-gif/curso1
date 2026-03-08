"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/constants/filters";
import { ListingComments } from "@/components/listings/ListingComments";
import {
  Heart,
  Bookmark,
  ExternalLink,
  ImageOff,
  Camera,
  Loader2,
} from "lucide-react";
import { ListingStatus } from "@/types/listing";
import type { Listing } from "@/types/listing";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface ListingCardProps {
  listing: Listing;
  isLiked: boolean;
  isSaved: boolean;
  isUploading: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onStatusChange: (status: ListingStatus) => void;
  onAddComment: (text: string) => void;
  onImageUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
};

export const ListingCard = ({
  listing,
  isLiked,
  isSaved,
  isUploading,
  onToggleLike,
  onToggleSave,
  onStatusChange,
  onAddComment,
  onImageUpload,
}: ListingCardProps) => {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("La imagen no puede pesar más de 5MB");
      return;
    }

    setImgError(false);
    await onImageUpload(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageOff className="h-10 w-10 text-muted-foreground/40" />
          </div>
        ) : (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        )}

        {isUploading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <Badge
            variant="outline"
            className={`text-xs ${PLATFORM_COLORS[listing.platform]} border`}
          >
            {PLATFORM_LABELS[listing.platform]}
          </Badge>
          <Badge className={`text-xs ${STATUS_COLORS[listing.status]}`}>
            {STATUS_LABELS[listing.status]}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={onToggleSave}
          aria-label={isSaved ? "Quitar de guardados" : "Guardar artículo"}
        >
          <Bookmark
            className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-gray-600"}`}
          />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-white group-hover:opacity-100"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Cambiar imagen"
        >
          <Camera className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      <CardContent className="space-y-2 p-3">
        <div>
          <h3 className="line-clamp-1 text-sm font-medium">{listing.title}</h3>
          <p className="text-xs text-muted-foreground">{listing.brand} · {listing.size}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold">
            {formatPrice(listing.price, listing.currency)}
          </span>
          {listing.originalPrice && listing.originalPrice > listing.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(listing.originalPrice, listing.currency)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2 text-muted-foreground"
              onClick={onToggleLike}
              aria-label={isLiked ? "Quitar like" : "Dar like"}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="text-xs">{listing.likesCount}</span>
            </Button>

            <ListingComments
              comments={listing.comments}
              onAddComment={onAddComment}
            />
          </div>

          <a
            href={listing.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver en ${PLATFORM_LABELS[listing.platform]}`}
          >
            <Button variant="ghost" size="sm" className="gap-1 px-2 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              Ver
            </Button>
          </a>
        </div>

        <Select
          value={listing.status as string}
          onValueChange={(v: string | null) => { if (v) onStatusChange(v as ListingStatus); }}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ListingStatus.AVAILABLE}>Disponible</SelectItem>
            <SelectItem value={ListingStatus.RESERVED}>Reservado</SelectItem>
            <SelectItem value={ListingStatus.SOLD}>Vendido</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
