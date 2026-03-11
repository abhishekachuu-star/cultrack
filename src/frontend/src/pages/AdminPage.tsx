import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProgram,
  useProgramRegistrations,
  usePrograms,
  useUpdateProgramStatus,
} from "@/hooks/useQueries";
import { Calendar, Clock, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Program } from "../backend.d";

const statusColor: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  ongoing: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

function RegistrationsModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  const { data: registrations, isLoading } = useProgramRegistrations(
    program ? program.id : null,
  );

  return (
    <Dialog open={!!program} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            Registrations — {program?.name}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-2 py-4">
            {["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : !registrations || registrations.length === 0 ? (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="admin.registrations.empty_state"
          >
            No registrations yet for this program.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg, i) => (
                <TableRow
                  key={reg.id.toString()}
                  data-ocid={`admin.registrations.row.${i + 1}`}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-medium">{reg.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {reg.username}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPage() {
  const { data: programs, isLoading } = usePrograms();
  const createProgram = useCreateProgram();
  const updateStatus = useUpdateProgramStatus();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    totalSlots: "",
    date: "",
    time: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, category, totalSlots, date, time } = form;
    if (!name || !description || !category || !totalSlots || !date || !time) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const result = await createProgram.mutateAsync({
        name,
        description,
        category,
        totalSlots: BigInt(Number.parseInt(totalSlots, 10)),
        date,
        time,
      });
      if (result.ok) {
        toast.success(`Program "${name}" created successfully!`);
        setForm({
          name: "",
          description: "",
          category: "",
          totalSlots: "",
          date: "",
          time: "",
        });
      }
    } catch {
      toast.error("Failed to create program");
    }
  };

  const handleStatusChange = async (program: Program, status: string) => {
    try {
      await updateStatus.mutateAsync({ programId: program.id, status });
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl mb-2">
          Admin Panel
        </h1>
        <p className="text-muted-foreground">
          Manage programs, update statuses, and view registrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Program Form */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="font-display font-bold text-xl mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create Program
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="programName" className="text-sm font-medium">
                  Program Name
                </Label>
                <Input
                  id="programName"
                  placeholder="e.g. Classical Dance"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1.5"
                  data-ocid="admin.program_name_input"
                />
              </div>
              <div>
                <Label htmlFor="programDesc" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="programDesc"
                  placeholder="Short description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1.5 resize-none"
                  rows={3}
                  data-ocid="admin.program_desc_input"
                />
              </div>
              <div>
                <Label
                  htmlFor="programCategory"
                  className="text-sm font-medium"
                >
                  Category
                </Label>
                <Input
                  id="programCategory"
                  placeholder="e.g. Dance, Music, Drama"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="mt-1.5"
                  data-ocid="admin.program_category_input"
                />
              </div>
              <div>
                <Label htmlFor="totalSlots" className="text-sm font-medium">
                  Total Slots
                </Label>
                <Input
                  id="totalSlots"
                  type="number"
                  min="1"
                  placeholder="50"
                  value={form.totalSlots}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, totalSlots: e.target.value }))
                  }
                  className="mt-1.5"
                  data-ocid="admin.program_slots_input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="programDate" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="programDate"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="mt-1.5"
                    data-ocid="admin.program_date_input"
                  />
                </div>
                <div>
                  <Label htmlFor="programTime" className="text-sm font-medium">
                    Time
                  </Label>
                  <Input
                    id="programTime"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className="mt-1.5"
                    data-ocid="admin.program_time_input"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full festival-gradient text-white border-0"
                disabled={createProgram.isPending}
                data-ocid="admin.create_program_button"
              >
                {createProgram.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Create Program
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Programs List */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display font-bold text-xl">All Programs</h2>
            </div>

            {isLoading ? (
              <div
                className="p-5 space-y-3"
                data-ocid="admin.programs.loading_state"
              >
                {["a", "b", "c", "d"].map((k) => (
                  <Skeleton key={k} className="h-16 w-full" />
                ))}
              </div>
            ) : !programs || programs.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.programs.empty_state"
              >
                <div className="text-4xl mb-3">📋</div>
                <p className="font-display font-semibold">
                  No programs created yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {programs.map((program, index) => (
                  <div
                    key={program.id.toString()}
                    className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    data-ocid={`admin.program_item.${index + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold truncate">
                          {program.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${statusColor[program.status] ?? ""}`}
                        >
                          {program.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {program.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {program.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {program.bookedSlots.toString()}/
                          {program.totalSlots.toString()} booked
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={program.status}
                        onValueChange={(v) => handleStatusChange(program, v)}
                      >
                        <SelectTrigger
                          className="w-32 h-8 text-xs"
                          data-ocid={`admin.status_select.${index + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setSelectedProgram(program)}
                        data-ocid={`admin.view_registrations_button.${index + 1}`}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Registrations
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <RegistrationsModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
      />
    </div>
  );
}
