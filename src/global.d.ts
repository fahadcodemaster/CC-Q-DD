import { ReportingAPI, ReportingDB } from "../types";

//FIXME: wasnt able to find the exact cognito results within amplify library, so this one is a custom representation
//of the types to be expected. 
export namespace AWSAmplify {
    export interface CognitoUser {
        username: string;
        pool: CognitoUserPool;

        Session: string;
        client: CognitoUserClient;
        signInUserSession: string | null;
        authenticationFlowType: string;
        storage: any;
        keyPrefix: string;
        userDataKey: string;
        challengeName: "NEW_PASSWORD_REQUIRED" | string;
        challengeParam: CognitoUserChallengeParam;
    }

    export interface CognitoUserPool {
        userPoolId: string;
        clientId: string;
        client: CognitoUserPoolClient;
        advancedSecurityDataCollectionFlag: boolean;
        storage: CognitoUserPoolClientStorage;
    }

    export interface CognitoUserPoolClient {
        endpoint: string;
        fetchOptions: any;
    }

    export interface CognitoUserPoolClientStorage {
        [string]: string;
        [string]: string;
        [string]: string;
    }

    interface CognitoUserClient {
        endpoint: string;
        fetchOptions: any;
    }

    export interface CognitoUserChallengeParam {
        userAttributes: any;
        requiredAttributes: Array<string>;
    }

}

export namespace InsightsApp {
    export interface MemberPage extends ReportingAPI.MemberInsight {
        fan_of: ReportingDB.Nonprofits[];
        applications: ApplicationDetails[];
    }

    export interface ApplicationDetails extends ReportingAPI.ApplicationInsight {
        nonprofit: ReportingDB.Nonprofits;
    }

    export type Interests = "Advocacy" | "Aid" | "Community" | "Culture" | "Education" | "Environment" | "Health" | "Recreation" | "STEM"
}

