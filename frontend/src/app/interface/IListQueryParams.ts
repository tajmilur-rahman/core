export enum ISearchCondition {
    'in',
    'not in'
}

export class ISearchParams {
    field: string;
    condition: 'in' | 'not in';
    value: any[];
}

export class ISortParams {
    field: string;
    direction: string;
}

export class IListQueryParams {
    search?: ISearchParams[];
    sort?: ISortParams;
    limit?: number;
    offset?: number;
}
