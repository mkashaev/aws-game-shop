export function generateFileName(filename: string, dirname: string = "") {
  const [name, ext] = filename.split(".");

  const fileKey = `${name.split(" ").join("-")}-${Date.now()}.${ext}`;

  if (dirname.length !== 0) {
    return [dirname, fileKey].join("/");
  }
  return fileKey;
}
