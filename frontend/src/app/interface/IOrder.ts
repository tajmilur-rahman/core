export class IOrder {
    id: number;
    customerId: number;
    customerName?: string;
    title: string;
    description: string;
    location?: string;
    schedule?: string;
    technicianId?: number;
    technicianName?: string;
}
