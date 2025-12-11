import { useState } from "react";
import { useConsultationStore } from "@/stores/consultationStore";
import { createTemplate, fetchTemplates } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  FilePlus2,
  Plus,
  Loader2,
  ArrowRight,
  BookTemplate,
} from "lucide-react";
import type { Template } from "@/types/consultation";

export function TemplatesPanel() {
  const {
    doctor,
    templates,
    templatesLoading,
    templatesError,
    setTemplates,
    loadTemplateIntoForm,
    selectedAppointment,
  } = useConsultationStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", content: "" });
  const [saving, setSaving] = useState(false);

  const handleUseTemplate = (template: Template) => {
    loadTemplateIntoForm(template);
    toast({
      title: "Template Applied",
      description: `"${template.name}" added to prescription`,
    });
  };

  const handleSaveTemplate = async () => {
    if (!doctor || !newTemplate.name || !newTemplate.content) return;

    setSaving(true);
    try {
      const response = await createTemplate({
        doctor_id: doctor.doctor_id,
        name: newTemplate.name,
        content: newTemplate.content,
      });

      if (response.success) {
        // Refresh templates
        const templatesResponse = await fetchTemplates(doctor.doctor_id);
        setTemplates(templatesResponse.data || []);

        setNewTemplate({ name: "", content: "" });
        setDialogOpen(false);
        toast({
          title: "Success",
          description: "Template saved successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!selectedAppointment) {
    return null;
  }

  return (
    <Card className="bg-card shadow-card h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <FilePlus2 className="h-4 w-4 text-primary" />
            Rx Templates
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., Fever Basic Rx"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-content">Prescription Content</Label>
                  <Textarea
                    id="template-content"
                    placeholder="e.g., Tab Paracetamol 500mg TDS for 3 days"
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        content: e.target.value,
                      })
                    }
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={saving || !newTemplate.name || !newTemplate.content}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Template"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {templatesLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : templatesError ? (
          <p className="text-sm text-destructive p-4">{templatesError}</p>
        ) : templates.length === 0 ? (
          <div className="p-4 text-center">
            <BookTemplate className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              No templates yet
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Create Template
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {templates.map((template) => (
                <div
                  key={template.template_id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{template.name}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
