export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    document_type?: string;
    document_number?: string;
    city?: string;
    country?: string;
    created_at?: string;
    updated_at?: string;
    group_id?: string;    
}