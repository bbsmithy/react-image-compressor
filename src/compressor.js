export default class firebaseICU {

  compress = (source_img_obj, desiredSize, imageSize, output_format) => {
    if (desiredSize < imageSize) {
      let mime_type;
      if (output_format === "png") {
        mime_type = "image/png";
      } else if (output_format === "webp") {
        mime_type = "image/webp";
      } else {
        mime_type = "image/jpeg";
      }
      let quality = desiredSize / imageSize;
      const cvs = document.createElement("canvas");
      cvs.width = source_img_obj.naturalWidth;
      cvs.height = source_img_obj.naturalHeight;
      const ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);

      const newImageData = cvs.toDataURL(mime_type, quality);

      return newImageData;
    }
    return source_img_obj.src;
  };

  getImageSize = (image, formatted, decimals) => {
    const head = "data:image/png;base64,";
    const imgFileSize = Math.round((image.length - head.length) * 3 / 4);
    if (imgFileSize == 0) return "0 Bytes";
    var k = 1024,
      dm = decimals || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(imgFileSize) / Math.log(k));
    var imgFileSizeFormatted =
      parseFloat((imgFileSize / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];

    return { imgFileSize, imgFileSizeFormatted };
  };
}
