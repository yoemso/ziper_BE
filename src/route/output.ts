import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { avg, count, max, min, sql } from "drizzle-orm";
import { Context } from "hono";

import { db } from "../db/index.js";
import { person_survey, person_info } from "../db/schema.js";
import { gather_analysis } from "../functions.js";

const app = new OpenAPIHono();

async function analysis_api() {
    return gather_analysis();
}

const analysis_route = createRoute({
    method: "get",
    path: "/analysis",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
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
                    }),
                },
            },
        },
    },
});

app.openapi(analysis_route, async (c) => {
    const result = await analysis_api();
    return c.json(result, 200);
});

export default app;
