import { useContext } from "react";
import { ProUserContext } from "../pages/home";

interface Props {
  children: React.ReactNode;
}

const LockComponent = ({ children }) => {
  const { isProUser } = useContext(ProUserContext);

  return <div className={`${!isProUser ? "opacity-50" : ""}`}>{children}</div>;
};

export default LockComponent;
