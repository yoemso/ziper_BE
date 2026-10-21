import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

function basic() {
    return { message: 1 };
}

app.get("/", (c) => {
    return c.json({
        message: "Swagger",
    });
});

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "My Hono API",
    },
});

const basicRoute = createRoute({
    method: "get",
    path: "/hello",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.number(),
                    }),
                },
            },
            description: "Successful response",
        },
    },
});

app.openapi(basicRoute, (c) => {
    return c.json(basic(), 200);
});

app.get("/ui", swaggerUI({ url: "/doc" }));

serve({
    fetch: app.fetch,
    port: 3000,
});
