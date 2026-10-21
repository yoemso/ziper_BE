import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import input from "./route/input.js";
import output from "./route/output.js";

const app = new OpenAPIHono();

app.doc("/doc", {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "My Hono API",
    },
});

app.route("/o", output);
app.route("/i", input);

app.get("/", swaggerUI({ url: "/doc" }));

serve({
    fetch: app.fetch,
    port: 3000,
    hostname: "0.0.0.0",
});
