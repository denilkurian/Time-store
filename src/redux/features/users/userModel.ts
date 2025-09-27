export interface UserApiResponse {
    status: string;
    message: string;
    data: UserData[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
export interface SingleUserApiResponse {
    status: string;
    message: string;
    data: UserData;
    links: PaginationLinks;
    meta: PaginationMeta;
}

interface UserData {
    id: number;
    attributes: UserAttributes;
}

export interface UserAttributes {
    first_name: string;
    last_name: string | null;
    email: string;
    phone: string;
    password: string;
    type: "admin" | "vendor" | "customer";
    status: "verified" | "unverified" | "active" | "Blocked" | "blocked";
    created_at: string
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
