import { useConsultationStore } from "@/stores/consultationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Calendar,
  Download,
  ChevronRight,
  FileText,
} from "lucide-react";
import type { Visit } from "@/types/consultation";

export function PreviousVisitsPanel() {
  const {
    visits,
    visitsLoading,
    visitsError,
    selectedVisit,
    setSelectedVisit,
    loadVisitIntoForm,
    selectedAppointment,
  } = useConsultationStore();

  const handleLoadVisit = (visit: Visit) => {
    loadVisitIntoForm(visit);
  };

  if (!selectedAppointment) {
    return null;
  }

  return (
    <Card className="bg-card shadow-card h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <History className="h-4 w-4 text-primary" />
          Previous Visits
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {visitsLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : visitsError ? (
          <p className="text-sm text-destructive p-4">{visitsError}</p>
        ) : visits.length === 0 ? (
          <div className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No previous visits</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {visits.map((visit) => {
                const isSelected = selectedVisit?.visit_id === visit.visit_id;
                return (
                  <div
                    key={visit.visit_id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-accent border-primary/30"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedVisit(visit)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(visit.visit_date).toLocaleDateString()}
                        </span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          isSelected ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    {visit.diagnosis && (
                      <Badge variant="secondary" className="text-xs mb-2">
                        {visit.diagnosis}
                      </Badge>
                    )}

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2 animate-fade-in">
                        {visit.complaints && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              Complaints:
                            </span>
                            <p className="text-sm">{visit.complaints}</p>
                          </div>
                        )}
                        {visit.treatment && (
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">
                              Treatment:
                            </span>
                            <p className="text-sm">{visit.treatment}</p>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadVisit(visit);
                          }}
                        >
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Load Visit
                        </Button>
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
