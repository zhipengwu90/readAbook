import Image from "next/image";

import HomePage from "@/app/home/HomePage";

export default function Home() {
  const PASSWORD = process.env.PASSWORD;
  return (
    <div className=" ">
      <HomePage password={PASSWORD} />
    </div>
  );
}
