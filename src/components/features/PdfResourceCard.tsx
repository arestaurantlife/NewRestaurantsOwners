import { FileText, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PdfViewerDialog from "./PdfViewerDialog";

interface PdfResourceCardProps {
  title: string;
  description: string;
  url: string;
  tags?: string[];
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
  onDelete?: () => void;
  deleting?: boolean;
}

const PdfResourceCard = ({
  title,
  description,
  url,
  tags,
  selectedTags,
  onTagClick,
  onDelete,
  deleting,
}: PdfResourceCardProps) => {
  const isPlaceholder = !url || url === "#";

  return (
    <div className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated transition-all">
      <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
        <FileText className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-foreground mb-1">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => {
              const active = selectedTags?.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={active ? "default" : "secondary"}
                  className={
                    onTagClick
                      ? "cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      : ""
                  }
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <PdfViewerDialog
            title={title}
            url={url}
            trigger={
              <Button size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Read
              </Button>
            }
          />
          <Button size="sm" variant="outline" disabled={isPlaceholder} asChild={!isPlaceholder}>
            {isPlaceholder ? (
              <span>
                <Download className="w-4 h-4 mr-2" />
                Coming soon
              </span>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" download>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            )}
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfResourceCard;
