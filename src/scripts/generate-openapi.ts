import fs from "fs";
import path from "path";
import { z } from "zod";
import { pathToFileURL } from "url";

type RouteInfo = {
  method: string;
  route: string;
  file: string;
  validator?: string | null;
  validatorTarget?: string | null;
};

function readFile(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

function findRouteFiles(): string[] {
  const routesDir = path.resolve(process.cwd(), "src/domains");
  const files: string[] = [];

  function walk(dir: string) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) walk(p);
      else if (name.endsWith(".routes.ts")) files.push(p);
    }
  }

  walk(routesDir);
  return files;
}

function parseRoutes(file: string): RouteInfo[] {
  const content = readFile(file);
  const routes: RouteInfo[] = [];
  const regex =
    /router\.(get|post|patch|put|delete)\s*\(\s*([`"'])([^`"']+)\2\s*,([\s\S]*?)\)\s*;/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content))) {
    const method = m[1].toLowerCase();
    const routePath = m[3];
    const middlewareSegment = m[4];
    const validatorMatch = middlewareSegment.match(
      /validate\(\s*([A-Za-z0-9_]+)\s*(,\s*(["']?)(query|params|body|headers)\3\s*)?\)/,
    );
    const validator = validatorMatch ? validatorMatch[1] : null;
    const validatorTarget = validatorMatch ? validatorMatch[4] || null : null;
    routes.push({ method, route: routePath, file, validator, validatorTarget });
  }
  return routes;
}

function convertParamPath(routePath: string) {
  return routePath.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}

function inferSchemaFromZod(zodSchema: any): any {
  // defensive: if not a Zod schema, try to use it directly as JSON Schema
  if (!zodSchema || typeof zodSchema !== "object") return { type: "string" };

  // some validators might already be plain JSON Schema
  if (zodSchema.type && (zodSchema.properties || zodSchema.enum))
    return zodSchema;

  try {
    const def = zodSchema._def || zodSchema;
    const typeName = def.typeName || def.type || null;

    // object / strict object handling
    if (
      typeName === "ZodObject" ||
      typeName === "ZodStrictObject" ||
      def.shape
    ) {
      const shape =
        typeof def.shape === "function" ? def.shape() : def.shape || {};
      const properties: Record<string, any> = {};
      const required: string[] = [];
      if (shape && typeof shape === "object") {
        for (const key of Object.keys(shape)) {
          const child = shape[key];
          const childSchema = inferSchemaFromZod(child);
          properties[key] = childSchema;
          const childDef = child?._def || {};
          const isOptional =
            childDef.typeName === "ZodOptional" ||
            childDef.typeName === "ZodNullable" ||
            (typeof child.isOptional === "function" && child.isOptional());
          if (!isOptional) required.push(key);
        }
      }
      const res: any = { type: "object", properties };
      if (required.length) res.required = required;
      return res;
    }

    // optional / nullable
    if (typeName === "ZodOptional" || typeName === "ZodNullable") {
      const inner =
        def.innerType ||
        def.unwrap ||
        def.schema ||
        def._def?.innerType ||
        def._def?.inner;
      const innerSchema = inferSchemaFromZod(inner);
      // represent nullable via nullable:true or type union
      if (typeName === "ZodNullable") {
        innerSchema.nullable = true;
      }
      return innerSchema;
    }

    // union
    if (typeName === "ZodUnion" && Array.isArray(def.options)) {
      const anyOf = def.options.map((o: any) => inferSchemaFromZod(o));
      return { anyOf };
    }

    // enums
    if (typeName === "ZodEnum" || typeName === "ZodNativeEnum") {
      const vals = def.values || def.options || def._def?.values || [];
      return {
        type: typeof vals[0] === "number" ? "number" : "string",
        enum: vals,
      };
    }

    // arrays
    if (typeName === "ZodArray" || def.type === "array") {
      const inner =
        def.type ||
        def.element ||
        def.items ||
        def._def?.type ||
        def._def?.innerType;
      return { type: "array", items: inferSchemaFromZod(inner) };
    }

    // primitives
    if (typeName === "ZodString" || def.type === "string")
      return { type: "string" };
    if (typeName === "ZodNumber" || def.type === "number")
      return { type: "number" };
    if (typeName === "ZodBoolean" || def.type === "boolean")
      return { type: "boolean" };
    if (typeName === "ZodDate" || def.type === "date")
      return { type: "string", format: "date-time" };

    // fallback
    return { type: "string" };
  } catch (err) {
    return { type: "string" };
  }
}

async function tryLoadValidation(file: string) {
  const dir = path.dirname(file);
  const base = path.basename(file).replace(".routes.ts", "");
  const validationFile = path.join(dir, `${base}.validation.ts`);
  if (!fs.existsSync(validationFile)) return null;
  try {
    const mod = await import(pathToFileURL(validationFile).href);
    const result: Record<string, any> = {};
    for (const key of Object.keys(mod)) {
      const val = (mod as any)[key];
      if (val && typeof val.safeParse === "function") {
        // Convert Zod schema to a simple JSON Schema
        const js = inferSchemaFromZod(val);
        result[key] = js;
      }
    }
    return result;
  } catch (err) {
    console.warn(`Could not import validation file ${validationFile}: ${err}`);
    return null;
  }
}

async function buildSkeleton() {
  const routeFiles = findRouteFiles();
  const openapi: any = {
    openapi: "3.0.1",
    info: { title: "Sporva API (auto)", version: "1.0.0" },
    paths: {},
    components: { schemas: {} },
  };

  // Parse Prisma schema to derive model components
  const prismaSchemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  if (fs.existsSync(prismaSchemaPath)) {
    const prismaRaw = readFile(prismaSchemaPath);
    const modelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\n\}/g;
    let mm: RegExpExecArray | null;
    while ((mm = modelRegex.exec(prismaRaw))) {
      const modelName = mm[1];
      const body = mm[2];
      const lines = body
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const props: Record<string, any> = {
        type: "object",
        properties: {},
        required: [],
      };
      for (const ln of lines) {
        // skip indexes and @@
        if (ln.startsWith("@@") || ln.startsWith("//")) continue;
        const m = ln.match(/^(\w+)\s+(\w+)(\?|\[|\@|\s)/);
        if (!m) continue;
        const [_, prop, type] = m;
        let schema: any = {};
        if (type === "String") schema = { type: "string" };
        else if (type === "Int") schema = { type: "integer" };
        else if (type === "Boolean") schema = { type: "boolean" };
        else if (type === "DateTime")
          schema = { type: "string", format: "date-time" };
        else if (type === "Decimal") schema = { type: "number" };
        else schema = { type: "string" };
        props.properties[prop] = schema;
        if (!ln.includes("?")) props.required.push(prop);
      }
      if (props.required.length === 0) delete props.required;
      openapi.components.schemas[modelName] = props;
    }
  }

  for (const file of routeFiles) {
    const routes = parseRoutes(file);
    const rel = path.relative(path.join(process.cwd(), "src"), file);
    const parts = rel.split(path.sep);
    const domain = parts[1] || "root";

    const validations = await tryLoadValidation(file);
    if (validations) {
      // Insert definitions into components; normalize zod-to-json-schema outputs
      for (const k of Object.keys(validations)) {
        const val = validations[k];
        // If the value looks like a zod-to-json-schema output with definitions
        if (val && typeof val === "object" && (val.definitions || val.$ref)) {
          // if definitions exist and a $ref points to one, use the referenced definition
          if (val.definitions && val.$ref) {
            const ref: string = val.$ref as string;
            const parts = ref.split("/");
            const refName = parts[parts.length - 1];
            if (val.definitions[refName]) {
              openapi.components.schemas[k] = val.definitions[refName];
              // also copy other defs to components if not present
              for (const d of Object.keys(val.definitions)) {
                if (!openapi.components.schemas[d])
                  openapi.components.schemas[d] = val.definitions[d];
              }
            } else {
              openapi.components.schemas[k] = val;
            }
          } else if (val.definitions) {
            // if only definitions present, copy them all
            for (const d of Object.keys(val.definitions)) {
              if (!openapi.components.schemas[d])
                openapi.components.schemas[d] = val.definitions[d];
            }
            // if the original export name matches a definition, map it
            if (val.definitions[k])
              openapi.components.schemas[k] = val.definitions[k];
          } else {
            openapi.components.schemas[k] = val;
          }
        } else {
          openapi.components.schemas[k] = val;
        }
      }
    }

    for (const r of routes) {
      const fullPath = `/api/v1/${domain}${r.route.startsWith("/") ? r.route : "/" + r.route}`;
      const pathKey = convertParamPath(fullPath);
      openapi.paths[pathKey] = openapi.paths[pathKey] || {};

      const op: any = {
        tags: [domain],
        summary: `${r.method.toUpperCase()} ${pathKey}`,
        responses: { "200": { description: "OK" } },
      };

      if (r.validator && validations && validations[r.validator]) {
        const compName = r.validator;
        const schemaObj = validations[r.validator];
        // if Zod produced an object schema, decompose into parameters when query
        if (["post", "put", "patch"].includes(r.method)) {
          op.requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: `#/components/schemas/${compName}` },
              },
            },
          };
        } else if (
          r.validatorTarget === "query" &&
          schemaObj &&
          schemaObj.properties
        ) {
          op.parameters = [];
          for (const [pName, pSchema] of Object.entries(schemaObj.properties)) {
            op.parameters.push({ name: pName, in: "query", schema: pSchema });
          }
        } else {
          // fallback: include as single ref
          op.parameters = op.parameters || [];
          op.parameters.push({
            name: compName,
            in: "query",
            schema: { $ref: `#/components/schemas/${compName}` },
          });
        }
      }

      // If path has path parameters like {id} and op.parameters doesn't define them, add defaults
      const pathParams = Array.from(
        pathKey.matchAll(/\{([a-zA-Z0-9_]+)\}/g),
      ).map((m) => m[1]);
      if (pathParams.length > 0) {
        op.parameters = op.parameters || [];
        for (const p of pathParams) {
          const exists = (op.parameters || []).some(
            (pp: any) => pp.name === p && pp.in === "path",
          );
          if (!exists) {
            op.parameters.push({
              name: p,
              in: "path",
              required: true,
              schema: { type: "string" },
            });
          }
        }
      }

      // Try to detect prisma model usage in controller files to attach response schema
      // Look for `prisma.<model>.findUnique` or `prisma.<model>.findFirst` or `prisma.<model>.findMany`
      try {
        const controllerFile = file.replace(/\.routes\.ts$/, ".controller.ts");
        if (fs.existsSync(controllerFile)) {
          const controllerSrc = readFile(controllerFile);
          const prismaMatch = controllerSrc.match(
            /prisma\.([A-Za-z0-9_]+)\.(findUnique|findFirst|findMany|create|update|delete)/,
          );
          if (prismaMatch) {
            const modelName =
              prismaMatch[1].charAt(0).toUpperCase() + prismaMatch[1].slice(1);
            if (openapi.components.schemas[modelName]) {
              // detect findMany -> array
              const methodName = prismaMatch[2];
              if (methodName === "findMany") {
                op.responses["200"] = {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: { $ref: `#/components/schemas/${modelName}` },
                      },
                    },
                  },
                };
              } else {
                op.responses["200"] = {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: { $ref: `#/components/schemas/${modelName}` },
                    },
                  },
                };
              }
            }
          }
        }
      } catch (e) {
        // ignore
      }

      openapi.paths[pathKey][r.method] = op;
    }
  }

  return openapi;
}

function writeOutput(obj: any) {
  const outDir = path.join(process.cwd(), "generated");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "openapi.auto.json");
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2));
  console.log(`Wrote ${outPath}`);
}

async function main() {
  const spec = await buildSkeleton();
  writeOutput(spec);
}

main();
