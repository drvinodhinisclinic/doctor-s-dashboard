import { useConsultationStore } from "@/stores/consultationStore";
import { fetchPatient, fetchPatientVisits, fetchPatientReports } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, Stethoscope, AlertCircle } from "lucide-react";
import type { Appointment } from "@/types/consultation";

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  "In Progress": "bg-info/10 text-info border-info/20",
  Completed: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export function AppointmentsList() {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    selectedAppointment,
    setSelectedAppointment,
    setPatient,
    setPatientLoading,
    setPatientError,
    setVisits,
    setVisitsLoading,
    setVisitsError,
    setReports,
    setReportsLoading,
    setReportsError,
    resetFormData,
  } = useConsultationStore();

  const handleStartConsultation = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    resetFormData();

    // Load patient details
    setPatientLoading(true);
    setPatientError(null);
    try {
      const patient = await fetchPatient(appointment.patient_id);
      setPatient(patient);
    } catch (error) {
      setPatientError("Failed to load patient details");
    } finally {
      setPatientLoading(false);
    }

    // Load patient visits
    setVisitsLoading(true);
    setVisitsError(null);
    try {
      const visits = await fetchPatientVisits(appointment.patient_id);
      setVisits(visits);
    } catch (error) {
      setVisitsError("Failed to load previous visits");
    } finally {
      setVisitsLoading(false);
    }

    // Load patient reports
    setReportsLoading(true);
    setReportsError(null);
    try {
      const response = await fetchPatientReports(appointment.patient_id);
      setReports(response.data || []);
    } catch (error) {
      setReportsError("Failed to load reports");
    } finally {
      setReportsLoading(false);
    }
  };

  if (appointmentsLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-4">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (appointmentsError) {
    return (
      <div className="p-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{appointmentsError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const appointmentsList = Array.isArray(appointments) ? appointments : [];

  if (appointmentsList.length === 0) {
    return (
      <div className="p-4">
        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No appointments scheduled</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {appointmentsList.map((appointment) => {
        const isSelected = selectedAppointment?.appointment_id === appointment.appointment_id;
        return (
          <Card
            key={appointment.appointment_id}
            className={`transition-all duration-200 cursor-pointer hover:shadow-card-hover ${
              isSelected ? "ring-2 ring-primary bg-accent/30" : "bg-card"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {appointment.patient_name}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[appointment.status] || ""}
                >
                  {appointment.status}
                </Badge>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{appointment.appointment_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{appointment.appointment_time}</span>
                </div>
                {appointment.reason && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>{appointment.reason}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => handleStartConsultation(appointment)}
                className="w-full"
                variant={isSelected ? "secondary" : "default"}
                size="sm"
              >
                {isSelected ? "Consultation Active" : "Start Consultation"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
