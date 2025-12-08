import { db } from "../../db";

export { db };
export const useDrizzle = () => {
  return db;
};
