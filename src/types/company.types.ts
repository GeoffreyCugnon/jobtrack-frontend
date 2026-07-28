export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type Company = {
  id: number;
  name: string;
  businessSector: string;
  website: string | null;
  address: string | null;
  contactsCount: number;
  candidaturesCount: number;
  latestApplicationStatus: ApplicationStatus | null;
};