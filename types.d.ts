import { DataTypeAbstract, ModelAttributeColumnOptions, ColumnOptions } from 'sequelize';

type ModelAttributes = ColumnOptions & ModelAttributeColumnOptions;

declare global {
    type SequelizeAttributes<T extends { [key: string]: any }> = {
        [P in keyof T]: string | DataTypeAbstract | ModelAttributes;
    };

    type ISOstring = string;

    type FixMe = any;

    interface GenericFunctionResponse {
        status: 'success' | 'fail';
        message: null | string;
        response: any;
    }
}

export namespace Copper {
    export interface Address {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    }

    export interface Social {
        url: string;
        category: 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'instagram';
    }

    export interface CompanyProfileUrl {
        custom_field_definition_id: 436401;
        value: string;
    }
    export interface CustomFieldGeneric {
        custom_field_definition_id: number;
        value: any;
    }

    export interface GroupObj {
        id: number;
        name: string;
        type_id: number;
        type_name: string;
        type_type: number;
        type_is_primary: number;
        status?: number;
        desc?: string;
    }

    export type CustomField = CustomFieldGeneric | CompanyProfileUrl;
    export interface Company {
        id: number;
        name: string;
        address: Address;
        assignee_id: null;
        contact_type_id: number;
        details: string;
        email_domain: string;
        phone_numbers: [];
        socials: Social[];
        tags: string[];
        websites: Social[];
        custom_fields: CustomField[];
        interaction_count: number;
        date_created_unix: number;
        date_modified_unix: number;
        date_created: ISOstring;
        date_modified: ISOstring;
    }

    export interface ApplicationTask {
        id: number;
        name: string | null;
        related_resource: RelatedResource;
        assignee_id: number;
        due_date: string | null;
        reminder_date: string | null;
        completed_date: string | null;
        priority: string;
        status: 'Open' | 'Closed';
        details: string | null;
        tags: string[];
        custom_fields: CustomFieldGeneric[];
        date_created: ISOstring | null;
        date_modified: ISOstring | null;
        custom_activity_type_id: number;
        date_created_unix: number;
        date_modified_unix: number;
    }

    export interface Task {
        id: number;
        name: string | null;
        related_resource: RelatedResource;
        assignee_id: number;
        due_date: string | null;
        reminder_date: string | null;
        completed_date: string | null;
        priority: string;
        status: 'Open' | 'Closed';
        details: string | null;
        tags: string[];
        custom_fields: CustomFieldGeneric[];
        date_created: ISOstring | null;
        date_modified: ISOstring | null;
        custom_activity_type_id: number;
        date_created_unix: number;
        date_modified_unix: number;
    }

    export interface Stage {
        id: number;
        name: string;
        pipeline_id: number;
        win_probability: number;
    }
    export interface MemberOpportunity {
        id: number;
        name: string;
        assignee_id: number;
        close_date: Date | null;
        company_id: number;
        company_name: string;
        customer_source_id: number | null;
        details: string | null;
        loss_reason_id: number | null;
        pipeline_id: number;
        pipeline_stage_id: number;
        primary_contact_id: number;
        priority: string;
        status: string;
        tags?: string[];
        interaction_count: number;
        monetary_unit: number | null;
        monetary_value: number | null;
        converted_unit: number | null;
        converted_value: number | null;
        win_probability: number;
        date_stage_changed: Date;
        date_last_contacted: Date;
        leads_converted_from?: [];
        date_lead_created: Date | null;
        date_created: ISOstring;
        date_modified: ISOstring;
        custom_fields: CustomField[];
        date_stage_changed_unix: number;
        date_last_contacted_unix: number;
        date_lead_created_unix: Date | null;
        date_created_unix: number;
        date_modified_unix: number;
    }

    //FIXME: There is another shape of activity, need to find and define
    //FIXME: modify copper function to map TaskActivity date_created to ISO
    export interface TaskActivity {
        id: number;
        parent: ActivityParent;
        type: UserActivity;
        user_id: number;
        details: string;
        activity_date: number;
        old_value: null;
        new_value: null;
        date_created: ISOstring;
        date_modified: ISOstring;
        date_created_unix: number;
        date_modified_unix: number;
        application_id?: number;
    }

