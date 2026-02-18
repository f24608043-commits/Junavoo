export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("junavo-theme") as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem("junavo-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.classList.toggle("dark", theme === "dark");
}
