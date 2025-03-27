import * as Jimp from "jimp";
import { Tensor } from "onnxruntime-web";

export async function getImageTensorFromPath(path, dims = [1, 3, 640, 640]) {
  // 1. load the image
  var image = await loadImagefromPath(path, dims[2], dims[3]);
  // 2. convert to tensor
  var imageTensor = imageDataToTensor(image, dims);
  // 3. return the tensor
  return imageTensor;
}

export const preprocessImage = async (imageFile) => {
  const loadImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    });
  };

  const img = await loadImage(imageFile);
  const dimensions = { width: img.width, height: img.height };

  // Create processing canvas at 640x640
  const processCanvas = document.createElement("canvas");
  processCanvas.width = 640;
  processCanvas.height = 640;
  const processCtx = processCanvas.getContext("2d");

  processCtx.drawImage(img, 0, 0, processCanvas.width, processCanvas.height);
  const imageData = processCtx.getImageData(
    0,
    0,
    processCanvas.width,
    processCanvas.height
  );
  const data = imageData.data;

  const tensorArray = new Float32Array(
    3 * processCanvas.width * processCanvas.height
  );

  for (let y = 0; y < processCanvas.height; y++) {
    for (let x = 0; x < processCanvas.width; x++) {
      const pixelIndex = (y * processCanvas.width + x) * 4;
      const tensorIndex = y * processCanvas.width + x;

      tensorArray[tensorIndex] = data[pixelIndex] / 255.0;
      tensorArray[tensorIndex + processCanvas.width * processCanvas.height] =
        data[pixelIndex + 1] / 255.0;
      tensorArray[
        tensorIndex + 2 * processCanvas.width * processCanvas.height
      ] = data[pixelIndex + 2] / 255.0;
    }
  }

  const tensorData = {
    data: tensorArray,
    shape: [1, 3, processCanvas.height, processCanvas.width],
  };

  return { tensorData, dimensions };
};

async function loadImagefromPath(path, width = 640, height = 640) {
  // Use Jimp to load the image and resize it with black background
  var imageData = await Jimp.default.read(path).then((image) => {
    return image.contain(
      width,
      height,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      Jimp.RGBA_BLACK
    );
  });

  return imageData;
}

function imageDataToTensor(image, dims) {
  // 1. Get buffer data from image and create R, G, and B arrays.
  var imageBufferData = image.bitmap.data;
  const [redArray, greenArray, blueArray] = [[], [], []];

  // 2. Loop through the image buffer and extract the R, G, and B channels
  for (let i = 0; i < imageBufferData.length; i += 4) {
    redArray.push(imageBufferData[i]);
    greenArray.push(imageBufferData[i + 1]);
    blueArray.push(imageBufferData[i + 2]);
    // skip data[i + 3] to filter out the alpha channel
  }

  // 3. Concatenate RGB to transpose [224, 224, 3] -> [3, 224, 224] to a number array
  const transposedData = redArray.concat(greenArray).concat(blueArray);

  // 4. convert to float32
  let i,
    l = transposedData.length; // length, we need this for the loop
  // create the Float32Array size 3 * 224 * 224 for these dimensions output
  const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
  for (i = 0; i < l; i++) {
    float32Data[i] = transposedData[i] / 255.0; // convert to float
  }
  // 5. create the tensor object from onnxruntime-web.
  const inputTensor = new Tensor("float32", float32Data, dims);
  return inputTensor;
}
