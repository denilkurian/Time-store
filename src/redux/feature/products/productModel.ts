export interface ProductModelInterface {
    id?: number;
    category_id?: number;
    created_at?: string; // ISO date string
    description?: string;
    display_picture?: string | null; // Nullable string for image URL
    excerpt?: string;
    minimum_order?: number;
    mrp?: number;
    name?: string;
    status?: "active" | "inactive" | string; // Add other statuses if needed
    sub_category_id?: number | null;
    updated_at?: string; // ISO date string
    user_id?: number;
}

export interface ProductListingInterface {
    id: number;
    name: string;
    description: string;
    excerpt: string;
    images: string[];
    minimum_order: number;
    mrp: number;
    status: string;
    category_id: number;
    sub_category_id: number | null;
    display_picture: string;
    user_id: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
}

export interface UpdateProductResponse {
    productId: string;  // Adjust this based on your response data
    updatedData: any;   // The updated data from the response
}

export interface Category {
    name: string;
    id: number;
    type: string; // "product_categories" or other resource types
    attributes: {
        name: string; // Category name
        parent_id: number | null; // Can be null or a number for parent categories
        status: string; // Status like "active" or "inactive"
        created_at: string; // ISO Date format
        updated_at: string; // ISO Date format
    };
    relationships: any[]; // If relationships are empty, keep as an array
}