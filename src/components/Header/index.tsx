import React, { useEffect, useState } from 'react';
import {
    HeaderContainer,
    LogoContainer,
    Menu,
    ThemeButton,
    ToggleViewButton,
    PublishUpdatesButton,
    ButtonDropdown,
    DownloadData,
    ButtonDropdownContent,
    Overlay
} from './styles.css';
import { ReactComponent as LogoQ } from '../../assets/Qlogo.svg';
import { ReactComponent as Download } from '../../assets/download.svg';
import CompanySelect from './CompanySelect';
import MemberSearch from './MemberSearch';
import UploadNotes from './UploadNotes';
import { getCompanyData, logoutAPI, updateGoogleSheet, getMembersForExport } from '../../services/cariclub';
import { ReportingAPI } from '../../../types';
import { useHistory } from 'react-router-dom';
import { InsightsApp } from 'global';
import { DownloadBtn } from 'components/Pages/Engagement/styles.css';

interface Company {
    org_key: string;
    org_name: string;
    org_logo: string;
}

interface Props {
    setActive(active: string): void;
    isAuth: (userAuthStatus: string, threshold: string) => boolean;
    userAuthStatus: string;
    handleToggleTheme: () => void;
    setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
    companies: Company[];
    companyId: string | null;
    setCompanyId: React.Dispatch<React.SetStateAction<string | null>>;
    theme: string;
    viewMode: number;
    setViewMode: React.Dispatch<React.SetStateAction<number | 0>>;
    appState: ReportingAPI.PrimaryCompanyData | undefined;
    setCompanyLogo(logo: string): void;
    setIsLoading: (loading: boolean) => void;
}

const Header = (props: Props) => {
    const { isAuth, userAuthStatus } = props;
    const history = useHistory();

    const [toggleExpand, setToggleExpand] = useState(false)

    const cc_token: any = localStorage.getItem('cc_token');
    let _cc_token = null;
    if (cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    }

    const [isUpdatingGoogleSheet, setIsUpdatingGoogleSheet] = useState(false);

    const handleToggleView = async () => {
        if (props.appState) {
            let viewMode = props.viewMode == 0 ? 1 : 0;
            // let company_members:any = await getCompanyData(props.appState.company.org_key, props.appState.company.org_name, '', '', '', undefined, undefined, viewMode)
            // props.setApplicationState(company_members);
            localStorage.setItem('viewMode', `${viewMode}`);
            window.location.reload();
            props.setViewMode(viewMode);
        }
    };

    const handleGoogleSheetUpdate = async () => {
        if (isUpdatingGoogleSheet) return;
        setIsUpdatingGoogleSheet(true);
        await updateGoogleSheet();
        setIsUpdatingGoogleSheet(false);
        setToggleExpand(false);
    };

    const logout = async () => {
        await logoutAPI();
        localStorage.removeItem('cc_token');
        history.push('/login');
    };

    const exportMembers = async () => {
      if (props.appState && props.appState.company) {
        await getMembersForExport(
          props.appState.company.org_key
        );
        setToggleExpand(false);
      }
    };

    return (
        <HeaderContainer isClient={props.viewMode === 0}>
            {toggleExpand && (
              <Overlay
                onClick={() => {
                  setToggleExpand(false);
                }}
              ></Overlay>
            )}
            <LogoContainer>
                <LogoQ />
            </LogoContainer>
            <Menu>
                {isAuth(userAuthStatus, 'authenticated::admin') && (
                    <ToggleViewButton onClick={logout}>Logout</ToggleViewButton>
                )}
                {/* <ThemeButton onClick={props.handleToggleTheme}>
                    {props.theme === "light"
                        ? "Light Mode"
                        : "Dark Mode"}
                </ThemeButton> */}
                {isAuth(userAuthStatus, 'authenticated::admin') &&
                    _cc_token !== null &&
                    _cc_token.type == 'Internal' && (
                        <ToggleViewButton onClick={handleToggleView}>
                            {props.viewMode == 0 ? 'Viewing as CariClub' : 'Viewing as Client'}
                        </ToggleViewButton>
                    )}
                {/* {isAuth(userAuthStatus, 'authenticated::admin') &&
                    _cc_token !== null &&
                    _cc_token.type == 'Internal' &&
                    props.viewMode == 0 && (
                      
                    )} */}
                <UploadNotes 
                  org_key={props.appState?.company.org_key}
                />
                {isAuth(userAuthStatus, 'authenticated::admin') && (
                    <CompanySelect
                        setApplicationState={props.setApplicationState}
                        companies={props.companies}
                        companyId={props.companyId}
                        isAuth={isAuth}
                        setIsLoading={props.setIsLoading}
                        viewMode={props.viewMode}
                        userAuthStatus={userAuthStatus}
                        setCompanyId={props.setCompanyId}
                        setCompanyLogo={props.setCompanyLogo}
                        setActive={props.setActive}
                    />
                )}
                <ButtonDropdown >
                  <Download onClick={() => setToggleExpand(!toggleExpand)} />
                  { toggleExpand && 
                    (<div>
                      {isAuth(userAuthStatus, 'authenticated::admin') &&
                          _cc_token !== null &&
                          _cc_token.type == 'Internal' &&
                          props.viewMode == 0 ? (
                            <ButtonDropdownContent>
                              <DownloadData disabled={isUpdatingGoogleSheet} onClick={handleGoogleSheetUpdate}>
                                  {isUpdatingGoogleSheet ? 'Processing ...' : 'Publish Updates'}
                              </DownloadData>
                              <DownloadData onClick={exportMembers}>Download Data</DownloadData>
                            </ButtonDropdownContent>
                          )
                        : (
                          <ButtonDropdownContent>
                            <DownloadData onClick={exportMembers}>Download Data</DownloadData>
                          </ButtonDropdownContent>
                      )}
                    </div>)
                  }
                </ButtonDropdown>
                {isAuth(userAuthStatus, 'authenticated::admin') &&
                    _cc_token !== null &&
                    _cc_token.type == 'Internal' &&
                    props.viewMode == 0 && (
											<MemberSearch />
                    )}
            </Menu>
        </HeaderContainer>
    );
};

export default Header;
