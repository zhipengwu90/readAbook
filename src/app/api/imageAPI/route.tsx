import { ImageAnalysisClient } from "@azure-rest/ai-vision-image-analysis";
import createClient from "@azure-rest/ai-vision-image-analysis";
import { AzureKeyCredential } from "@azure/core-auth";

export async function POST(request: Request) {
  const formData = await request.formData();

  const apiKey = process.env.VISION_KEY;
  const endpoint = process.env.VISION_ENDPOINT;

  if (!apiKey || !endpoint) {
    return new Response(
      JSON.stringify({
        error:
          "VISION_KEY and VISION_ENDPOINT must be defined in environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const files = formData
    .getAll("images")
    .filter((f) => f instanceof File) as File[];
  if (!files || files.length === 0) {
    return new Response(JSON.stringify({ error: "No images uploaded" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = createClient(endpoint, new AzureKeyCredential(apiKey));
  const features = ["Caption", "Read"];

  const results = [];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await client.path("/imageanalysis:analyze").post({
      body: buffer,
      queryParameters: {
        features,
        language: "en",
        "gender-neutral-captions": "true",
        "smartCrops-aspect-ratios": [0.9, 1.33],
      },
      contentType: "application/octet-stream",
    });

    const iaResult = result.body;
    let captionText = "";
    let fullText = "";

    if ("captionResult" in iaResult && iaResult.captionResult) {
      captionText = iaResult.captionResult.text;
    }
    if ("readResult" in iaResult && iaResult.readResult?.blocks) {
      const extractedText: string[] = [];
      iaResult.readResult.blocks.forEach((block) => {
        block.lines.forEach((line) => {
          extractedText.push(line.text);
        });
      });
      fullText = extractedText.join(" ");
    }

    results.push({
      filename: file.name,
      caption: captionText,
      text: fullText,
    });
  }

  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
