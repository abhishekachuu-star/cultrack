import { ActorMethod } from '@dfinity/agent';

export interface Program {
  id: bigint;
  name: string;
  description: string;
  category: string;
  totalSlots: bigint;
  bookedSlots: bigint;
  date: string;
  time: string;
  status: string;
}

export interface Registration {
  id: bigint;
  programId: bigint;
  userId: bigint;
  username: string;
  fullName: string;
}

export interface Score {
  id: bigint;
  programId: bigint;
  userId: bigint;
  participantName: string;
  score: bigint;
  judgeId: bigint;
  judgeName: string;
}

export interface ScoreEntry {
  participantName: string;
  score: bigint;
  rank: bigint;
}

export interface _SERVICE {
  registerUser: ActorMethod<[string, string, string, string], { ok: boolean; message: string; userId: bigint }>;
  loginUser: ActorMethod<[string, string], { ok: boolean; userId: bigint; role: string; fullName: string }>;
  getPrograms: ActorMethod<[], Program[]>;
  createProgram: ActorMethod<[string, string, string, bigint, string, string], { ok: boolean; programId: bigint }>;
  updateProgramStatus: ActorMethod<[bigint, string], { ok: boolean }>;
  bookSlot: ActorMethod<[bigint, bigint], { ok: boolean; message: string }>;
  getProgramRegistrations: ActorMethod<[bigint], Registration[]>;
  getUserRegistrations: ActorMethod<[bigint], Registration[]>;
  submitScore: ActorMethod<[bigint, string, bigint, bigint], { ok: boolean; message: string }>;
  getScoreboard: ActorMethod<[bigint], ScoreEntry[]>;
  getAllScoreboards: ActorMethod<[], Score[]>;
}
