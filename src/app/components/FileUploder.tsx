"use client";

import { Input } from "src/components/ui/input";
import { useState } from "react";

import Image from "next/image";
import { ASSET_CONFIGS, AssetType } from "../utils/files/asset-configs";
import { isAssetSizeValid } from "../utils/files/file-validation";
import { uploadFile } from "../utils/files/file-upload";
import { FileSizeErrorAlert } from "./FileSizeErrorAlert";

export type FileUploaderProps = {
  assetType: AssetType;
};

export default function FileUploader({ assetType }: FileUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isAssetSizeValid(assetType, file)) {
      setShowSizeError(true);
      return;
    }

    await displayImagePreview(file);
    await uploadFile(assetType, file);
  };

  const displayImagePreview = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setShowSizeError(false);
        resolve();
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <div>
      {/* File Input */}
      <Input
        id="picture"
        type="file"
        accept={ASSET_CONFIGS[assetType].acceptedTypes.join(",")}
        onChange={handleFileChange}
      />

      {/* Error Alert */}
      {showSizeError && (
        <FileSizeErrorAlert maxSizeMB={ASSET_CONFIGS[assetType].maxSize} />
      )}

      {/* Image Preview */}
      {selectedImage && (
        <div className="mt-5">
          <Image
            src={selectedImage}
            alt="Preview"
            width={400}
            height={400}
            className="max-w-full h-auto object-contain"
          />
        </div>
      )}
    </div>
  );
}
