import { useConsultationStore } from "@/stores/consultationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Calendar,
} from "lucide-react";

export function PatientHeader() {
  const { patient, patientLoading, patientError, selectedAppointment } =
    useConsultationStore();

  if (!selectedAppointment) {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            Select an appointment to start consultation
          </p>
        </CardContent>
      </Card>
    );
  }

  if (patientLoading) {
    return (
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (patientError || !patient) {
    return (
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            {patientError || "Patient data unavailable"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-card animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>

          {/* Patient Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold text-foreground font-display truncate">
                {patient.name}
              </h2>
              <Badge variant="outline" className="flex-shrink-0">
                {patient.gender}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {patient.age} years
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {patient.mobile}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {patient.address}
              </span>
            </div>

            {/* Medical History & Allergies */}
            <div className="flex flex-wrap gap-2">
              {patient.medical_history && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5"
                >
                  <FileText className="h-3 w-3" />
                  {patient.medical_history}
                </Badge>
              )}
              {patient.allergies && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Allergies: {patient.allergies}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
