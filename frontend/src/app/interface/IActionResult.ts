export class IActionResult<T> {
    success: boolean;
    message: string | Array<string>;
    data: T | Array<T>;
}
