const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");

const walkFiles = (dir, extensions, files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, extensions, files);
      continue;
    }

    const ext = path.extname(entry.name);
    if (extensions.includes(ext)) {
      files.push(fullPath);
    }
  }

  return files;
};

const remapImportExtensions = (code) => {
  const fromTsx = /from\s+(['"])([^'"]+)\.tsx\1/g;
  const fromTs = /from\s+(['"])([^'"]+)\.ts\1/g;
  const importTsx = /import\((['"])([^'"]+)\.tsx\1\)/g;
  const importTs = /import\((['"])([^'"]+)\.ts\1\)/g;

  return code
    .replace(fromTsx, 'from "$2.jsx"')
    .replace(fromTs, 'from "$2.js"')
    .replace(importTsx, 'import("$2.jsx")')
    .replace(importTs, 'import("$2.js")');
};

const convertFile = async (filePath) => {
  const source = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath);
  const loader = ext === ".tsx" ? "tsx" : "ts";
  const outExt = ext === ".tsx" ? ".jsx" : ".js";

  const result = await esbuild.transform(source, {
    loader,
    format: "esm",
    target: "es2020",
    jsx: "preserve",
  });

  const outputPath = filePath.slice(0, -ext.length) + outExt;
  const outputCode = remapImportExtensions(result.code);

  fs.writeFileSync(outputPath, outputCode, "utf8");
  fs.unlinkSync(filePath);

  return {
    from: path.relative(rootDir, filePath),
    to: path.relative(rootDir, outputPath),
  };
};

const run = async () => {
  const files = walkFiles(srcDir, [".ts", ".tsx"]);

  if (files.length === 0) {
    console.log("No .ts or .tsx files found under src/");
    return;
  }

  const converted = [];
  for (const filePath of files) {
    converted.push(await convertFile(filePath));
  }

  console.log(`Converted ${converted.length} files:`);
  for (const entry of converted) {
    console.log(`- ${entry.from} -> ${entry.to}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});