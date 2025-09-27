export interface InitialState {
    response: ApiResponse | null;
    settingsValue: SettingsItem[];
    singleValue: SettingsItem | null;
    loading: boolean;
    error: null | string;
    successMessage: "";
}

export interface ApiResponse {
    status: string; // Status of the response (e.g., "success")
    message: string; // Message related to the response
    data: SettingsItem[]; // Array of configuration items
}

export interface SingleApiResponse {
    status: string; // Status of the response (e.g., "success")
    message: string; // Message related to the response
    data: SettingsItem;
}

interface SettingsItem {
    id: number; // Unique identifier for the configuration item
    name: string; // Name of the configuration parameter
    value: string; // Value associated with the configuration parameter
    user_type: string | null; // User type (if applicable, otherwise null)
}
