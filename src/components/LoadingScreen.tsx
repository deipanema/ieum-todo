import Lottie from "react-lottie-player";

import lottie from "../../public/lottie.json";

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200">
      <div>
        <Lottie loop animationData={lottie} play />
      </div>
    </div>
  );
}
