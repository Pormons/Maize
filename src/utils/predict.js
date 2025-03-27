// Path: react-next/utils/predict.js
import * as ort from "onnxruntime-web";
export const runInference = async (session, input) => {
  try {
    const start = new Date();
    const inputData = new ort.Tensor(
      "float32",
      new Float32Array(input.data),
      input.shape
    );
    console.log("input", inputData);
    const output = await session.run({ input: inputData });
    const end = new Date();
    
    // Convert to seconds.
    const inferenceTime = (end.getTime() - start.getTime())/1000;
    console.log("output", output);

    const boxes = output["boxes"]?.data || [];
    const scores = output["scores"]?.data || [];
    const labels = output["labels"]?.data || [];

    const labelMap = {
      0: "background",
      1: "Common Corn Rust",
      2: "Healthy",
      3: "Gray Leaf Spot",
      4: "Northern Leaf Blight",
    };

    // Create detection objects
    const detectionResults = [];
    for (let i = 0; i < scores.length; i++) {
      detectionResults.push({
        box: [
          boxes[i * 4],
          boxes[i * 4 + 1],
          boxes[i * 4 + 2],
          boxes[i * 4 + 3],
        ],
        score: scores[i],
        label: labelMap[labels[i]],
      });
    }

    return { detectionResults, inferenceTime };

  } catch (error) {
    console.log("error", error);
  }
};
