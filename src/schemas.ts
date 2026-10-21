import { z } from "@hono/zod-openapi";

export const analysis_schema = z.object({
    count: z.number(),
    avg: z.object({
        q1: z.number(),
        q2: z.number(),
        q3: z.number(),
        q4: z.number(),
        q5: z.number(),
        q6: z.number(),
    }),
    min: z.object({
        q1: z.number().nullable(),
        q2: z.number().nullable(),
        q3: z.number().nullable(),
        q4: z.number().nullable(),
        q5: z.number().nullable(),
        q6: z.number().nullable(),
    }),
    max: z.object({
        q1: z.number().nullable(),
        q2: z.number().nullable(),
        q3: z.number().nullable(),
        q4: z.number().nullable(),
        q5: z.number().nullable(),
        q6: z.number().nullable(),
    }),
});
export type Analysis = z.infer<typeof analysis_schema>;
