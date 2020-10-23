import {Role} from "./role-schema";

export class Roles {
    arraySize: number;
    nextIndex: number;
    hasMore: boolean;
    roles: Role[] = [];
}
