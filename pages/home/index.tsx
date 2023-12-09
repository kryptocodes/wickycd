import { useUserStore } from "@/store/user";
import { useEffect } from "react";
import useStore from "@/store/useStore";

import Intro from "../../components/home/intro";
import Main from "../../components/home/main";

export default function Home() {
  const token = useStore(useUserStore, (state) => state.token);
  return <>{token && token?.length > 0 ? <Main /> : <Intro />}</>;
}
