import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor CulTrack {

  type Role = { #Admin; #Student; #Teacher; #Judge };

  type User = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    fullName : Text;
    role : Role;
  };

  type Program = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    totalSlots : Nat;
    bookedSlots : Nat;
    date : Text;
    time : Text;
    status : Text;
  };

  type Registration = {
    id : Nat;
    programId : Nat;
    userId : Nat;
    username : Text;
    fullName : Text;
  };

  type Score = {
    id : Nat;
    programId : Nat;
    userId : Nat;
    participantName : Text;
    score : Nat;
    judgeId : Nat;
    judgeName : Text;
  };

  type ScoreEntry = {
    participantName : Text;
    score : Nat;
    rank : Nat;
  };

  var nextUserId : Nat = 1;
  var nextProgramId : Nat = 4;
  var nextRegistrationId : Nat = 1;
  var nextScoreId : Nat = 6;

  let users : Map.Map<Nat, User> = Map.empty();
  let programs : Map.Map<Nat, Program> = Map.empty();
  let registrations : Map.Map<Nat, Registration> = Map.empty();
  let scores : Map.Map<Nat, Score> = Map.empty();

  // Seed data
  users.add(0, { id = 0; username = "admin"; passwordHash = "admin123"; fullName = "Administrator"; role = #Admin });

  programs.add(1, { id = 1; name = "Classical Dance"; description = "Solo classical dance performance"; category = "Dance"; totalSlots = 20; bookedSlots = 8; date = "2026-03-20"; time = "10:00 AM"; status = "ongoing" });
  programs.add(2, { id = 2; name = "Music Fusion"; description = "Group music performance blending genres"; category = "Music"; totalSlots = 15; bookedSlots = 5; date = "2026-03-20"; time = "2:00 PM"; status = "ongoing" });
  programs.add(3, { id = 3; name = "Fine Arts Exhibition"; description = "Painting and sculpture showcase"; category = "Arts"; totalSlots = 30; bookedSlots = 12; date = "2026-03-21"; time = "9:00 AM"; status = "upcoming" });

  scores.add(1, { id = 1; programId = 1; userId = 0; participantName = "Priya Sharma"; score = 92; judgeId = 0; judgeName = "Admin" });
  scores.add(2, { id = 2; programId = 1; userId = 0; participantName = "Rahul Verma"; score = 85; judgeId = 0; judgeName = "Admin" });
  scores.add(3, { id = 3; programId = 1; userId = 0; participantName = "Ananya Das"; score = 78; judgeId = 0; judgeName = "Admin" });
  scores.add(4, { id = 4; programId = 2; userId = 0; participantName = "Team Harmony"; score = 88; judgeId = 0; judgeName = "Admin" });
  scores.add(5, { id = 5; programId = 2; userId = 0; participantName = "Beat Makers"; score = 91; judgeId = 0; judgeName = "Admin" });

  // Auth

  public func registerUser(username : Text, password : Text, fullName : Text, role : Text) : async { ok : Bool; message : Text; userId : Nat } {
    for ((_, u) in users.entries()) {
      if (u.username == username) {
        return { ok = false; message = "Username already taken"; userId = 0 };
      };
    };
    let r : Role = switch (role) {
      case ("Admin") #Admin;
      case ("Teacher") #Teacher;
      case ("Judge") #Judge;
      case (_) #Student;
    };
    let uid = nextUserId;
    nextUserId += 1;
    users.add(uid, { id = uid; username; passwordHash = password; fullName; role = r });
    { ok = true; message = "Registered successfully"; userId = uid };
  };

  public query func loginUser(username : Text, password : Text) : async { ok : Bool; userId : Nat; role : Text; fullName : Text } {
    for ((_, u) in users.entries()) {
      if (u.username == username and u.passwordHash == password) {
        let roleText = switch (u.role) {
          case (#Admin) "Admin";
          case (#Student) "Student";
          case (#Teacher) "Teacher";
          case (#Judge) "Judge";
        };
        return { ok = true; userId = u.id; role = roleText; fullName = u.fullName };
      };
    };
    { ok = false; userId = 0; role = ""; fullName = "" };
  };

  // Programs

  public query func getPrograms() : async [Program] {
    programs.values().toArray();
  };

  public func createProgram(name : Text, description : Text, category : Text, totalSlots : Nat, date : Text, time : Text) : async { ok : Bool; programId : Nat } {
    let pid = nextProgramId;
    nextProgramId += 1;
    programs.add(pid, { id = pid; name; description; category; totalSlots; bookedSlots = 0; date; time; status = "upcoming" });
    { ok = true; programId = pid };
  };

  public func updateProgramStatus(programId : Nat, status : Text) : async { ok : Bool } {
    switch (programs.get(programId)) {
      case null { { ok = false } };
      case (?p) {
        programs.add(programId, { id = p.id; name = p.name; description = p.description; category = p.category; totalSlots = p.totalSlots; bookedSlots = p.bookedSlots; date = p.date; time = p.time; status });
        { ok = true };
      };
    };
  };

  // Registrations

  public func bookSlot(programId : Nat, userId : Nat) : async { ok : Bool; message : Text } {
    for ((_, r) in registrations.entries()) {
      if (r.programId == programId and r.userId == userId) {
        return { ok = false; message = "Already registered for this program" };
      };
    };
    switch (programs.get(programId)) {
      case null { { ok = false; message = "Program not found" } };
      case (?p) {
        if (p.bookedSlots >= p.totalSlots) {
          return { ok = false; message = "No slots available" };
        };
        let (uname, fname) = switch (users.get(userId)) {
          case null ("unknown", "Unknown");
          case (?u) (u.username, u.fullName);
        };
        let rid = nextRegistrationId;
        nextRegistrationId += 1;
        registrations.add(rid, { id = rid; programId; userId; username = uname; fullName = fname });
        programs.add(programId, { id = p.id; name = p.name; description = p.description; category = p.category; totalSlots = p.totalSlots; bookedSlots = p.bookedSlots + 1; date = p.date; time = p.time; status = p.status });
        { ok = true; message = "Slot booked successfully" };
      };
    };
  };

  public query func getProgramRegistrations(programId : Nat) : async [Registration] {
    registrations.values().toArray().filter(func(r : Registration) : Bool { r.programId == programId });
  };

  public query func getUserRegistrations(userId : Nat) : async [Registration] {
    registrations.values().toArray().filter(func(r : Registration) : Bool { r.userId == userId });
  };

  // Scores

  public func submitScore(programId : Nat, participantName : Text, score : Nat, judgeId : Nat) : async { ok : Bool; message : Text } {
    let judgeName = switch (users.get(judgeId)) {
      case null "Unknown";
      case (?u) u.fullName;
    };
    for ((sid, s) in scores.entries()) {
      if (s.programId == programId and s.participantName == participantName and s.judgeId == judgeId) {
        scores.add(sid, { id = s.id; programId; userId = s.userId; participantName; score; judgeId; judgeName });
        return { ok = true; message = "Score updated" };
      };
    };
    let sid = nextScoreId;
    nextScoreId += 1;
    scores.add(sid, { id = sid; programId; userId = 0; participantName; score; judgeId; judgeName });
    { ok = true; message = "Score submitted" };
  };

  public query func getScoreboard(programId : Nat) : async [ScoreEntry] {
    let programScores = scores.values().toArray().filter(func(s : Score) : Bool { s.programId == programId });
    let sorted = programScores.sort(func(a : Score, b : Score) : Order.Order {
      if (a.score > b.score) #less
      else if (a.score < b.score) #greater
      else #equal
    });
    sorted.mapEntries(func(s : Score, i : Nat) : ScoreEntry {
      { participantName = s.participantName; score = s.score; rank = i + 1 };
    });
  };

  public query func getAllScoreboards() : async [Score] {
    scores.values().toArray();
  };
};
