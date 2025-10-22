// src/lib/socket.ts
// This file is for SERVER-SIDE use only to create a singleton IO instance.
import { Server } from "socket.io";

export const io = new Server({
  // Options can be configured here or when attaching
});
