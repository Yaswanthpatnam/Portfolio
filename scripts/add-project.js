import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsFilePath = path.join(__dirname, "../src/data/projects.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n========================================");
  console.log("  🚀 ADD NEW PROJECT TO PORTFOLIO");
  console.log("========================================\n");

  try {
    const title = (await askQuestion("1. Project Title: ")).trim();
    if (!title) {
      console.log("❌ Project title is required!");
      rl.close();
      return;
    }

    const subtitle = (await askQuestion("2. Tagline / Subtitle: ")).trim();
    const description = (await askQuestion("3. Detailed Description: ")).trim();

    console.log("\nCategory Options:");
    console.log("  1) Full-Stack");
    console.log("  2) Frontend");
    console.log("  3) Backend & API");
    const categoryChoice = (await askQuestion("Select Category (1/2/3, default 1): ")).trim();
    
    let category = "fullstack";
    let categoryLabel = "Full-Stack";
    if (categoryChoice === "2") {
      category = "frontend";
      categoryLabel = "Frontend";
    } else if (categoryChoice === "3") {
      category = "backend";
      categoryLabel = "Backend & API";
    }

    const stackRaw = await askQuestion("4. Tech Stack (comma-separated, e.g. React, Django, Tailwind CSS): ");
    const stack = stackRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const github = (await askQuestion("5. GitHub URL: ")).trim();
    const live = (await askQuestion("6. Live Demo URL (optional): ")).trim();

    const highlightsRaw = await askQuestion("7. Key Highlights (comma-separated, optional): ");
    const highlights = highlightsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const isFeaturedInput = (await askQuestion("8. Mark as Featured project? (y/N): ")).trim().toLowerCase();
    const featured = isFeaturedInput === "y" || isFeaturedInput === "yes";

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newProject = {
      id: id || `project-${Date.now()}`,
      title,
      subtitle: subtitle || `${categoryLabel} Project`,
      description: description || "Detailed summary coming soon.",
      category,
      categoryLabel,
      stack: stack.length > 0 ? stack : ["JavaScript"],
      status: "Live",
      statusColor: "#83CE7E",
      github: github || "",
      live: live || "",
      featured,
      highlights,
    };

    let projects = [];
    if (fs.existsSync(projectsFilePath)) {
      const data = fs.readFileSync(projectsFilePath, "utf-8");
      projects = JSON.parse(data);
    }

    // Insert at the beginning so the newest project is shown first
    projects.unshift(newProject);

    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), "utf-8");

    console.log("\n========================================");
    console.log(`✅ Success! "${title}" has been added to your portfolio.`);
    console.log(`📁 Saved in: src/data/projects.json`);
    console.log("========================================\n");
  } catch (error) {
    console.error("❌ Error adding project:", error);
  } finally {
    rl.close();
  }
}

main();
