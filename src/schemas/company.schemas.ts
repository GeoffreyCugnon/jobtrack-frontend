import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  businessSector: z.string().min(1, 'Secteur requis'),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  address: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;