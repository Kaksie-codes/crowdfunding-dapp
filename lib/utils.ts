
export const exportCSV = (rows: Record<string, unknown>[], filename = "export.csv") => {
  const headers = Object.keys(rows[0]).join(",");
  const csvData = rows
    .map((row) => Object.values(row).join(","))
    .join("\n");

  const blob = new Blob([headers + "\n" + csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};
