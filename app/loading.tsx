import { ImSpinner2 } from "react-icons/im";

function Loading() {
  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen">
      <ImSpinner2 className="w-12 h-12" />
    </div>
  );
}

export default Loading;
