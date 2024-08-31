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

export type SlaRatingEntry = {
    id: number;
    sla: SlaEntry;
    rated_by: string;
    rating: string;
    reason: string;
    updated_at: string;
    created_at: string;
}