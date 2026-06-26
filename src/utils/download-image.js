import html2canvas from "html2canvas";

const fileName = "my-sprite-collection.png";

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

  canvas.toBlob(async (blob) => {
    const file = new File([blob], fileName, {
      type: "image/png",
    });

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My sprite collection",
        });
      } else {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    } else {
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(url);
    }
  }, "image/png");
};
