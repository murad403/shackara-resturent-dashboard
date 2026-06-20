"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";

interface ReduxWrapperProps {
  children: React.ReactNode;
}

const ReduxWrapper = ({ children }: ReduxWrapperProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxWrapper