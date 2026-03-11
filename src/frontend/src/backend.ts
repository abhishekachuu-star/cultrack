import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

// ─── Domain interfaces ──────────────────────────────────────────────────────

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

// ─── Service interface ───────────────────────────────────────────────────────

export interface _SERVICE {
  registerUser(username: string, password: string, fullName: string, role: string): Promise<{ ok: boolean; message: string; userId: bigint }>;
  loginUser(username: string, password: string): Promise<{ ok: boolean; userId: bigint; role: string; fullName: string }>;
  getPrograms(): Promise<Program[]>;
  createProgram(name: string, description: string, category: string, totalSlots: bigint, date: string, time: string): Promise<{ ok: boolean; programId: bigint }>;
  updateProgramStatus(programId: bigint, status: string): Promise<{ ok: boolean }>;
  bookSlot(programId: bigint, userId: bigint): Promise<{ ok: boolean; message: string }>;
  getProgramRegistrations(programId: bigint): Promise<Registration[]>;
  getUserRegistrations(userId: bigint): Promise<Registration[]>;
  submitScore(programId: bigint, participantName: string, score: bigint, judgeId: bigint): Promise<{ ok: boolean; message: string }>;
  getScoreboard(programId: bigint): Promise<ScoreEntry[]>;
  getAllScoreboards(): Promise<Score[]>;
  _initializeAccessControlWithSecret(secret: string): Promise<void>;
}

// ─── backendInterface type alias ─────────────────────────────────────────────

export type backendInterface = _SERVICE;

// ─── CreateActorOptions ───────────────────────────────────────────────────────

export interface CreateActorOptions {
  agentOptions?: ConstructorParameters<typeof HttpAgent>[0];
  actorOptions?: { canisterId?: string };
}

// ─── ExternalBlob ────────────────────────────────────────────────────────────

export class ExternalBlob {
  private _bytes: Uint8Array | null = null;
  private _url: string | null = null;
  public onProgress?: (progress: number) => void;

  constructor(bytes?: Uint8Array) {
    if (bytes) {
      this._bytes = bytes;
    }
  }

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob();
    blob._url = url;
    return blob;
  }

  static fromBytes(bytes: Uint8Array): ExternalBlob {
    return new ExternalBlob(bytes);
  }

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) {
      return this._bytes;
    }
    if (this._url) {
      const response = await fetch(this._url);
      const buffer = await response.arrayBuffer();
      this._bytes = new Uint8Array(buffer);
      return this._bytes;
    }
    return new Uint8Array();
  }

  getURL(): string | null {
    return this._url;
  }
}

// ─── IDL Factory ─────────────────────────────────────────────────────────────

export const idlFactory: IDL.InterfaceFactory = ({ IDL: idl }) => {
  const Program = idl.Record({
    id: idl.Nat,
    name: idl.Text,
    description: idl.Text,
    category: idl.Text,
    totalSlots: idl.Nat,
    bookedSlots: idl.Nat,
    date: idl.Text,
    time: idl.Text,
    status: idl.Text,
  });

  const Registration = idl.Record({
    id: idl.Nat,
    programId: idl.Nat,
    userId: idl.Nat,
    username: idl.Text,
    fullName: idl.Text,
  });

  const Score = idl.Record({
    id: idl.Nat,
    programId: idl.Nat,
    userId: idl.Nat,
    participantName: idl.Text,
    score: idl.Nat,
    judgeId: idl.Nat,
    judgeName: idl.Text,
  });

  const ScoreEntry = idl.Record({
    participantName: idl.Text,
    score: idl.Nat,
    rank: idl.Nat,
  });

  return idl.Service({
    registerUser: idl.Func(
      [idl.Text, idl.Text, idl.Text, idl.Text],
      [idl.Record({ ok: idl.Bool, message: idl.Text, userId: idl.Nat })],
      [],
    ),
    loginUser: idl.Func(
      [idl.Text, idl.Text],
      [idl.Record({ ok: idl.Bool, userId: idl.Nat, role: idl.Text, fullName: idl.Text })],
      [],
    ),
    getPrograms: idl.Func([], [idl.Vec(Program)], ["query"]),
    createProgram: idl.Func(
      [idl.Text, idl.Text, idl.Text, idl.Nat, idl.Text, idl.Text],
      [idl.Record({ ok: idl.Bool, programId: idl.Nat })],
      [],
    ),
    updateProgramStatus: idl.Func(
      [idl.Nat, idl.Text],
      [idl.Record({ ok: idl.Bool })],
      [],
    ),
    bookSlot: idl.Func(
      [idl.Nat, idl.Nat],
      [idl.Record({ ok: idl.Bool, message: idl.Text })],
      [],
    ),
    getProgramRegistrations: idl.Func([idl.Nat], [idl.Vec(Registration)], ["query"]),
    getUserRegistrations: idl.Func([idl.Nat], [idl.Vec(Registration)], ["query"]),
    submitScore: idl.Func(
      [idl.Nat, idl.Text, idl.Nat, idl.Nat],
      [idl.Record({ ok: idl.Bool, message: idl.Text })],
      [],
    ),
    getScoreboard: idl.Func([idl.Nat], [idl.Vec(ScoreEntry)], ["query"]),
    getAllScoreboards: idl.Func([], [idl.Vec(Score)], ["query"]),
    _initializeAccessControlWithSecret: idl.Func([idl.Text], [], []),
  });
};

// ─── createActor ─────────────────────────────────────────────────────────────

type UploadFileFn = (file: ExternalBlob) => Promise<Uint8Array>;
type DownloadFileFn = (bytes: Uint8Array) => Promise<ExternalBlob>;

export function createActor(
  canisterId: string,
  _uploadFile: UploadFileFn,
  _downloadFile: DownloadFileFn,
  options?: { agent?: HttpAgent; agentOptions?: ConstructorParameters<typeof HttpAgent>[0]; processError?: (e: unknown) => never },
): backendInterface {
  const agent = options?.agent ?? new HttpAgent(options?.agentOptions ?? {});

  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  }) as ActorSubclass<_SERVICE>;

  return actor;
}
