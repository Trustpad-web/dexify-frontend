import { useContext } from "react";
import items from "./data";
import { NewVaultContext } from "../../pages/CreateVault";
import { HiCheck } from "react-icons/hi";

export default function VaultCreationSteps() {
  const { currentStep } = useContext(NewVaultContext);
  return (
    <div className="w-full py-6 bg-white rounded-[12px] shadow-md">
      <div className="flex">
        {items.map((item, index) => (
          <div className="flex-1" key={`vault-creation-steps-${index}`}>
            <div className="relative mb-2">
              {index !== 0 && (
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className={
                        "w-0 py-[3px]" +
                        (index <= currentStep ? " bg-primary" : "")
                      }
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              )}

              <div
                className={
                  "w-10 h-10 mx-auto rounded-full text-lg flex items-center" +
                  (index <= currentStep
                    ? " bg-primary text-white"
                    : " border-2 bg-white text-description")
                }
              >
                <span className="text-center w-full flex items-center justify-center">
                  {index < currentStep ? <HiCheck /> : index + 1}
                </span>
              </div>
            </div>

            <div
              className={
                "text-center text-[10px] md:text-[12px] font-bold " +
                (index === currentStep ? " text-title" : "text-description")
              }
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
