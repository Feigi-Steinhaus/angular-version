import { RelatedToProject } from "./RelatedToCode";

export interface Communication {
    communicationId?: Number;
    type?: string;
    date?: Date | string;
    details?: string;
    relatedTo?: RelatedToProject;
    relatedId?: Number;
    name?: string;
}