import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getCompanies, getCompanyData } from '../../../services/cariclub';
import { ReportingAPI } from '../../../../types';
import { Container } from './styles.css';
// import { getPrimaryCompanyData, getPrimaryCompanyDataP } from '../../../services/reporting'

interface Props {
    setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
    companyId: string | null;
    setCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
    isAuth: (userAuthStatus: string, threshold: string) => boolean;
    userAuthStatus: string;
    viewMode: number;
    setIsLoading: (loading: boolean) => void;
}

interface Company {
    org_key: string;
    org_name: string;
}

function CompanySelect(props: Props) {
    const [companies, setCompanies] = useState<Company[]>([]);
    let history = useHistory();

    async function handleCompanyChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const org_key: string = event.target.value;
        let company_members: any;
        let selected_company: Company = companies.filter((company: Company) => company.org_key == org_key)[0];
        props.setIsLoading(true);
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
        props.setApplicationState(company_members);
        props.setCompanyId(selected_company.org_key);
        props.setIsLoading(false);
        history.push('/');
    }

    useEffect(() => {
        console.log('company id', props.companyId);
        const fetchCompanies = async () => {
            const companies = await getCompanies();
            setCompanies(companies);
        };

        fetchCompanies();
    }, []);

    return (
        <Container>
            {props.companyId && (
                <select value={props.companyId} onChange={handleCompanyChange}>
                    {companies.map((company, idx) => {
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
