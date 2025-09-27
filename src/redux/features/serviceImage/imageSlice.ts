import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileItem {
  id: string;
  file_name: string;
  file_url: string;
}

interface ImageState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  displayPictureId: string | null; // Added field for display picture ID
}

const initialState: ImageState = {
  files: [],
  isLoading: false,
  error: null,
  displayPictureId: null, // Initialize displayPictureId to null
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    setDisplayPicture: (state, action: PayloadAction<string | null>) => { // Add setDisplayPicture reducer
      state.displayPictureId = action.payload;
    },
  },
});

export const {
  setLoading,
  setFiles,
  setError,
  addFile,
  removeFile,
  setDisplayPicture // Export the setDisplayPicture action
} = imageSlice.actions;

export default imageSlice.reducer;