    export interface UserActivity {
        id: 0;
        category: 'user';
    }

    export interface ActivityParent {
        id: number;
        type: 'task' | 'opportunity' | 'project' | 'person' | 'company';
    }

    export interface RelatedResource {
        id: number;
        type: string;
    }
}

export namespace ReportingDB {
    export interface Members {
        key: string;
        user_id: number;
        first_name: string;
        last_name: string;
        profile_url: string | null;
        title: string | null;
        last_login: ISOstring | null;
        application_count: number | 0;
        department_name: string | null;
        department_key: string | null;
        pipeline_statuses: Array<any> | [];
        engagement_status: number | null;
        priviledge_type: number | null;
        priviledge_term: number | null;
        city: string | null;
        linkedin_url: string | null;
        facebook_url: string | null;
        member_type: number;
        org_key: string;
        work_email: string | null;
        work_phone: string | null;
        cariclub_role: number | null;
        candidate_license: number | null;
        activated_date: string | null;
        // interests: string | null;
        // fan_of: string | null;
        // company_id: number;
    }

    export interface SearchMembers {
        id?: number;
        company_id?: number;
        crm_opportunity_id?: number;
        crm_project_id?: number;
        cc_user_id?: number;
    }

    export interface SearchNonprofits {
        id?: number;
    }

    export interface Roles {
        id: number;
        name: string;
        cognito_username: string;
        created_at: ISOstring | null;
        updated_at: ISOstring | null;
    }

    export interface SearchUsers {
        email?: string;
        name?: string;
    }

    export interface Users {
        id?: number;
        crm_opportunity_id?: number;
        cc_user_id?: number;
        name: string;
        email: string;
        cognito_username: string;
        current_title?: string;
        role_id: number;
        company_id: number;
        crm_created_at?: ISOstring | null;
        crm_updated_at?: ISOstring | null;
        cc_created_at?: ISOstring | null;
        cc_updated_at?: ISOstring | null;
        created_at: ISOstring | null;
        updated_at: ISOstring | null;
    }

    export interface Companies {
        org_key: string;
        org_name: string;
    }

    export interface Nonprofits {
        id?: number;
        crm_company_id: number | null;
        cc_org_id: number;
        name: string;
        crm_created_at: ISOstring | null;
        crm_updated_at: ISOstring | null;
        cc_created_at: ISOstring | null;
        cc_updated_at: ISOstring | null;
    }

    export interface Applications {
        id?: number;
        crm_task_id: number | null;
        cc_opportunity_application_id: number | null;
        cc_opportunity_application_guid: string | null;
        position: string;
        subtype: string;
        type: string;
        member_id: number;
        nonprofit_id: number | null;
        nonprofit_name: string;
        nonprofit_logo: string;
        nonprofit_guid: string;
        crm_created_at: ISOstring | null;
        cc_created_at: ISOstring | null;
        ats_stage: string;
        ats_step: number;
        ats_id: number;
        pipelinestatus_id: number;
    }

    export interface ApplicationsStatusLogs {
        id?: number;
        status: string | null;
        status_id: number;
        status_step: number;
        note: string | null;
        is_private?: boolean;
        application_id: number;
        cc_created_at: ISOstring | null;
        cc_updated_at: ISOstring | null;
        crm_created_at: ISOstring | null;
        created_at?: ISOstring | null;
    }

    export interface MembersStatusLogs {
        id?: number;
        status: string;
        is_private: boolean;
        note: string;
        member_id: number;
        cc_created_at: ISOstring | null;
        crm_created_at: ISOstring | null;
        created_at?: ISOstring;
    }
}

export namespace CariClub {
    export interface PrimaryCompanyDetails {
        cc_org_id: number;
        name: string;
        cc_created_at: ISOstring;
        cc_updated_at: ISOstring;
    }

