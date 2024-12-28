export type SizeInEm = `${number}em`;
export type Breakpoints = Map<string, SizeInEm>;
export type Button = {
    className: "open" | "close";
    width: number;
    height: number;
    paths: string[];
};
