import { getBreakpoints, setBurgerMenu } from "./utils.js";

const header = document.getElementById("header");
const menu = document.getElementById("menu");
if (header && menu) {
    const breakpoints = getBreakpoints();
    const wideMenuBreakpoint = breakpoints.get("wide-menu");
    if (wideMenuBreakpoint) {
        for (const event of ["load", "resize"]) {
            window.addEventListener(event, () => {
                const burgerMenu = header.querySelector("button");
                if (window.matchMedia(`(width < ${wideMenuBreakpoint})`).matches) {
                    if (!burgerMenu) {
                        header.insertBefore(setBurgerMenu(), menu);
                    }
                } else if (burgerMenu) burgerMenu.remove();
            });
        }
    }
}
