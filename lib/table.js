import { table } from "table";
import chalk from "chalk";

export function printTable(data, options) {
  if (!data || !data.length) {
    return;
  }
  options = options || {};
  options.columns = options.columns || Object.keys(data[0]);
  options.headerStyleFn = options.headerStyleFn || chalk.bold;
  const header = options.columns.map((property) =>
    options.headerStyleFn(property),
  );
  const tableText = table([
    header,
    ...data.map((item) => options.columns.map((property) => item[property])),
  ]);
  console.log(tableText);
}
