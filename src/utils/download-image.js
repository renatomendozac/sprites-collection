import html2canvas from "html2canvas";

const fileName = "my-sprite-collection.png";

const openImage = (blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export const downloadImage = async (node) => {
  const canvas = await html2canvas(node, {
    backgroundColor: "#080B14",
    scale: 2,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.style.color = "#e4ecff";
      doc.documentElement.style.background = "#080B14";
      doc.body.style.color = "#e4ecff";
      doc.body.style.background = "#080B14";
    },
  });

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) return;

  const file = new File([blob], fileName, {
    type: "image/png",
  });

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        openImage(blob);
      }
    } else {
      openImage(blob);
    }
  } else {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
