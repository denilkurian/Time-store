export interface InitialState {
    data: DashboardApiResponse | null;
    loading: boolean | true;
    error: string | null;
    successMessage: string | null;
}

export interface DashboardApiResponse {
    status: string;
    message: string;
    data: {
        attributes: Data
    };
}

export interface Data {
    users: number;
    active_users: number;
    products: number;
    active_products: number;
    services: number;
    active_services: number;
    approvals: number;
    approved_approvals: number;
    awaiting_approvals: number;
    last_month_users: number[];
    last_week_users: number[];
}
