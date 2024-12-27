import childProcess from "node:child_process";
import fs from "node:fs";

const excludedSources = [
    ".git",
    ".gitignore",
    ".github",
    ".npmrc",
    ".vscode",
    "biome.json",
    "mock-ups",
    "node_modules",
    "package-lock.json",
    "package.json",
    "pnpm-lock.yaml",
    "sass",
    "tools",
    "ts",
    "tsconfig.json"
];
const workspace = fs.readdirSync(".");
const targetDirectory = "./build";
if (fs.existsSync(targetDirectory)) childProcess.exec(`rm -rf ${targetDirectory}`);
childProcess.exec(`mkdir ${targetDirectory}`);
for (const source of workspace) {
    if (!excludedSources.includes(source)) {
        const stats = fs.statSync(source);
        const option = stats.isDirectory() ? "-R" : "";
        childProcess.exec(`cp ${option} ${source} ${targetDirectory}`);
    }
}
