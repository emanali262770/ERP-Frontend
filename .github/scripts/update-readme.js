import fs from "fs";

// Read contributors.txt (generated in workflow)
const data = fs.readFileSync("contributors.txt", "utf-8").trim().split("\n");

// Load README
let readme = fs.readFileSync("README.md", "utf-8");

// Build table rows
const rows = data.map((line, index) => {
  const [count, username] = line.trim().split(/\s+/);
  const avatar = `https://github.com/${username}.png?size=50`;
  return `| ${index + 1} | <img src="${avatar}" width="50px;" /> | [@${username}](https://github.com/${username}) | ${count} PRs |`;
});

// Replace content between markers
const startMarker = "<!-- CONTRIBUTORS_START -->";
const endMarker = "<!-- CONTRIBUTORS_END -->";

const newSection =
  `${startMarker}\n\n| No. | Avatar | Username | Contributions |\n|----|--------|----------|---------------|\n` +
  rows.join("\n") +
  `\n\n${endMarker}`;

readme = readme.replace(
  new RegExp(`${startMarker}[\\s\\S]*${endMarker}`),
  newSection
);

// Save README
fs.writeFileSync("README.md", readme);
