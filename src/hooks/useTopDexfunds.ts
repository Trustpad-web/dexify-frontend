import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { loadTopDexfunds } from "../store/slices/top_dexfunds.slice";

export default function useTopDexfunds() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadTopDexfunds());
    }, [dispatch])
}