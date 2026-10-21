import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { person_survey, person_info, person_memo } from "../db/schema.js";
import { gather_analysis } from "../functions.js";
import {} from "../schemas.js";

const app = new OpenAPIHono();

//#region Survey
const survey_schema = z.object({
    q1: z.number(),
    q2: z.number(),
    q3: z.number(),
    q4: z.number(),
    q5: z.number(),
    q6: z.number(),
    q7: z.array(z.number()).length(2),
});
type Survey = z.infer<typeof survey_schema>;

const survey_db_schema = survey_schema.extend({
    q7: z.number(),
});

type SurveyDB = z.infer<typeof survey_db_schema>;

function to_survey_db(param: Survey): SurveyDB {
    const [a, b] = param.q7.sort((a, b) => a - b);
    return {
        ...param,
        q7: ((a - 1) * (12 - a)) / 2 + b - a - 1,
    };
}

async function survey_api(param: Survey) {
    const result = survey_db_schema.parse(to_survey_db(param));
    const [person] = await db
        .insert(person_survey)
        .values(result)
        .returning({ id: person_survey.id });

    return { person };
}

const survey_route = createRoute({
    method: "post",
    path: "/survey",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: survey_schema,
                },
            },
        },
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        person: z.object({
                            id: z.number(),
                        }),
                    }),
                },
            },
        },
    },
});

app.openapi(survey_route, async (c) => {
    const result = await survey_api(c.req.valid("json"));
    return c.json(result, 200);
});
//#endregion

//#region Info
const info_schema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    contact: z.string().nullable(),
    address: z.string().nullable(),
    birthday: z.string().nullable(),
    // validTime: z.string().nullable(),
});
type Info = z.infer<typeof info_schema>;

type InfoResult = {
    status: 200 | 409;
    message: string;
};

async function info_api(param: Info): Promise<InfoResult> {
    const [data] = await db
        .select({ id: person_info.id })
        .from(person_info)
        .where(eq(person_info.id, param.id))
        .limit(1);

    if (data !== undefined) {
        return { status: 409, message: "id confict" };
    }
    await db.insert(person_info).values(param);
    return { status: 200, message: "successful" };
}

const info_route = createRoute({
    method: "post",
    path: "/info",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: info_schema,
                },
            },
        },
    },
    responses: {
        200: {},
        409: {},
    },
});

app.openapi(info_route, async (c) => {
    const result = await info_api(c.req.valid("json"));
    return c.json({ message: result.message }, result.status);
});

//#endregion

//#region Memo
const memo_schema = z.object({
    id: z.number(),
    u_department: z.string().nullable(),
    u_location: z.string().nullable(),
    mbti: z.string().nullable(),
    etc: z.string().nullable(),
});
type Memo = z.infer<typeof memo_schema>;

async function memo_api(param: Memo): Promise<InfoResult> {
    const [data] = await db
        .select({ id: person_memo.id })
        .from(person_memo)
        .where(eq(person_memo.id, param.id))
        .limit(1);

    if (data !== undefined) {
        return { status: 409, message: "id confict" };
    }
    await db.insert(person_memo).values(param);
    return { status: 200, message: "successful" };
}

const memo_route = createRoute({
    method: "post",
    path: "/memo",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: memo_schema,
                },
            },
        },
    },
    responses: {
        200: {},
        409: {},
    },
});

app.openapi(memo_route, async (c) => {
    const result = await memo_api(c.req.valid("json"));
    return c.json({ message: result.message }, result.status);
});
//#endregion
export default app;
