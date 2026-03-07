import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "@/constants/filters";
import { SELLER_PROFILE } from "@/constants/seller";
import { Star } from "lucide-react";
import type { Platform } from "@/types/listing";

interface SellerStats {
  totalActive: number;
  totalReserved: number;
  totalSold: number;
  totalListings: number;
}

interface SellerHeaderProps {
  stats: SellerStats;
}

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">
        ({SELLER_PROFILE.totalSales}+)
      </span>
    </div>
  );
};

const PlatformBadge = ({ platform }: { platform: Platform }) => (
  <Badge variant="outline" className={`text-xs ${PLATFORM_COLORS[platform]}`}>
    {PLATFORM_LABELS[platform]}
  </Badge>
);

export const SellerHeader = ({ stats }: SellerHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Avatar className="h-24 w-24 border-2 border-pink-200">
        <AvatarImage src={SELLER_PROFILE.avatarUrl} alt={SELLER_PROFILE.name} />
        <AvatarFallback className="bg-pink-100 text-pink-700 text-xl">
          {SELLER_PROFILE.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h1 className="text-2xl font-bold">{SELLER_PROFILE.name}</h1>
        <p className="text-sm text-muted-foreground">@{SELLER_PROFILE.username}</p>
        <div className="mt-1">
          <RatingStars rating={SELLER_PROFILE.rating} />
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold">{SELLER_PROFILE.followers.toLocaleString()}</p>
          <p className="text-muted-foreground">Seguidoras</p>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="text-center">
          <p className="font-semibold">{SELLER_PROFILE.totalSales}</p>
          <p className="text-muted-foreground">Ventas</p>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="text-center">
          <p className="font-semibold">{SELLER_PROFILE.following}</p>
          <p className="text-muted-foreground">Siguiendo</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SELLER_PROFILE.platforms.map((platform) => (
          <PlatformBadge key={platform} platform={platform} />
        ))}
      </div>

      <Separator className="w-full max-w-md" />

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600">{stats.totalActive}</p>
          <p className="text-muted-foreground">Activos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-yellow-600">{stats.totalReserved}</p>
          <p className="text-muted-foreground">Reservados</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{stats.totalSold}</p>
          <p className="text-muted-foreground">Vendidos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{stats.totalListings}</p>
          <p className="text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
};
