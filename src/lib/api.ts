import axios from "axios";
import type {
  Doctor,
  Appointment,
  Patient,
  Visit,
  Report,
  Template,
  CreateVisitPayload,
  CreateTemplatePayload,
} from "@/types/consultation";

// Configurable base URL - can be changed via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Doctor APIs
export const fetchDoctor = async (doctorId: number): Promise<Doctor> => {
  const response = await apiClient.get<Doctor>(`/doctors/${doctorId}`);
  return response.data;
};

// Appointment APIs
export const fetchAppointments = async (doctorId: number): Promise<Appointment[]> => {
  const response = await apiClient.get<Appointment[]>(`/appointments/doctor/${doctorId}`);
  return response.data;
};

// Fetch all doctors
export const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>("/doctors");
  return response.data;
};

// Patient APIs
export const fetchPatient = async (patientId: number): Promise<Patient> => {
  const response = await apiClient.get<Patient>(`/patients/${patientId}`);
  return response.data;
};

// Visit APIs
export const fetchPatientVisits = async (patientId: number): Promise<Visit[]> => {
  const response = await apiClient.get<Visit[]>(`/visits/patient/${patientId}`);
  return response.data;
};

export const createVisit = async (
  payload: CreateVisitPayload
): Promise<{ success: boolean; visit_id: number }> => {
  const response = await apiClient.post("/visits", payload);
  return response.data;
};

// Report APIs
export const fetchPatientReports = async (
  patientId: number
): Promise<{ success: boolean; data: Report[] }> => {
  const response = await apiClient.get(`/reports/patient/${patientId}`);
  return response.data;
};

// Template APIs
export const fetchTemplates = async (
  doctorId: number
): Promise<{ success: boolean; data: Template[] }> => {
  const response = await apiClient.get("/templates", {
    params: { doctor_id: doctorId },
  });
  return response.data;
};

export const createTemplate = async (
  payload: CreateTemplatePayload
): Promise<{ success: boolean; template_id: number }> => {
  const response = await apiClient.post("/templates", payload);
  return response.data;
};

export default apiClient;
