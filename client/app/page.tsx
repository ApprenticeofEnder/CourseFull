import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="italic">Hello!</h1>
    </div>
  );
}
