import { z } from "zod";

export const createPublicationSchema = z.object({
  content: z.string().trim().min(1, "Écris quelque chose avant de publier"),
});

export type CreatePublicationValues = z.infer<typeof createPublicationSchema>;
