export enum ISearchCondition {
    IN = 'in',
    NOT_IN = 'not in',
}

export class ISearchParams {
    field: string;
    condition: string;
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
