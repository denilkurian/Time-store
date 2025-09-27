// Main API Response Interface
export interface ProductApiResponse {
    data: Product[];
    message: string;
    status: string;
    meta: PaginationMeta;
}

// Product Interface
export interface Product {
    id: number;
    type: string;
    attributes: ProductAttributes;
    links: Links;
    relationships: ProductRelationships;
}

// Product Attributes Interface
export interface ProductAttributes {
    id: number;
    user_id: number;
    display_picture: string | null;
    name: string;
    excerpt: string;
    category_id: number;
    sub_category_id: number;
    mrp: number;
    minimum_order: number;
    status: status;
    created_at: Date;
    updated_at: Date;
    actions?: string;
    no: number;
    description: string;
}

// Links Interface
export interface Links {
    self: string;
}

// Relationships Interface
export interface ProductRelationships {
    category: Relationship;
    sub_category: Relationship;
    user: Relationship;
}

// Relationship Data Interface
export interface Relationship {
    data: {
        id: number;
        type: string;
    };
    links?: Links;
}
// Optional status enum to define status
export type status = 'active' | 'inactive' | 'pending';

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}
