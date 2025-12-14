import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useConsultationStore } from "@/stores/consultationStore";
import { fetchDoctor, fetchDoctors, fetchAppointments, fetchTemplates } from "@/lib/api";
import type { Doctor, Appointment } from "@/types/consultation";
import { AppointmentsList } from "@/components/consultation/AppointmentsList";
import { PatientHeader } from "@/components/consultation/PatientHeader";
import { ConsultationForm } from "@/components/consultation/ConsultationForm";
import { RightSidebar } from "@/components/consultation/RightSidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stethoscope, GraduationCap, Calendar } from "lucide-react";

export default function ConsultationPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const {
    doctors,
    doctorsLoading,
    setDoctors,
    setDoctorsLoading,
    setDoctorsError,
    doctor,
    doctorLoading,
    doctorError,
    setDoctor,
    setDoctorLoading,
    setDoctorError,
    setAppointments,
    setAppointmentsLoading,
    setAppointmentsError,
    setTemplates,
    setTemplatesLoading,
    setTemplatesError,
    selectedAppointment,
  } = useConsultationStore();

  // Load all doctors on mount
  useEffect(() => {
    const loadDoctors = async () => {
      setDoctorsLoading(true);
      setDoctorsError(null);
      try {
        const doctorsData = await fetchDoctors();
        // Handle both array and {data: [...]} response formats
        const doctorsArray = Array.isArray(doctorsData) 
          ? doctorsData 
          : ((doctorsData as { data?: Doctor[] })?.data || []);
        setDoctors(doctorsArray);
      } catch (error) {
        setDoctorsError("Failed to load doctors");
      } finally {
        setDoctorsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Load doctor-specific data when doctorId changes
  useEffect(() => {
    const loadDoctorData = async () => {
      if (!doctorId) return;

      const id = parseInt(doctorId, 10);

      // Load doctor details
      setDoctorLoading(true);
      setDoctorError(null);
      try {
        const doctorData = await fetchDoctor(id);
        setDoctor(doctorData);
      } catch (error) {
        setDoctorError("Failed to load doctor details");
      } finally {
        setDoctorLoading(false);
      }

      // Load appointments for today's date
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`; // YYYY-MM-DD in local time

        console.log("[ConsultationPage] Fetching appointments", { doctorId: id, date: todayStr });

        const appointmentsData = await fetchAppointments(todayStr);
        const appointmentsArray = Array.isArray(appointmentsData)
          ? appointmentsData
          : ((appointmentsData as { data?: Appointment[] })?.data || []);

        // Filter appointments by selected doctor
        const filteredAppointments = appointmentsArray.filter((apt) => apt.doctor_id === id);

        console.log("[ConsultationPage] Appointments fetched", {
          total: appointmentsArray.length,
          filtered: filteredAppointments.length,
        });

        setAppointments(filteredAppointments);
      } catch (error) {
        console.error("[ConsultationPage] Failed to load appointments", error);
        setAppointmentsError("Failed to load appointments");
      } finally {
        setAppointmentsLoading(false);
      }

      // Load templates
      setTemplatesLoading(true);
      setTemplatesError(null);
      try {
        const templatesResponse = await fetchTemplates(id);
        setTemplates(templatesResponse.data || []);
      } catch (error) {
        setTemplatesError("Failed to load templates");
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadDoctorData();
  }, [doctorId]);

  const handleDoctorChange = (newDoctorId: string) => {
    navigate(`/consultation/${newDoctorId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              {doctorLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : doctorError ? (
                <span className="text-destructive">{doctorError}</span>
              ) : doctor ? (
                <div>
                  <h1 className="text-xl font-semibold font-display text-foreground">
                    {doctor.doctor_name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{doctor.qualification}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              {/* Doctor Dropdown */}
              <Select
                value={doctorId}
                onValueChange={handleDoctorChange}
                disabled={doctorsLoading}
              >
                <SelectTrigger className="w-[220px] bg-background">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Array.isArray(doctors) && doctors.map((doc) => (
                    <SelectItem key={doc.doctor_id} value={String(doc.doctor_id)}>
                      {doc.doctor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Appointments */}
        <aside className="w-80 flex-shrink-0 border-r bg-card/50 overflow-y-auto scrollbar-thin">
          <div className="p-4 border-b bg-panel-header/50">
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Today's Appointments
            </h2>
          </div>
          <AppointmentsList />
        </aside>

        {/* Center Panel - Consultation */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <PatientHeader />
            <ConsultationForm />
          </div>
        </main>

        {/* Right Panel - Visits, Reports, Templates */}
        {selectedAppointment && (
          <aside className="w-80 flex-shrink-0 border-l bg-card/50 overflow-hidden">
            <div className="h-full p-4">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
