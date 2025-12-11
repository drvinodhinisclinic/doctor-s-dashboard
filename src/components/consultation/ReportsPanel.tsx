import { useConsultationStore } from "@/stores/consultationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  ExternalLink,
  Calendar,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import type { Report } from "@/types/consultation";

export function ReportsPanel() {
  const {
    reports,
    reportsLoading,
    reportsError,
    selectedReport,
    setSelectedReport,
    selectedAppointment,
  } = useConsultationStore();

  const handleOpenReport = (report: Report) => {
    if (report.file_url) {
      window.open(report.file_url, "_blank");
    }
  };

  if (!selectedAppointment) {
    return null;
  }

  return (
    <Card className="bg-card shadow-card h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <FileText className="h-4 w-4 text-primary" />
          Lab Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {reportsLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : reportsError ? (
          <p className="text-sm text-destructive p-4">{reportsError}</p>
        ) : reports.length === 0 ? (
          <div className="p-4 text-center">
            <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No reports available</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {reports.map((report) => {
                const isSelected =
                  selectedReport?.report_id === report.report_id;
                return (
                  <div
                    key={report.report_id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent border-primary/30"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm truncate flex-1">
                        {report.title}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                          isSelected ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(report.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2 animate-fade-in">
                        {report.report_text && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              Report:
                            </span>
                            <p className="text-sm whitespace-pre-wrap mt-1">
                              {report.report_text}
                            </p>
                          </div>
                        )}
                        {report.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReport(report);
                            }}
                          >
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            Open Full Report
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
