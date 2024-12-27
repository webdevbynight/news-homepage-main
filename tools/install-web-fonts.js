import childProcess from "node:child_process";
import fs from "node:fs";
import webFontsToInstall from "./data/web-fonts.js";

const FONTS_PATH = "../_tools/fonts";
const fontsDirectory = fs.readdirSync(FONTS_PATH);
const availableFonts = new Map();
for (const font of fontsDirectory) {
    const fontPath = `${FONTS_PATH}/${font}`;
    const stats = fs.statSync(fontPath);
    if (stats.isDirectory()) {
        const fontPathFiles = fs.readdirSync(fontPath);
        const fontPrefix = `${font.replaceAll("_", "")}-`;
        const licenseFile = fontPathFiles.find(license => license === "LICENSE.txt" || license === "OFL.txt") ?? null;
        const hasVariableFont = fontPathFiles.some(file => file.includes("VariableFont"));
        const getWeightFileName = string => string.slice(0, string.indexOf(".")).replace(fontPrefix, "");
        const fontMap = new Map();
        const fontWeights = fontPathFiles.filter(file => file.endsWith(".ttf")).map(file => getWeightFileName(file));
        if (hasVariableFont) {
            const staticDirectory = fs.readdirSync(`${fontPath}/static`);
            for (const file of staticDirectory) {
                if (file.endsWith(".ttf")) fontWeights.push(getWeightFileName(file));
            }
        }
        fontMap.set("path", fontPath);
        fontMap.set("license", licenseFile);
        fontMap.set("prefix", fontPrefix);
        fontMap.set("hasVariable", hasVariableFont);
        fontMap.set("weights", fontWeights);
        availableFonts.set(font, fontMap);
    }
}

for (const font in webFontsToInstall) {
    const errorMessageFormatting = "\x1b[1;31m%s\x1b[0m";
    if (!availableFonts.has(font)) {
        console.error(errorMessageFormatting, `Font ${font} not found.`);
        continue;
    }
    const weights = webFontsToInstall[font];
    const fontSettings = availableFonts.get(font);
    const path = fontSettings.get("path");
    const licenseFile = fontSettings.get("license");
    const prefix = fontSettings.get("prefix");
    const hasVariable = fontSettings.get("hasVariable");
    for (const weight of weights) {
        const ttfFileName = !weight.includes("VariableFont") && hasVariable ? `${path}/static/${prefix}${weight}.ttf` : `${path}/${prefix}${weight}.ttf`;
        const woff2FileName = ttfFileName.replace("ttf", "woff2");
        if (fs.existsSync(ttfFileName)) {
            childProcess.exec(`woff2_compress ${ttfFileName}`, (error, stdout, stderr) => {
                if (error) console.error(errorMessageFormatting, `exec error: ${error}`);
                else {
                    console.log(stdout);
                    console.error(stderr);
                    childProcess.exec(`woff2_decompress ${woff2FileName}`, (error, _stdout, _stderr) => {
                        if (error) console.error(errorMessageFormatting, `exec error: ${error}`);
                        else {
                            childProcess.exec(`mv ${woff2FileName} css/fonts`, (error, _stdout, _stderr) => {
                                if (error) console.error(errorMessageFormatting, `exec error: ${error}`);
                                const fontLicenseNewDirectory = `css/fonts/licenses/${font}`;
                                if (licenseFile && !fs.existsSync(`${fontLicenseNewDirectory}/${licenseFile}`)) {
                                    childProcess.exec(`mkdir -p ${fontLicenseNewDirectory}`, (error, _stdout, _stderr) => {
                                        if (error) console.error(errorMessageFormatting, `exec error: ${error}`);
                                        else {
                                            childProcess.exec(`cp ${path}/${licenseFile} ${fontLicenseNewDirectory}`, (error, _stdout, _stderr) => {
                                                if (error) console.error(errorMessageFormatting, `exec error: ${error}`);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else console.error(errorMessageFormatting, `The file ${ttfFileName} does not exist.`);
    }
}
