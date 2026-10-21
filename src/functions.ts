import { avg, count, max, min, sql } from "drizzle-orm";

import { db } from "./db/index.js";
import { person_survey, person_info } from "./db/schema.js";
import { Analysis } from "./schemas.js";

export async function gather_analysis(): Promise<Analysis> {
    const [result] = await db
        .select({
            count: count(person_survey.id),
            avg: {
                q1: sql<number>`AVG(${person_survey.q1})::float8`,
                q2: sql<number>`AVG(${person_survey.q2})::float8`,
                q3: sql<number>`AVG(${person_survey.q3})::float8`,
                q4: sql<number>`AVG(${person_survey.q4})::float8`,
                q5: sql<number>`AVG(${person_survey.q5})::float8`,
                q6: sql<number>`AVG(${person_survey.q6})::float8`,
            },
            min: {
                q1: min(person_survey.q1),
                q2: min(person_survey.q2),
                q3: min(person_survey.q3),
                q4: min(person_survey.q4),
                q5: min(person_survey.q5),
                q6: min(person_survey.q6),
            },
            max: {
                q1: max(person_survey.q1),
                q2: max(person_survey.q2),
                q3: max(person_survey.q3),
                q4: max(person_survey.q4),
                q5: max(person_survey.q5),
                q6: max(person_survey.q6),
            },
        })
        .from(person_survey);
    return result;
}
