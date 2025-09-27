// Main API Response Interface for Service
export interface ServiceApiResponse {
    data: Service[];  // Data now refers to a list of services
    meta: Meta;  
    message: string;
    status: string;
}

export interface Meta {
    last_page: number;  // Add other relevant pagination fields here, like total, per_page, etc.
    total?: number;
    per_page?: number;
    current_page?: number;
}
// Service Interface
export interface Service {
    id: number;
    type: string;
    attributes: ServiceAttributes;
    links: Links;
    relationships: ServiceRelationships;
}

// Service Attributes Interface
export interface ServiceAttributes {
    id: number;
    user_id: number;
    service_image: string | null;  // Renamed from display_picture to service_image
    name: string;
    description: string;
    excerpt?: string | null;
    category_id: number;
    sub_category_id: number;
    cost: number | null;  
    duration: number | null;  
    status: status;
    created_at: Date;
    updated_at: Date;
    mrp?: number; 
    minimum_order?: number;
    service_unit?:number; 
}

// Links Interface
export interface Links {
    self: string;
}

// Service Relationships Interface
export interface ServiceRelationships {
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
