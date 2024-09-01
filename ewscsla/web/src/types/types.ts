export type Department = {
    id: number;
    name: string;
}

export type SlaEntry = {
    id: number;
    department: Department;
    service_description: string;
    customer_responsibility: string;
    service_level: string;
    date: string;
    updated_at: Date;
    created_at: Date;
    added_by?: string;
}

export type SlaImprovementPlanAction = {
    id: number;
    improvement_action: string;
    status: number;
    rating: number;
    due_date: string;
}

export type SlaCustomerStatus = {
    id: number;
    improvement_plan: number;
    status: number;
}


export type SlaRatingEntry = {
    id: number;
    sla: SlaEntry;
    rated_by: string;
    rating: string;
    reason: string;
    updated_at: string;
    created_at: string;
    improvement_action_plan: SlaImprovementPlanAction | null;
    customer_feedback_status: SlaCustomerStatus | null;
}

export type DashboardData = {
    users: number;
    sla_entries: number;
    ratings: number;
    action_plans: number;
}

export type UserProfile = {
    id: number;
    last_login: string;
    username: string;
    get_full_name: string | null;
    initials: string;
    email: string | null;
    department: Department;
}