    //FIXME: create a type to represent dates as strings
    export interface PrimaryMemberDetails {
        cc_user_id: number;
        name: string;
        profile_url: string | null;
        last_login: string | null;
        cc_created_at: ISOstring | null;
        cc_updated_at: ISOstring | null;
    }

    export interface MemberInterests {
        interest: Array<
            | 'Recreation'
            | 'Education'
            | 'Health'
            | 'Culture'
            | 'Community'
            | 'Environment'
            | 'Advocacy'
            | 'Aid'
            | 'STEM'
        >;
    }

    export interface NonProfitDetails {
        cc_org_id: number;
        name: string;
        cc_created_at: ISOstring | null;
        cc_updated_at: ISOstring | null;
    }

    export interface ApplicationDetails {
        cc_opportunity_application_id: number;
        cc_opportunity_application_guid: string;
        position: string;
        subtype: string;
        type: string;
        nonprofit_cc_org_id: number;
        nonprofit_name: string;
        nonprofit_cc_org_parent_guid: string;
        nonprofit_cc_created_at: ISOstring;
        nonprofit_cc_updated_at: ISOstring;
        cc_created_at: ISOstring;
    }

    export interface ApplicationHistory {
        note: string | null;
        cc_created_at: ISOstring | null;
        status: string | null;
        is_private: boolean;
        application_id: number;
    }
}

export namespace ReportingAPI {
    export interface ResponseGeneric {
        statusCode: number;
        headers: FixMe;
        body: string;
        isBase64Encoded: boolean;
    }

    export interface MemberInsight extends ReportingDB.Members {
        row_no: number | null;
        member_history: ReportingDB.MembersStatusLogs[];
        status: MemberStatus;
        fan_of: Array<number>;
        interests: MemberInterests;
        applications: ApplicationInsight[];
        state: string;
        pp_status: string;
        pp_progress: string | null;
        pp_id: number;
        pp_obj: any;
        ats_stage: any;
        organization: string;
        groups: string;
        pp_cohorts: GroupObj[] | null;
        userpipeline_status: number;
    }

    export interface ApplicationInsight extends ReportingDB.Applications {
        application_history: ReportingDB.ApplicationsStatusLogs[];
    }

    export interface CompanyInsight extends ReportingDB.Companies {
        org_key: string;
        org_name: string;
        company_interests: any;
        company_statuses: CompanyMemberStatuses;
    }

    export interface PrimaryCompanyData {
        company: CompanyInsight;
        members: MemberInsight[];
        nonprofits: ReportingDB.Nonprofits[];
    }

    //TODO: figure out how to make this key of type MemberStatus where a for..in loop can allow it.
    export interface CompanyMemberStatuses {
        [key: string]: Array<string>;
    }

    export type MemberStatus = 'Applied' | 'Matching' | 'Deferral' | 'Inactive' | 'Placed' | 'Mystery';
}

export namespace Zipper {
    export interface CopperMember {
        opportunity_id: number;
        name: string;
        company_id: number;
        company_name: string;
        pipeline_id: number;
        pipeline_stage_id: number;
        people_id: number;
        win_probability: number;
        date_created: ISOString;
        date_modified: ISOString;
        custom_fields: Copper.CustomField[];
        project_id: number;
        application_tasks?: CopperApplication[]; //TODO: make this requried
    }

    export interface CopperApplication {
        task_id: number;
        nonprofit_name: string;
        date_created: ISOstring;
        date_modified: ISOString;
        activity_type_id: number;
        custom_fields: Copper.CustomFieldGeneric[];
        task_activities?: CopperApplicationActivity[]; //TODO: make this required
    }

    export interface CopperApplicationActivity {
        // TODO: this was not populated because current state is to get records from insights_db before getting copper application
        // activity. in order to fetch all data from copper up front, that order of operations would need to change in such a way
        // where data could be reasonably accessed from this interface. once those order of operations change, we can include this
        // interface
    }
}
