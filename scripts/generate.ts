import { join } from "node:path";

interface Schema {
  enum?: string[];
  items?: Schema;
  type?: string | string[];
}

interface Parameter {
  $ref?: string;
  in: "path" | "query" | "header";
  name: string;
  required?: boolean;
  schema?: Schema;
}

interface Operation {
  parameters?: Parameter[];
  requestBody?: { required?: boolean };
  servers?: { url: string }[];
}

interface Spec {
  components: { parameters: Record<string, Parameter> };
  paths: Record<string, Record<string, Operation | Parameter[]>>;
  servers: { url: string }[];
}

const specPath = join(
  import.meta.dir,
  "../../docs/content/docs/musickit/amp-api.yaml"
);
const outputPath = join(import.meta.dir, "../src/generated/operations.ts");
const methods = new Set(["get", "post", "put", "patch", "delete"]);
const spec = Bun.YAML.parse(await Bun.file(specPath).text()) as Spec;
const defaultHost = spec.servers[0]?.url;

const resolve = (parameter: Parameter) =>
  parameter.$ref
    ? spec.components.parameters[parameter.$ref.split("/").at(-1) ?? ""]
    : parameter;

const literal = (values: string[]) =>
  values.map((value) => JSON.stringify(value)).join(" | ");

const typeOf = (schema: Schema = {}): string => {
  if (schema.enum) {
    return literal(schema.enum);
  }
  if (schema.type === "array") {
    const items = typeOf(schema.items);
    return items.includes("|")
      ? `readonly (${items})[]`
      : `readonly ${items}[]`;
  }
  if (schema.type === "integer" || schema.type === "number") {
    return "number";
  }
  if (schema.type === "boolean") {
    return "boolean";
  }
  return "string";
};

const operations: string[] = [];
const hosts: string[] = [];

for (const [path, item] of Object.entries(spec.paths)) {
  const shared = Array.isArray(item.parameters) ? item.parameters : [];
  for (const [method, operation] of Object.entries(item)) {
    if (!methods.has(method) || Array.isArray(operation)) {
      continue;
    }
    const key = `${method.toUpperCase()} ${path}`;
    const parameters = new Map<string, Parameter>();
    for (const parameter of [...shared, ...(operation.parameters ?? [])]) {
      const resolved = resolve(parameter);
      if (resolved && resolved.in !== "header") {
        parameters.set(resolved.name, resolved);
      }
    }
    const fields = [...parameters.values()].map((parameter) => {
      const optional =
        !parameter.required || parameter.name === "storefront" ? "?" : "";
      return `    ${JSON.stringify(parameter.name)}${optional}: ${typeOf(parameter.schema)};`;
    });
    if (operation.requestBody) {
      fields.push(
        `    body${operation.requestBody.required ? "" : "?"}: unknown;`
      );
    }
    operations.push(`  ${JSON.stringify(key)}: {\n${fields.join("\n")}\n  };`);
    const host = operation.servers?.[0]?.url;
    if (host && host !== defaultHost) {
      hosts.push(`  ${JSON.stringify(key)}: ${JSON.stringify(host)},`);
    }
  }
}

await Bun.write(
  outputPath,
  `export interface Operations {\n${operations.join("\n")}\n}\n\nexport const operationHosts: Partial<Record<keyof Operations, string>> = {\n${hosts.join("\n")}\n};\n`
);

console.log(`${operations.length} operations, ${hosts.length} on other hosts`);
