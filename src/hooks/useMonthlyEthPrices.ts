import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { loadMonthlyEthPrices } from "../store/slices/ethPrices.slice";

export default function useMonthlyEthPrices() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadMonthlyEthPrices());
    }, [dispatch]);
}