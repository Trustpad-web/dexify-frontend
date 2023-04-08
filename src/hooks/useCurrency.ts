import { useApolloClient } from "@apollo/client";
import { useAppDispatch } from "../store";
import { useEffect } from "react";
import { loadCurrency } from "../store/slices/currency.slice";

export default function useCurrency(id : string) {
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  useEffect(() => {
    if (apolloClient) {
        dispatch(loadCurrency({apolloClient, id}));
    }
  }, [dispatch, apolloClient]);
}
