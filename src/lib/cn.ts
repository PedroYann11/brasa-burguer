import clsx, { type ClassValue } from "clsx";

/** Concatena classes condicionais. */
export const cn = (...inputs: ClassValue[]) => clsx(inputs);
