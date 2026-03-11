import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBookSlot,
  usePrograms,
  useUserRegistrations,
} from "@/hooks/useQueries";
import { getSession } from "@/utils/session";
import { Calendar, CheckCircle2, Clock, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import type { Program } from "../backend.d";

const statusColor: Record<string, string> = {
  ongoing: "bg-green-100 text-green-700 border-green-200",
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ProgramsPage() {
  const session = getSession();
  const { data: programs, isLoading } = usePrograms();
  const { data: registrations } = useUserRegistrations(session?.userId ?? null);
  const bookSlotMutation = useBookSlot();

  const visiblePrograms = (programs ?? []).filter(
    (p) => p.status === "ongoing" || p.status === "upcoming",
  );

  const registeredProgramIds = new Set(
    (registrations ?? []).map((r) => r.programId.toString()),
  );

  const handleBook = async (program: Program) => {
    if (!session) return;
    try {
      const result = await bookSlotMutation.mutateAsync({
        programId: program.id,
        userId: BigInt(session.userId),
      });
      if (result.ok) {
        toast.success(`Successfully registered for ${program.name}!`);
      } else {
        toast.error(result.message || "Booking failed");
      }
    } catch {
      toast.error("Failed to book slot. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl mb-2">
          Ongoing Programs
        </h1>
        <p className="text-muted-foreground">
          Browse and register for available cultural programs.
        </p>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="programs.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div
              key={k}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && visiblePrograms.length === 0 && (
        <div
          className="text-center py-20 bg-card rounded-2xl border border-border"
          data-ocid="programs.empty_state"
        >
          <div className="text-5xl mb-4">🎭</div>
          <h3 className="font-display font-bold text-xl mb-2">
            No Programs Available
          </h3>
          <p className="text-muted-foreground">
            Check back soon for upcoming cultural programs!
          </p>
        </div>
      )}

      {!isLoading && visiblePrograms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePrograms.map((program, index) => {
            const slotsLeft =
              Number(program.totalSlots) - Number(program.bookedSlots);
            const isRegistered = registeredProgramIds.has(
              program.id.toString(),
            );
            const isBooking = bookSlotMutation.isPending;
            const num = index + 1;

            return (
              <div
                key={program.id.toString()}
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-festival transition-all hover:-translate-y-0.5"
                data-ocid={`programs.program_item.${num}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display font-bold text-lg leading-tight">
                    {program.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize shrink-0 ${statusColor[program.status] ?? ""}`}
                  >
                    {program.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                  {program.description}
                </p>

                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {program.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{program.date}</span>
                    <Clock className="w-3.5 h-3.5 ml-1" />
                    <span>{program.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span
                      className={
                        slotsLeft <= 0
                          ? "text-destructive font-medium"
                          : "text-green-600 font-medium"
                      }
                    >
                      {slotsLeft <= 0 ? "Full" : `${slotsLeft} slots available`}
                    </span>
                  </div>
                </div>

                {session?.role === "student" &&
                  (isRegistered ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="festival-gradient text-white border-0 w-full"
                      disabled={slotsLeft <= 0 || isBooking}
                      onClick={() => handleBook(program)}
                      data-ocid={`programs.book_button.${num}`}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />{" "}
                          Booking...
                        </>
                      ) : slotsLeft <= 0 ? (
                        "No Slots Available"
                      ) : (
                        "Book Slot"
                      )}
                    </Button>
                  ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
