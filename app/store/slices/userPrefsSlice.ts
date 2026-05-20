import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'system';
type TableDensity = 'compact' | 'default' | 'comfortable';

interface UserPrefsState {
  theme: Theme;
  tableDensity: TableDensity;
}

const initialState: UserPrefsState = {
  theme: 'system',
  tableDensity: 'default',
};

const userPrefsSlice = createSlice({
  name: 'userPrefs',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setTableDensity(state, action: PayloadAction<TableDensity>) {
      state.tableDensity = action.payload;
    },
  },
});

export const { setTheme, setTableDensity } = userPrefsSlice.actions;

export default userPrefsSlice.reducer;
