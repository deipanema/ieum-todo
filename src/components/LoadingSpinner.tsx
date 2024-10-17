import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <motion.div
      data-testid="spinner"
      animate={{ rotate: 360 }}
      transition={{
        // repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    >
      <Image src="/spinner.png" alt="Loading..." width={17} height={17} />
    </motion.div>
  );
}
