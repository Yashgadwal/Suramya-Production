import fs from "fs";
import path from "path";
import MediaLibraryWorkspace from "@/components/MediaLibraryWorkspace";
import { Metadata } from "next";

export const revalidate = 0; // Fresh reading

export const metadata: Metadata = {
  title: "Media Library | Suramya Dashboard",
};

export default async function AdminMediaPage() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  let filesList: any[] = [];

  try {
    if (fs.existsSync(uploadDir)) {
      const files = await fs.promises.readdir(uploadDir);
      filesList = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(uploadDir, filename);
          const stats = await fs.promises.stat(filePath);
          return {
            name: filename,
            url: `/uploads/${filename}`,
            sizeBytes: stats.size,
            createdAt: stats.birthtime.toISOString(),
            isImage: /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(filename),
            isVideo: /\.(mp4|webm|ogg|mov)$/i.test(filename),
          };
        })
      );

      // Sort by newest
      filesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (error) {
    console.error("Failed to read upload directory in page:", error);
  }

  return <MediaLibraryWorkspace initialFiles={filesList} />;
}
