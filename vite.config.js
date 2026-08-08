import { defineConfig } from "vite";
import { resolve } from "path";
import { register } from "module";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "pages/login.html"),
        register: resolve(__dirname, "pages/register.html"),
        dashboard: resolve(__dirname, "pages/dashboard.html"),
        income: resolve(__dirname, "pages/income.html"),
        expense: resolve(__dirname, "pages/expense.html"),
        budget: resolve(__dirname, "pages/budget.html"),
        report: resolve(__dirname, "pages/report.html"),
        settings: resolve(__dirname, "pages/settings.html"),
        terms: resolve(__dirname, "pages/terms.html"),
        privacy: resolve(__dirname, "pages/privacy.html")
      }
    }
  }
});