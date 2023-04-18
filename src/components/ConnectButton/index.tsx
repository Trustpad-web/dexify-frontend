import { useConnectWallet } from "@web3-onboard/react";
import { Button } from "flowbite-react";

const ConnectButton = () => {
  const [{ connecting }, connect ] = useConnectWallet();

  const handleConnect = async () => {
    await connect();
  };

  return (
    <Button color="purple" onClick={handleConnect} disabled={connecting}>
      Connect
    </Button>
  );
};

export default ConnectButton;
