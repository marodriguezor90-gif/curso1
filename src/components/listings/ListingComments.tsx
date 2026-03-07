"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle, Send } from "lucide-react";
import type { Comment } from "@/types/listing";

interface ListingCommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
  return `Hace ${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? "es" : ""}`;
};

export const ListingComments = ({
  comments,
  onAddComment,
}: ListingCommentsProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setNewComment("");
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" />
        }
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{comments.length}</span>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comentarios ({comments.length})</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No hay comentarios aún. ¡Sé el primero!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{comment.authorName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Textarea
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="shrink-0 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
