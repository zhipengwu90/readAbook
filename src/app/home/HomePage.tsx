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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import Select, { SelectChangeEvent } from "@mui/material/Select";
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
  const [language, setLanguage] = useState<string>(
    "en-US-AndrewMultilingualNeural"
  );

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
    setResponse([]); // Clear previous responses

    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("images", images[i]);

      try {
        const response = await fetch("/api/imageAPI", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to send image");
        }
        const result = await response.json();

        setResponse((prev) =>
          prev
            ? [...prev, ...(result.results || [result])]
            : [...(result.results || [result])]
        );
      } catch (error) {
        setResponse((prev) =>
          prev
            ? [
                ...prev,
                {
                  filename: images[i].name,
                  caption: "",
                  text: "Error processing image",
                },
              ]
            : [
                {
                  filename: images[i].name,
                  caption: "",
                  text: "Error processing image",
                },
              ]
        );
      }
    }

    setIsLoading(false);
    setImageSend(true); // Set imageSend to true after all images are sent
  };

  const handleClear = () => {
    setImages([]);
    setResponse(undefined);
    const handleSendImages = async () => {
      if (images.length === 0) {
        alert("Please upload images first.");
        return;
      }

      setIsLoading(true);
      setResponse([]); // Clear previous responses

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("images", images[i]);

        try {
          const response = await fetch("/api/imageAPI", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error("Failed to send image");
          }
          const result = await response.json();

          setResponse((prev) =>
            prev
              ? [...prev, ...(result.results || [result])]
              : [...(result.results || [result])]
          );
        } catch (error) {
          setResponse((prev) =>
            prev
              ? [
                  ...prev,
                  {
                    filename: images[i].name,
                    caption: "",
                    text: "Error processing image",
                  },
                ]
              : [
                  {
                    filename: images[i].name,
                    caption: "",
                    text: "Error processing image",
                  },
                ]
          );
        }
      }

      setIsLoading(false);
      setImageSend(true); // Set imageSend to true after all images are sent
    };
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

  // <MenuItem value="en-US-AndrewMultilingualNeural">EN-Andrew</MenuItem>
  //         <MenuItem value="en-US-JaneNeural">EN-Jane</MenuItem>
  //         <MenuItem value="en-US-Emma:DragonHDLatestNeural">EN-Emma</MenuItem>

  //         <MenuItem value="zh-CN-YunxiNeural">CN-Yunxi</MenuItem>
  //         {/* <MenuItem value="zh-CN-YunxiNeural-Boy">CN-Yunxi-boy</MenuItem> */}
  //         <MenuItem value="zh-CN-Xiaoxiao:DragonHDFlashLatestNeural">
  //           CN-Xiaoxiao
  //         </MenuItem>
  //         <MenuItem value=" zh-CN-YunjianNeural">CN-Yunjian</MenuItem>
  const MyVoice = () => {
    if (language === "en-US-AndrewMultilingualNeural") {
      return <AudioPlayerButton language={language} text={"Hi,This is Andrew"} />;
    }
    if (language === "en-US-JaneNeural") {
      return <AudioPlayerButton language={language} text={"Hi,This is Jane"} />;
    }
    if (language === "en-US-EmmaNeural") {
      return <AudioPlayerButton language={language} text={"Hi,This is Emma"} />;
    }
    if (language === "zh-CN-YunxiNeural") {
      return <AudioPlayerButton language={language} text={"你好，这是云溪"} />;
    }
    if (language === "zh-CN-XiaoxiaoNeural") {
      return <AudioPlayerButton language={language} text={"你好，这是小小"} />;
    }
    if (language === "zh-CN-YunjianNeural") {
      return <AudioPlayerButton language={language} text={"你好，这是云剑"} />;
    }
  };

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
      <div className="flex flex-row items-center justify-center w-full max-w-md">
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          label="language"
          onChange={(e: SelectChangeEvent<string>) => {
            setLanguage(e.target.value);
          }}
          className="mt-4 mb-4"
          value={language}
        >
          <MenuItem value="en-US-AndrewMultilingualNeural">EN-Andrew</MenuItem>
          <MenuItem value="en-US-JaneNeural">EN-Jane</MenuItem>
          <MenuItem value="en-US-EmmaNeural">EN-Emma</MenuItem>

          <MenuItem value="zh-CN-YunxiNeural">CN-Yunxi</MenuItem>
          {/* <MenuItem value="zh-CN-YunxiNeural-Boy">CN-Yunxi-boy</MenuItem> */}
          <MenuItem value="zh-CN-XiaoxiaoNeural">
            CN-Xiaoxiao
          </MenuItem>
          <MenuItem value="zh-CN-YunjianNeural">CN-Yunjian</MenuItem>
        </Select>

        <MyVoice />
      </div>

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
          <div className="mt-4 pb-20">
            <h2 className="text-lg font-bold">Response:</h2>
            <ul className="list-disc pl-5">
              {response.map((res, idx) => (
                <li key={idx}>
                  {/* <span>Picture shows:</span> {res.caption}
                  <AudioPlayerButton text={"Picture shows" + res.caption} />
                  <br /> */}
                  <span>Picture {idx + 1}: </span>
                  {res.text}
                  <AudioPlayerButton language={language} text={res.text} />
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
