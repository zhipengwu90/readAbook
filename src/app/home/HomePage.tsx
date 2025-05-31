"use client";
import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { IconButton } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CircularProgress from "@mui/material/CircularProgress";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import Box from "@mui/material/Box";
import AudioPlayerButton from "./AudioPlayerButton";
interface HomePageProps {
  password?: string;
}

type ResponseObject = {
  filename?: string;
  caption: string;
  text: string;
};
const HomePage = (props: HomePageProps) => {
  const { password } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [imageSend, setImageSend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [response, setResponse] = useState<ResponseObject[] | undefined>(
    undefined
  );

  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setImages(Array.from(files));
    }
  };

  const handleSendImages = async () => {
    if (images.length === 0) {
      alert("Please upload images first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    images.forEach((img, idx) => {
      formData.append("images", img); // "images" is the field name
    });

    try {
      const response = await fetch("/api/imageAPI", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to send images");
      }

      const result = await response.text();

      let resultObject = JSON.parse(result);
      setResponse(resultObject);
      console.log("Response Object:", resultObject.results);

      setIsLoading(false);
      setImageSend(true);
      setResponse(resultObject.results);

      //   alert("Images sent successfully!");
    } catch (error) {
      console.error("Error sending images:", error);
      alert("Error sending images. Please try again.");
    }
  };

  const handleClear = () => {
    setImages([]);
    setResponse(undefined);
    setImageSend(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setAudioFile(null);
    setIsLoading(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === password) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password.");
    }
  };

  if (!isAuthenticated) {
    return (
      <form
        onSubmit={handlePasswordSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter password"
          style={{
            padding: 8,
            fontSize: 16,
            marginBottom: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
            width: 300,
          }}
        />
        <button
          type="submit"
          style={{
            padding: 8,
            fontSize: 16,
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            width: 300,
          }}
        >
          Enter
        </button>
        {passwordError && (
          <div style={{ color: "red", marginTop: 8 }}>{passwordError}</div>
        )}
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen p-10">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-80 z-50">
          <CircularProgress />
        </div>
      )}
      {!imageSend ? (
        <Button variant="contained" color="primary" onClick={handleUploadClick}>
          Upload
        </Button>
      ) : (
        <Button variant="contained" color="error" onClick={handleClear}>
          Clear
        </Button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={URL.createObjectURL(img)}
            alt={`Uploaded Image ${idx + 1}`}
            width={200}
            height={200}
            className="rounded"
          />
        ))}

        {response && response.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Response:</h2>
            <ul className="list-disc pl-5">
              {response.map((res, idx) => (
                <li key={idx}>
                  <span>Picture shows:</span> {res.caption}
                  <AudioPlayerButton text={"Picture shows" + res.caption} />
                  <br />
                  <span>Text: </span>
                  {res.text}
                  <AudioPlayerButton text={res.text} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {images.length !== 0 && !imageSend && (
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSendImages}
            >
              Send Images
            </Button>
          </div>
        )}

        {/* <Button variant="contained" color="success" onClick={() => sendText()}>
          Send Text
        </Button> */}
      </div>
    </div>
  );
};

export default HomePage;
