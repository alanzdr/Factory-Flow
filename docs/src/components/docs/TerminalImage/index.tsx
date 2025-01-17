import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  width: number;
  height: number;
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

const TerminalImage: React.FC<Props> = ({
  title = "Result",
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <div className="relative max-w-full bg-muted rounded-md shadow-card">
        <div className="absolute top-2.5 left-3 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full block bg-window-red" />
          <div className="w-2.5 h-2.5 rounded-full block bg-window-yellow" />
          <div className="w-2.5 h-2.5 rounded-full block bg-window-green" />
        </div>
        <p className="w-full text-sm py-1.5 text-center">{title}</p>
        <Image
          src={src}
          width={width}
          height={height}
          quality={90}
          alt={alt}
          className="max-w-full rounded-sm"
        />
      </div>
    </div>
  );
};

export default TerminalImage;
