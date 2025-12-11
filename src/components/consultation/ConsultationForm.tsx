import { useState } from "react";
import { useConsultationStore } from "@/stores/consultationStore";
import { createVisit } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  ClipboardList,
  Stethoscope,
  FlaskConical,
  Pill,
  CalendarCheck,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import type { Medication } from "@/types/consultation";

export function ConsultationForm() {
  const {
    doctor,
    selectedAppointment,
    patient,
    formData,
    setFormData,
    formSaving,
    setFormSaving,
    setFormError,
    resetFormData,
  } = useConsultationStore();

  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    frequency: "",
    duration: "",
  });

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData({ [field]: value });
  };

  const handleAddMedication = () => {
    if (newMedication.name) {
      setFormData({
        prescription: {
          medications: [...formData.prescription.medications, newMedication],
        },
      });
      setNewMedication({ name: "", frequency: "", duration: "" });
    }
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = formData.prescription.medications.filter(
      (_, i) => i !== index
    );
    setFormData({
      prescription: { medications: updatedMedications },
    });
  };

  const handleSubmit = async () => {
    if (!selectedAppointment || !patient || !doctor) {
      toast({
        title: "Error",
        description: "Please select an appointment first",
        variant: "destructive",
      });
      return;
    }

    setFormSaving(true);
    setFormError(null);

    try {
      const payload = {
        appointment_id: selectedAppointment.appointment_id,
        patient_id: patient.patient_id,
        doctor_id: doctor.doctor_id,
        ...formData,
      };

      const response = await createVisit(payload);

      if (response.success) {
        toast({
          title: "Success",
          description: `Consultation saved successfully (Visit ID: ${response.visit_id})`,
        });
        resetFormData();
      }
    } catch (error) {
      setFormError("Failed to save consultation");
      toast({
        title: "Error",
        description: "Failed to save consultation",
        variant: "destructive",
      });
    } finally {
      setFormSaving(false);
    }
  };

  if (!selectedAppointment) {
    return null;
  }

  return (
    <Card className="bg-card shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <ClipboardList className="h-5 w-5 text-primary" />
          Consultation Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* History & Complaints */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="history">History</Label>
            <Textarea
              id="history"
              placeholder="Patient history..."
              value={formData.history}
              onChange={(e) => handleInputChange("history", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complaints">Complaints</Label>
            <Textarea
              id="complaints"
              placeholder="Chief complaints..."
              value={formData.complaints}
              onChange={(e) => handleInputChange("complaints", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Examination & Diagnosis */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="examination" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              Examination
            </Label>
            <Textarea
              id="examination"
              placeholder="Examination findings..."
              value={formData.examination}
              onChange={(e) => handleInputChange("examination", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Diagnosis..."
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        {/* Investigations & Lab Requests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="investigations" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              Investigations
            </Label>
            <Textarea
              id="investigations"
              placeholder="Investigations required..."
              value={formData.investigations}
              onChange={(e) =>
                handleInputChange("investigations", e.target.value)
              }
              className="min-h-[60px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lab_requests">Lab Requests</Label>
            <Textarea
              id="lab_requests"
              placeholder="Lab requests..."
              value={formData.lab_requests}
              onChange={(e) => handleInputChange("lab_requests", e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>

        {/* Treatment */}
        <div className="space-y-2">
          <Label htmlFor="treatment">Treatment</Label>
          <Textarea
            id="treatment"
            placeholder="Treatment plan..."
            value={formData.treatment}
            onChange={(e) => handleInputChange("treatment", e.target.value)}
            className="min-h-[60px] resize-none"
          />
        </div>

        {/* Prescription */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-muted-foreground" />
            Prescription
          </Label>

          {/* Medication List */}
          {formData.prescription.medications.length > 0 && (
            <div className="space-y-2">
              {formData.prescription.medications.map((med, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-md animate-fade-in"
                >
                  <span className="flex-1 text-sm font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {med.frequency}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {med.duration}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveMedication(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add Medication */}
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Medication name"
              value={newMedication.name}
              onChange={(e) =>
                setNewMedication({ ...newMedication, name: e.target.value })
              }
              className="flex-1 min-w-[150px]"
            />
            <Input
              placeholder="Frequency"
              value={newMedication.frequency}
              onChange={(e) =>
                setNewMedication({ ...newMedication, frequency: e.target.value })
              }
              className="w-24"
            />
            <Input
              placeholder="Duration"
              value={newMedication.duration}
              onChange={(e) =>
                setNewMedication({ ...newMedication, duration: e.target.value })
              }
              className="w-24"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddMedication}
              disabled={!newMedication.name}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Advice & Review Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="advice">Advice</Label>
            <Textarea
              id="advice"
              placeholder="Medical advice..."
              value={formData.advice}
              onChange={(e) => handleInputChange("advice", e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review_date" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              Review Date
            </Label>
            <Input
              id="review_date"
              type="date"
              value={formData.review_date}
              onChange={(e) => handleInputChange("review_date", e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSubmit} disabled={formSaving} size="lg">
            {formSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Consultation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
