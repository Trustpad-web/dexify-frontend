import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { loadAllDexfunds, loadFundMeta } from "../store/slices/all_dexfunds.slice";

export default function useAllDexfunds() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadAllDexfunds());
        dispatch(loadFundMeta());
    }, [])
}