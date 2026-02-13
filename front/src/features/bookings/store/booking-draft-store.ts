"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookingFormValues } from "../schemas/booking-form-schema";

type BookingDraftState = {
  draft: Partial<BookingFormValues>;
  setDraft: (draft: Partial<BookingFormValues>) => void;
  clearDraft: () => void;
};

const defaultDraft: Partial<BookingFormValues> = {
  professionalId: "",
  date: "",
  time: "",
  services: [],
  notes: "",
  useBonusPoints: false,
  couponCode: "",
};

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set) => ({
      draft: defaultDraft,
      setDraft: (draft) =>
        set((state) => ({ draft: { ...state.draft, ...draft } })),
      clearDraft: () => set({ draft: defaultDraft }),
    }),
    {
      name: "booking-draft",
    },
  ),
);
