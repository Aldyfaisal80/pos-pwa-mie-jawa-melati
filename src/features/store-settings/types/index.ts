import { type z } from "zod";
import { type storeSettingsSchema } from "../schemas";

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>;
