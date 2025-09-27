import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Document {
  id: string;
  file_name: string;
  file_url: string;
}

interface DocumentsState {
  documents: Document[]; // Ensures documents is always an array
  message: string | null;
}

const initialState: DocumentsState = {
  documents: [], // Initialize documents as an empty array
  message: null, // Initialize message as null
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocuments(state, action: PayloadAction<Document[]>) {
      // Always ensure the payload is an array
      state.documents = Array.isArray(action.payload) ? action.payload : [];
    },
    removeDocument(state, action: PayloadAction<string>) {
      // Remove the document with the matching ID
      state.documents = state.documents.filter((doc) => doc.id !== action.payload);
    },
    setMessage(state, action: PayloadAction<string | null>) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const { setDocuments, removeDocument, setMessage, clearMessage } =
  documentsSlice.actions;

export default documentsSlice.reducer;
