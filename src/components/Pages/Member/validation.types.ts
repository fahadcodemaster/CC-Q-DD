
export interface AddNewMemberType {
    employer: string;
    firstName: string;
    lastName: string;
    orgLink: number | '';
    department?: string;
    workEmail: string;
    phone?: string;
    groups: number[];
}

export interface EditMemberType {
    role: string;
    license: string;
    employer: string;
    firstName: string;
    lastName: string;
    orgLink: number | '';
    department?: string;
    workEmail: string;
    phone?: string;
    groups: number[];
}
export interface RequestMemberType {
    employer: string;
    first_name: string;
    last_name: string;
    status: string;
    role: string;
    work_email: string;
}

