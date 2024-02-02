import React from 'react';
import { Container, ThemeButton, ToggleViewButton } from './styles.css';
import CompanySelect from './CompanySelect';
import { getCompanyData } from '../../services/cariclub';
import { ReportingAPI } from '../../../types';

interface Props {
    isAuth: (userAuthStatus: string, threshold: string) => boolean;
    userAuthStatus: string;
    handleToggleTheme: () => void;
    setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
    companyId: string | null;
    setCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
    theme: string;
    viewMode: number;
    setViewMode: React.Dispatch<React.SetStateAction<number | 0>>;
    appState: ReportingAPI.PrimaryCompanyData | undefined;
    setIsLoading: (loading: boolean) => void;
}

function NavBar(props: Props) {
    const { isAuth, userAuthStatus } = props;
    const handleToggleView = async () => {
        if (props.appState) {
            let viewMode = props.viewMode == 0 ? 1 : 0;
            let company_members: any = await getCompanyData(
                props.appState.company.org_key,
                props.appState.company.org_name,
                '',
                '',
                '',
                undefined,
                undefined,
                viewMode,
            );
            props.setApplicationState(company_members);
            props.setViewMode(viewMode);
        }
    };
    return (
        <Container>
            <ThemeButton onClick={props.handleToggleTheme}>
                {props.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </ThemeButton>
            {isAuth(userAuthStatus, 'authenticated::admin') && (
                <ToggleViewButton onClick={handleToggleView}>
                    {props.viewMode == 0 ? 'Viewing as CariClub' : 'Viewing as Client'}
                </ToggleViewButton>
            )}
            {isAuth(userAuthStatus, 'authenticated::admin') && (
                <CompanySelect
                    setApplicationState={props.setApplicationState}
                    companyId={props.companyId}
                    isAuth={isAuth}
                    setIsLoading={props.setIsLoading}
                    viewMode={props.viewMode}
                    userAuthStatus={userAuthStatus}
                    setCompanyId={props.setCompanyId}
                />
            )}
        </Container>
    );
}

export default NavBar;
