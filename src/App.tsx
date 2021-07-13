import React, { useEffect, useState } from "react";
import { Header } from "./containers/Header";
import { List } from "./containers/List";
import { AuthWrapper } from "./context/Auth/Wrapper";
import "./tailwind.output.css";
function App() {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("devicerotation", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("devicerotation", handleResize);
    };
  }, [setHeight]);
  return (
    <div
      className="min-h-screen w-full bg-gray-900 overflow-hidden text-gray-300"
      style={{ height: height }}
    >
      <div className="container mx-auto px-2">
        <AuthWrapper>
          <div className="h-screen flex flex-col " style={{ height: height }}>
            <Header />
            <div
              className="flex flex-1 flex-col"
              style={{ height: height - 40 }}
            >
              <List height={height} />
            </div>
          </div>
        </AuthWrapper>
      </div>
    </div>
  );
}

export default App;
