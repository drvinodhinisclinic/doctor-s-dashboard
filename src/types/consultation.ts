export interface Doctor {
  doctor_id: number;
  doctor_name: string;
  qualification: string;
}

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  patient_mobile: string;
  patient_age: string;
  Address: string;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  created_at: string;
  updated_at: string;
}

export interface Patient {
  patient_id: number;
  name: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  medical_history: string;
  allergies: string;
}

export interface Medication {
  name: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  medications: Medication[];
}

export interface Visit {
  visit_id: number;
  appointment_id: number;
  doctor_id: number;
  visit_date: string;
  history: string;
  complaints: string;
  examination: string;
  diagnosis: string;
  investigations: string;
  lab_requests: string;
  treatment: string;
  prescription: Prescription;
  advice: string;
  review_date: string;
}

export interface Report {
  report_id: number;
  title: string;
  report_text: string;
  file_url: string;
  uploaded_at: string;
}

export interface Template {
  template_id: number;
  name: string;
  content: string;
}

export interface ConsultationFormData {
  history: string;
  complaints: string;
  examination: string;
  diagnosis: string;
  investigations: string;
  lab_requests: string;
  treatment: string;
  prescription: Prescription;
  advice: string;
  review_date: string;
}

export interface CreateVisitPayload extends ConsultationFormData {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
}

export interface CreateTemplatePayload {
  doctor_id: number;
  name: string;
  content: string;
}
