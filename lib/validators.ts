import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
  apartment: z.string().optional(),
});

export const ticketSchema = z.object({
  title: z.string().min(3, "Rubriken måste vara minst 3 tecken"),
  description: z.string().min(10, "Beskrivningen måste vara minst 10 tecken"),
  category: z.enum(["VVS", "EL", "VENTILATION", "HISS", "LAUNDRY", "EXTERIOR", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export const messageSchema = z.object({
  text: z.string().min(1, "Meddelandet kan inte vara tomt"),
});