import fs from "fs";
import path from "path";
import { OpenAPIV3 } from "openapi-types";

const generatedPath = path.join(
  process.cwd(),
  "generated",
  "openapi.auto.json",
);

let openApi: OpenAPIV3.Document;
if (fs.existsSync(generatedPath)) {
  const raw = fs.readFileSync(generatedPath, "utf8");
  openApi = JSON.parse(raw) as OpenAPIV3.Document;
} else {
  openApi = {
    openapi: "3.0.1",
    info: {
      title: "Sporva API",
      version: "1.0.0",
      description: "Auto-generated (partial) OpenAPI spec for the Sporva API",
    },
    servers: [{ url: "/" }],
    paths: {},
    components: { schemas: {} },
  };
}

export default openApi;
