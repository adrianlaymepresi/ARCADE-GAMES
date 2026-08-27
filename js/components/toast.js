export function showToast(message, type = "default") {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.append(toast);
  setTimeout(() => toast.remove(), 2800);
}
