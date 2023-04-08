import { useApolloClient } from "@apollo/client";
import { useAppDispatch } from "../store";
import { useEffect } from "react";
import { loadAllAssets } from "../store/slices/assets.slice";

export default function useAssets() {
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  useEffect(() => {
    if (apolloClient) {
        dispatch(loadAllAssets(apolloClient));
    }
  }, [dispatch, apolloClient]);
}
