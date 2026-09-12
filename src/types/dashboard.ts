// src/types/dashboard.ts

export type UpcomingDispatch = {
  id: string;
  scheduledDate: Date | null;
  customerName: string | null;
  city: string | null;
  area: string | null;
  responsibleUser: {
    name: string | null;
    email: string | null;
  } | null;
};

export type QuoteItem = {
  id: string;
  status: string;
  totalCost?: string | null;
  price?: string | null;
  cost?: number | null;
};