import { ProductListingInterface } from "../products/productModel";

export interface InitialState {
    productApiResponse: ApiResponse | null,
    productListAttributes: ServiceAttributes[] | null,
    productDetails: ProductListingInterface[],
    productDetailsById: null,
    allProductDetails: [],
    serviceListAttributes: ServiceAttributes[],
    singleDetails: SingleApiResponse | null,
    serviceResponse: ApiResponse | null,
    loading: boolean | true,
    error: null,
    pageType: string,
    successMessage: "",
}
export interface Service {
    type: string;
    id: number;
    attributes: ServiceAttributes,
    links: {
        self: string;
    };
    relationships: {
        category: {
            type: string;
            data: {
                id: number;
            };
        };
        sub_category: {
            type: string;
            data: {
                id: number;
            };
        };
        user: {
            type: string;
            data: {
                id: number;
            };
        };
        images: ServiceImageInterface[]
    };
    meta: PaginationMeta
}

export interface ServiceAttributes {
    id: number;
    user_id: number;
    display_picture: string | null | number;
    name: string;
    excerpt: string;
    description: string;
    category_id: number;
    sub_category_id: number;
    mrp: number;
    minimum_order: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface productApiResponse {
    status: string;
    message: string;
    data: Service[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export interface ApiResponse {
    status: string;
    message: string;
    data: Service[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
export interface SingleApiResponse {
    status: string;
    message: string;
    data: Service;
    links: PaginationLinks;
}

export interface ServiceImageInterface {
    type: string,
    id: number,
    attributes: ServiceImageAttributes,
    links: {
        self: string
    },
}

export interface ServiceImageAttributes {
    service_id: number;
    file_name: string;
    file_path: string;
    description: string;
    created_at: string;
    updated_at: string;
}
