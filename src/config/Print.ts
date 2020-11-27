export async function print(fileUrl: string) {
  const $oldPrintFrame = document.querySelector("#print-frame");

  if ($oldPrintFrame) {
    document.body.removeChild($oldPrintFrame);
  }

  const res = await fetch(fileUrl);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const $printFrame = document.createElement("iframe");

  $printFrame.style.display = "none";
  $printFrame.src = blobUrl;
  $printFrame.id = "print-frame";

  document.body.appendChild($printFrame);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  $printFrame.contentWindow!.print();
  URL.revokeObjectURL(blobUrl);
}

export const isImageFile = (filename: string) => {
  const lowercase = filename.toLowerCase();
  return ["png", "jpg", "jpeg"].some((ext) => lowercase.endsWith(`.${ext}`));
};

export const isPdfFile = (filename: string) => {
  return filename.toLowerCase().endsWith(`.pdf`);
};

export const isPrintable = (filename: string) => {
  return isPdfFile(filename) || isImageFile(filename);
};
