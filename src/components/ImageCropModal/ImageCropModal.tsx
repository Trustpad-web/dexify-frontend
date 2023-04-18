import { useState, useCallback, useEffect } from "react";
import Cropper, { Point, Area } from "react-easy-crop";
import getCroppedImg from "./cropImage";
import ReactModal from "react-modal";
const customStyles = {
  overlay: {
    background: "#0000005C",
    zIndex: 20,
  },
  content: {
    minWidth: "300px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
  },
};

type Props = {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCrop: (cropImage: string) => void;
  aspect?: number;
};

const ImageCropModal = ({
  image,
  isOpen,
  onClose,
  onCrop,
  aspect: aspectProp,
}: Props) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(0.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    if (aspectProp) {
      setAspect(aspectProp);
    } else {
      setAspect(1.5);
      setTimeout(() => {
        setAspect(1.7);
      }, 500);
    }
  }, [image, aspectProp]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const cropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels as Area
      );
      onCrop(croppedImage as string);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="w-full min-w-[300px] min-h-[250px] h-full overflow-hidden relative [&_*]:transition-none">
        <Cropper
          image={image}
          crop={crop}
          minZoom={0.5}
          zoom={zoom}
          aspect={aspect}
          // cropSize={{ width: 200, height: 200 }}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="flex justify-between my-6">
        <div className="text-black dark:text-white">Zoom: </div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="outline-none w-1/2"
        />
      </div>

      <div className="mt-4 flex gap-6">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 dark:bg-red-600 px-4 py-2 text-sm font-medium text-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-500 dark:hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ml-auto"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-600 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-500 dark:hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={cropImage}
        >
          Crop
        </button>
      </div>
    </ReactModal>
  );
};

export default ImageCropModal;
