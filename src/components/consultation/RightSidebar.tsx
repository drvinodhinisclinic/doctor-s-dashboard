import { PreviousVisitsPanel } from "./PreviousVisitsPanel";
import { ReportsPanel } from "./ReportsPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { useConsultationStore } from "@/stores/consultationStore";

export function RightSidebar() {
  const { selectedAppointment } = useConsultationStore();

  if (!selectedAppointment) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 min-h-0">
        <PreviousVisitsPanel />
      </div>
      <div className="flex-1 min-h-0">
        <ReportsPanel />
      </div>
      <div className="flex-1 min-h-0">
        <TemplatesPanel />
      </div>
    </div>
  );
}
