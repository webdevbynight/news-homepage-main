import type { Breakpoints, Button, SizeInEm } from "./types.ts";

/**
 * Converts a value in pixel to em.
 * @param value - The value, assumed in pixels, to convert.
 * @return The value in em.
 */
const convertPxToEm = (value: number): SizeInEm => `${value / 16}em`;

/**
 * Gets the breakpoints declared as CSS custom properties at the root element.
 * @return A map containing key/value pairs (the breakpoint name as the key and its value converted to em).
 */
export const getBreakpoints = (): Breakpoints => {
    const breakpoints: Breakpoints = new Map();
    const prefix = "--breakpoint-";
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
                for (const property of rule.style) {
                    if (property.startsWith(prefix)) breakpoints.set(property.replace(prefix, ""), convertPxToEm(Number(rule.style.getPropertyValue(property))));
                }
            }
        }
    }
    return breakpoints;
};

/**
 * Sets the burger menu if not already present in the DOM.
 * @return A `button` element.
 */
export const setBurgerMenu = (): HTMLButtonElement => {
    const burgerMenu = document.createElement("button");
    burgerMenu.classList.add("burger-menu", "open", "first-load");
    const buttons: Button[] = [
        {
            className: "open",
            width: 40,
            height: 17,
            paths: ["M0 0h40v3H0zM0 7h40v3H0zM0 14h40v3H0z", "M0 0h40v3H0z"]
        },
        {
            className: "close",
            width: 32,
            height: 31,
            paths: ["m2.919.297 28.284 28.284-2.122 2.122L.797 2.419z", "M.797 28.581 29.081.297l2.122 2.122L2.919 30.703z"]
        }
    ];
    for (const button of buttons) {
        const { className, width, height, paths } = button;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", className);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", String(width));
        svg.setAttribute("height", String(height));
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        for (const path of paths) {
            const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathElement.setAttribute("d", path);
            svg.appendChild(pathElement);
        }
        burgerMenu.appendChild(svg);
    }
    burgerMenu.addEventListener("click", function () {
        this.classList.remove("first-load");
        this.classList.toggle("open");
        this.classList.toggle("close");
    });
    return burgerMenu;
};
