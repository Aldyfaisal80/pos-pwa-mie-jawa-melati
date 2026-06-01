export const getBase64ImageFromUrl = async (
  imageUrl: string,
  targetWidth = 145,
): Promise<string | null> => {
  try {
    // Fetch with explicit CORS mode so the response is usable cross-origin
    const response = await fetch(imageUrl, { mode: "cors" });
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        // data: URLs are same-origin so crossOrigin must NOT be set.
        // Setting crossOrigin on a data: URL breaks loading in some browsers.
        img.onload = () => {
          // Scale proportionally
          const scale = targetWidth / img.width;
          const targetHeight = Math.round(img.height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas 2D context not available"));
            return;
          }

          // Optional: fill white background for transparent PNGs before drawing
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          // Return the explicitly resized image as base64
          resolve(canvas.toDataURL("image/jpeg", 1.0));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching or converting image for print:", error);
    return null;
  }
};
