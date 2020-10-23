import { SubOrdinateInformation } from "./SubOrdinateInformation";

export class GroupInformation {
    groupId: string;
    startIndex: number;
    endIndex: number;
    subOrdinateList: SubOrdinateInformation[] = [];
}