import { ReactNode } from "react";
import { ExternalLink, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PdfViewerDialogProps {
  title: string;
  url: string;
  trigger: ReactNode;
}

const PdfViewerDialog = ({ title, url, trigger }: PdfViewerDialogProps) => {
  const isPlaceholder = !url || url === "#";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 border-b">
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 bg-muted/30">
          {isPlaceholder ? (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div>
                <p className="font-display text-xl font-bold text-foreground mb-2">
                  Coming soon
                </p>
                <p className="text-muted-foreground">
                  This PDF hasn't been uploaded yet.
                </p>
              </div>
            </div>
          ) : (
            <iframe
              src={url}
              title={title}
              className="w-full h-full border-0"
            />
          )}
        </div>

        <DialogFooter className="px-6 py-3 border-t sm:justify-start gap-2">
          {!isPlaceholder && (
            <>
              <Button variant="outline" size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in new tab
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={url} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;
