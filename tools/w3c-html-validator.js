import fs from "node:fs";
import { w3cHtmlValidator } from "w3c-html-validator";

const options = {
    ignoreLevel: "warning"
};
const files = fs.readdirSync(".").filter(file => file.endsWith(".html") && !file.startsWith("template"));
for (const file of files) {
    const report = results => w3cHtmlValidator.reporter(results, { continueOnFail: true });
    Object.assign(options, { filename: file });
    w3cHtmlValidator.validate(options).then(report);
}
