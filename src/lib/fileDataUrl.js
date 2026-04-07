const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });

const getFileNameFromPath = (value = "") => {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  const segments = normalized.split(/[\\/]/);
  return segments[segments.length - 1] || normalized;
};

export { readFileAsDataUrl, getFileNameFromPath };
