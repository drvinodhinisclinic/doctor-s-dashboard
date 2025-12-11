import { create } from "zustand";
import type {
  Doctor,
  Appointment,
  Patient,
  Visit,
  Report,
  Template,
  ConsultationFormData,
} from "@/types/consultation";

const initialFormData: ConsultationFormData = {
  history: "",
  complaints: "",
  examination: "",
  diagnosis: "",
  investigations: "",
  lab_requests: "",
  treatment: "",
  prescription: { medications: [] },
  advice: "",
  review_date: "",
};

interface ConsultationState {
  // Doctor state
  doctor: Doctor | null;
  doctorLoading: boolean;
  doctorError: string | null;

  // Appointments state
  appointments: Appointment[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
  selectedAppointment: Appointment | null;

  // Patient state
  patient: Patient | null;
  patientLoading: boolean;
  patientError: string | null;

  // Visits state
  visits: Visit[];
  visitsLoading: boolean;
  visitsError: string | null;
  selectedVisit: Visit | null;

  // Reports state
  reports: Report[];
  reportsLoading: boolean;
  reportsError: string | null;
  selectedReport: Report | null;

  // Templates state
  templates: Template[];
  templatesLoading: boolean;
  templatesError: string | null;

  // Consultation form state
  formData: ConsultationFormData;
  formSaving: boolean;
  formError: string | null;

  // Actions
  setDoctor: (doctor: Doctor | null) => void;
  setDoctorLoading: (loading: boolean) => void;
  setDoctorError: (error: string | null) => void;

  setAppointments: (appointments: Appointment[]) => void;
  setAppointmentsLoading: (loading: boolean) => void;
  setAppointmentsError: (error: string | null) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;

  setPatient: (patient: Patient | null) => void;
  setPatientLoading: (loading: boolean) => void;
  setPatientError: (error: string | null) => void;

  setVisits: (visits: Visit[]) => void;
  setVisitsLoading: (loading: boolean) => void;
  setVisitsError: (error: string | null) => void;
  setSelectedVisit: (visit: Visit | null) => void;

  setReports: (reports: Report[]) => void;
  setReportsLoading: (loading: boolean) => void;
  setReportsError: (error: string | null) => void;
  setSelectedReport: (report: Report | null) => void;

  setTemplates: (templates: Template[]) => void;
  setTemplatesLoading: (loading: boolean) => void;
  setTemplatesError: (error: string | null) => void;

  setFormData: (data: Partial<ConsultationFormData>) => void;
  setFormSaving: (saving: boolean) => void;
  setFormError: (error: string | null) => void;
  resetFormData: () => void;
  loadVisitIntoForm: (visit: Visit) => void;
  loadTemplateIntoForm: (template: Template) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  // Initial state
  doctor: null,
  doctorLoading: false,
  doctorError: null,

  appointments: [],
  appointmentsLoading: false,
  appointmentsError: null,
  selectedAppointment: null,

  patient: null,
  patientLoading: false,
  patientError: null,

  visits: [],
  visitsLoading: false,
  visitsError: null,
  selectedVisit: null,

  reports: [],
  reportsLoading: false,
  reportsError: null,
  selectedReport: null,

  templates: [],
  templatesLoading: false,
  templatesError: null,

  formData: initialFormData,
  formSaving: false,
  formError: null,

  // Actions
  setDoctor: (doctor) => set({ doctor }),
  setDoctorLoading: (doctorLoading) => set({ doctorLoading }),
  setDoctorError: (doctorError) => set({ doctorError }),

  setAppointments: (appointments) => set({ appointments }),
  setAppointmentsLoading: (appointmentsLoading) => set({ appointmentsLoading }),
  setAppointmentsError: (appointmentsError) => set({ appointmentsError }),
  setSelectedAppointment: (selectedAppointment) => set({ selectedAppointment }),

  setPatient: (patient) => set({ patient }),
  setPatientLoading: (patientLoading) => set({ patientLoading }),
  setPatientError: (patientError) => set({ patientError }),

  setVisits: (visits) => set({ visits }),
  setVisitsLoading: (visitsLoading) => set({ visitsLoading }),
  setVisitsError: (visitsError) => set({ visitsError }),
  setSelectedVisit: (selectedVisit) => set({ selectedVisit }),

  setReports: (reports) => set({ reports }),
  setReportsLoading: (reportsLoading) => set({ reportsLoading }),
  setReportsError: (reportsError) => set({ reportsError }),
  setSelectedReport: (selectedReport) => set({ selectedReport }),

  setTemplates: (templates) => set({ templates }),
  setTemplatesLoading: (templatesLoading) => set({ templatesLoading }),
  setTemplatesError: (templatesError) => set({ templatesError }),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setFormSaving: (formSaving) => set({ formSaving }),
  setFormError: (formError) => set({ formError }),
  resetFormData: () => set({ formData: initialFormData }),
  loadVisitIntoForm: (visit) =>
    set({
      formData: {
        history: visit.history || "",
        complaints: visit.complaints || "",
        examination: visit.examination || "",
        diagnosis: visit.diagnosis || "",
        investigations: visit.investigations || "",
        lab_requests: visit.lab_requests || "",
        treatment: visit.treatment || "",
        prescription: visit.prescription || { medications: [] },
        advice: visit.advice || "",
        review_date: visit.review_date || "",
      },
    }),
  loadTemplateIntoForm: (template) =>
    set((state) => ({
      formData: {
        ...state.formData,
        prescription: {
          medications: [
            ...state.formData.prescription.medications,
            { name: template.content, frequency: "", duration: "" },
          ],
        },
      },
    })),
}));
