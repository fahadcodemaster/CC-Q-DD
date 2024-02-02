import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getCompanies, getCompanyData } from '../../../services/cariclub';
import { ReportingAPI } from '../../../../types';
import { Container } from './styles.css';
// import { getPrimaryCompanyData, getPrimaryCompanyDataP } from '../../../services/reporting'

interface Company {
    org_key: string;
    org_name: string;
    org_logo: string;
}

interface Props {
    setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
    companyId: string | null;
    companies: Company[];
    setCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
    isAuth: (userAuthStatus: string, threshold: string) => boolean;
    userAuthStatus: string;
    viewMode: number;
    setActive(active: string): void;
    setCompanyLogo(logo: string): void;
    setIsLoading: (loading: boolean) => void;
}

function CompanySelect(props: Props) {
    // const [companies, setCompanies] = useState<Company[]>([])
    let history = useHistory();

    async function handleCompanyChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const org_key: string = event.target.value;
        let company_members: any;
        let selected_company: Company = props.companies.filter((company: Company) => company.org_key == org_key)[0];
        localStorage.setItem('company_id', selected_company.org_key);
        window.location.replace('/');
        if (props.isAuth(props.userAuthStatus, 'authenticated::admin')) {
            company_members = await getCompanyData(
                selected_company.org_key,
                selected_company.org_name,
                '',
                '',
                '',
                undefined,
                undefined,
                props.viewMode,
            );
        } else {
            company_members = await getCompanyData(
                selected_company.org_key,
                selected_company.org_name,
                '',
                '',
                '',
                undefined,
                undefined,
                props.viewMode,
            );
        }
        props.setApplicationState(company_members);
        props.setCompanyId(selected_company.org_key);
        props.setCompanyLogo(selected_company.org_logo);
        props.setActive('dashboard');
        localStorage.removeItem('pipeline_location');
        localStorage.removeItem('pipeline_term');
        localStorage.removeItem('pipeline_type');
        localStorage.removeItem('pipeline_search');
        localStorage.removeItem('engagement_location');
        localStorage.removeItem('engagement_term');
        localStorage.removeItem('engagement_search');
        localStorage.removeItem('engagement_status');
        localStorage.setItem('company_id', org_key);
        history.push('/');
    }

    // useEffect(() => {
    //     console.log("company id", props.companyId);
    //     const fetchCompanies = async () => {
    //         const companies = await getCompanies()
    //         console.log(companies);
    //         setCompanies(companies)
    //     }

    //     fetchCompanies()
    // }, [])

    return (
        <Container>
            {props.companies && props.companies.length > 0 && props.companyId && (
                <select value={props.companyId} onChange={handleCompanyChange}>
                    {props.companies.map((company, idx) => {
                        return (
                            <option key={`company-select-${idx}`} value={company.org_key}>
                                {company.org_name}
                            </option>
                        );
                    })}
                </select>
            )}
        </Container>
    );
}

export default CompanySelect;
