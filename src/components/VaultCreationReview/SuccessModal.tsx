import { Button } from "flowbite-react";
import { HiCheck, HiCheckCircle } from "react-icons/hi";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";

const customStyles = {
  overlay: {
    background: "#0000005C",
    zIndex: 20,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
  },
};

export default function SuccessModal({
  show,
  onClose,
  fundAddress,
}: {
  show: boolean;
  onClose: () => void;
  fundAddress: string;
}) {
  const navigate = useNavigate();
  return (
    <ReactModal
      isOpen={show}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="flex flex-col gap-5 items-center">
        <div className="bg-[#6CE67C] rounded-[50%] w-[80px] h-[80px] flex justify-center items-center">
          <HiCheck color="white" size={30}/>
        </div>
        <h4 className="text-title text-[20px] md:text-[24px] font-bold">
          Contratulations!
        </h4>
        <span className="">Your fund is live</span>

        <Button
          color={"white"}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
          onClick={() => navigate(`/fund/${fundAddress}`)}
        >
          Go to fund
        </Button>
      </div>
    </ReactModal>
  );
}
