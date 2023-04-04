import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
  value: "dark" | "light";
}

const initialState: ThemeState = {
  value: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.value = action.payload;
      storeLocalStorage(state.value);
    },
    toggleTheme: (state) => {
      if (state.value === "dark") {
        state.value = "light";
      } else {
        state.value = "dark";
      }
      storeLocalStorage(state.value);
    },
  },
});

const storeLocalStorage = (theme: "light" | "dark") => {
  document
    .getElementsByTagName("body")
    .item(0)
    ?.classList.remove("light", "dark");
  document.getElementsByTagName("body")[0].classList.add(theme);

  localStorage.setItem("dexify-finance-theme", theme);
};

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
