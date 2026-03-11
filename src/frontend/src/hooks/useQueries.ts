import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Program, Registration, ScoreEntry } from "../backend.d";
import { useActor } from "./useActor";

export function usePrograms() {
  const { actor, isFetching } = useActor();
  return useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrograms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRegistrations(userId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["userRegistrations", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserRegistrations(BigInt(userId));
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useProgramRegistrations(programId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["programRegistrations", programId?.toString()],
    queryFn: async () => {
      if (!actor || programId === null) return [];
      return actor.getProgramRegistrations(programId);
    },
    enabled: !!actor && !isFetching && programId !== null,
  });
}

export function useScoreboard(programId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ScoreEntry[]>({
    queryKey: ["scoreboard", programId?.toString()],
    queryFn: async () => {
      if (!actor || programId === null) return [];
      return actor.getScoreboard(programId);
    },
    enabled: !!actor && !isFetching && programId !== null,
    refetchInterval: 10000,
  });
}

export function useBookSlot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      programId,
      userId,
    }: { programId: bigint; userId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookSlot(programId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["userRegistrations"] });
    },
  });
}

export function useCreateProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      category: string;
      totalSlots: bigint;
      date: string;
      time: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProgram(
        data.name,
        data.description,
        data.category,
        data.totalSlots,
        data.date,
        data.time,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export function useUpdateProgramStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      programId,
      status,
    }: { programId: bigint; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProgramStatus(programId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      programId: bigint;
      participantName: string;
      score: bigint;
      judgeId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitScore(
        data.programId,
        data.participantName,
        data.score,
        data.judgeId,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["scoreboard", variables.programId.toString()],
      });
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.loginUser(username, password);
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      username: string;
      password: string;
      fullName: string;
      role: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(
        data.username,
        data.password,
        data.fullName,
        data.role,
      );
    },
  });
}
