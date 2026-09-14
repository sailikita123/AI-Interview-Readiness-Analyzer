import multer from "multer";
import pdfParse from "pdf-parse";

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Handles a single "resume" PDF field, extracts raw text, and attaches
 * it to req.resumeText. Downstream routes never touch the file buffer.
 */
export const resumeUpload = upload.single("resume");

export async function extractResumeText(req, res, next) {
  if (!req.file) {
    req.resumeText = "";
    return next();
  }
  try {
    const parsed = await pdfParse(req.file.buffer);
    req.resumeText = parsed.text;
    next();
  } catch (err) {
    next(err);
  }
}
