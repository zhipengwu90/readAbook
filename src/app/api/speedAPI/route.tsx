import { AzureKeyCredential } from "@azure/core-auth";

import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export async function POST(request: Request) {
  const data = await request.text();

  const apiKey = process.env.SPEECH_KEY;
  const region = process.env.SPEECH_REGION;

  if (!apiKey || !region) {
    return new Response(
      JSON.stringify({
        error:
          "SPEECH_KEY and SPEECH_REGION must be defined in environment variables.",
      }),
      { status: 500, headers: { "Content-microsoft": "application/json" } }
    );
  }

  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      apiKey,
      region
    );
    speechConfig.speechSynthesisOutputFormat =
      SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
    speechConfig.speechSynthesisVoiceName = "en-US-AndrewMultilingualNeural";
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      data,
      (result) => {
        console.log("Speech synthesis result:", result);
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          const audioBuffer = Buffer.from(result.audioData);
          resolve(
            new Response(audioBuffer, {
              status: 200,
              headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": "attachment; filename=speech.mp3",
              },
            })
          );
        } else {
          resolve(
            new Response(JSON.stringify({ error: "Speech synthesis failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            })
          );
        }
        synthesizer.close();
      },
      (error) => {
        resolve(
          new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        );
        synthesizer.close();
      }
    );
  });
}
