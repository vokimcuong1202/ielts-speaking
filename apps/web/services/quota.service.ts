import type { QuotaSummary } from "@repo/shared-types";
import { apiFetch } from "../lib/api-client";

export const quotaService = {
  getMine() {
    return apiFetch<QuotaSummary>("/quota/me");
  },
};
