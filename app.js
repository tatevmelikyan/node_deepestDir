import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

async function findDeepestDir(dir) {
  const deepestDir = {
    depth: 0,
    path: dir,
  };

  async function readFolder(folderPath, depth) {
    try {
      const files = await readdir(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);

        const stats = await stat(filePath);
        if (stats.isDirectory()) {
          if (depth > deepestDir.depth) {
            deepestDir.depth = depth;
            deepestDir.path = filePath;
          }
          await readFolder(filePath, depth + 1);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  await readFolder(dir, 1);
  return deepestDir;
}

const deepestDir = await findDeepestDir("node_modules");
const newFilePath = path.join(deepestDir.path, "file.txt");
console.log("The deepest directory is ", deepestDir);

try {
  await writeFile(newFilePath, "Hello World!");
  console.log("File written successfully");
} catch (err) {
  console.error(err.message);
}
