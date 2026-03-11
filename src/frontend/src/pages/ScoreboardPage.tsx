import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { usePrograms, useScoreboard, useSubmitScore } from "@/hooks/useQueries";
import { getSession } from "@/utils/session";
import { Loader2, Medal, RefreshCw, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ScoreboardPage() {
  const session = getSession();
  const { data: programs } = usePrograms();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );
  const [participantName, setParticipantName] = useState("");
  const [score, setScore] = useState("");
  const submitScoreMutation = useSubmitScore();

  const selectedBigInt = selectedProgramId ? BigInt(selectedProgramId) : null;
  const { data: scoreEntries, isLoading } = useScoreboard(selectedBigInt);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !selectedProgramId || !participantName || !score) {
      toast.error("Please fill in all fields");
      return;
    }
    const scoreNum = Number(score);
    if (scoreNum < 0 || scoreNum > 100) {
      toast.error("Score must be between 0 and 100");
      return;
    }
    try {
      const result = await submitScoreMutation.mutateAsync({
        programId: BigInt(selectedProgramId),
        participantName,
        score: BigInt(scoreNum),
        judgeId: BigInt(session.userId),
      });
      if (result.ok) {
        toast.success("Score submitted successfully!");
        setParticipantName("");
        setScore("");
      } else {
        toast.error(result.message || "Failed to submit score");
      }
    } catch {
      toast.error("Failed to submit score");
    }
  };

  const rankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-orange-50 border-orange-200";
    return "";
  };

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-orange-400" />;
    return (
      <span className="text-muted-foreground text-sm font-medium">#{rank}</span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl mb-2">
          Live Scoreboard
        </h1>
        <p className="text-muted-foreground">
          Real-time rankings updated every 10 seconds.
        </p>
      </div>

      <div className="mb-8 max-w-sm">
        <Label className="text-sm font-medium mb-2 block">Select Program</Label>
        <Select
          value={selectedProgramId ?? ""}
          onValueChange={(v) => setSelectedProgramId(v || null)}
        >
          <SelectTrigger data-ocid="scoreboard.program_select">
            <SelectValue placeholder="Choose a program..." />
          </SelectTrigger>
          <SelectContent>
            {(programs ?? []).map((p) => (
              <SelectItem key={p.id.toString()} value={p.id.toString()}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProgramId && (
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-8">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display font-bold text-lg">
              {programs?.find((p) => p.id.toString() === selectedProgramId)
                ?.name ?? "Program"}{" "}
              Rankings
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
              Auto-refresh every 10s
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="scoreboard.loading_state">
              {["a", "b", "c", "d", "e"].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : !scoreEntries || scoreEntries.length === 0 ? (
            <div
              className="text-center py-16"
              data-ocid="scoreboard.empty_state"
            >
              <div className="text-4xl mb-3">🏆</div>
              <p className="font-display font-semibold">No scores yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Scores will appear here once judges submit them
              </p>
            </div>
          ) : (
            <Table data-ocid="scoreboard.table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoreEntries.map((entry) => {
                  const rank = Number(entry.rank);
                  return (
                    <TableRow
                      key={`${entry.participantName}-${entry.rank}`}
                      className={rankStyle(rank)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {rankIcon(rank)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.participantName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="secondary"
                          className={`font-bold text-sm ${
                            rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : rank === 2
                                ? "bg-gray-100 text-gray-700"
                                : rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : ""
                          }`}
                        >
                          {entry.score.toString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {session?.role === "judge" && selectedProgramId && (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 max-w-md">
          <h3 className="font-display font-bold text-lg mb-4">Submit Score</h3>
          <form onSubmit={handleSubmitScore} className="space-y-4">
            <div>
              <Label htmlFor="participantName" className="text-sm font-medium">
                Participant Name
              </Label>
              <Input
                id="participantName"
                placeholder="Enter participant name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="mt-1.5"
                data-ocid="scoreboard.participant_input"
              />
            </div>
            <div>
              <Label htmlFor="scoreValue" className="text-sm font-medium">
                Score (0-100)
              </Label>
              <Input
                id="scoreValue"
                type="number"
                min="0"
                max="100"
                placeholder="0-100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-1.5"
                data-ocid="scoreboard.score_input"
              />
            </div>
            <Button
              type="submit"
              className="w-full festival-gradient text-white border-0"
              disabled={submitScoreMutation.isPending}
              data-ocid="scoreboard.score_submit_button"
            >
              {submitScoreMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Score"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
