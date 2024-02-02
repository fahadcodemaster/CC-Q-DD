import React from 'react';
import {
    DashboardHeaderContainer,
    Title,
    ActionsContainer,
    FiltersContainer,
    ItemLabel,
    FilterItem,
    DownloadButton,
    DashboadHeaderFilters,
    DashboardButtonContainer,
    DashboardHeaderButtonsContainer,
} from './styles.css';
import { ReactComponent as Notification } from '../../assets/ringbell.svg';
import { ReactComponent as Filter } from '../../assets/filter.svg';
import { ReactComponent as Download } from '../../assets/download.svg';
import { useHistory } from 'react-router-dom';

interface IProps {
    sectionTitle?: string;
    btnAction(): void;
    filterAction(): void;
    hideNotifications?: boolean;
    showFilters?: boolean;
    setActive(active: string): void;
    isLoading?: boolean;
}

const DashboardHeader = (props: IProps) => {
    const history = useHistory();

    const cc_token: any = localStorage.getItem('cc_token');
    let _cc_token = null;
    if (cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    }

    const navigateToNotifications = () => {
        history.push(`/notifications/${localStorage.getItem('company_id')}`);
        props.setActive('notifications');
    };

    const goToGroupsTypes = () => {
        history.push(`/cohort_types/${localStorage.getItem('company_id')}`);
    };
    const goToGroups = () => {
        history.push(`/cohorts/${localStorage.getItem('company_id')}`);
    };
    return (
        <DashboardHeaderContainer>
            <DashboadHeaderFilters>
                <Title>{props.sectionTitle}</Title>
                <ActionsContainer onClick={navigateToNotifications}>
                    {!props.hideNotifications && <Notification />}
                </ActionsContainer>
                <FiltersContainer>
                    {props.showFilters && (
                        <>
                            <FilterItem isActive>
                                <ItemLabel>Global</ItemLabel>
                            </FilterItem>
                            <FilterItem>
                                <ItemLabel>Regional</ItemLabel>
                            </FilterItem>
                            <FilterItem>
                                <ItemLabel>Local</ItemLabel>
                            </FilterItem>
                        </>
                    )}
                </FiltersContainer>
            </DashboadHeaderFilters>
            {props.sectionTitle == 'Dashboard' && _cc_token !== null && (
                <DashboardButtonContainer>
                    {/* <DownloadButton onClick={goToGroupsTypes}>
                        <ItemLabel>Cohort Types</ItemLabel>
                    </DownloadButton> &nbsp;&nbsp; */}
                    <DownloadButton onClick={goToGroups}>
                        <ItemLabel>Cohort Manager</ItemLabel>
                    </DownloadButton>{' '}
                    &nbsp;&nbsp;
                    <DownloadButton onClick={props.btnAction}>
                        <ItemLabel>+ Invite New Candidate</ItemLabel>
                    </DownloadButton>
                </DashboardButtonContainer>
            )}
            {props.sectionTitle == 'Pipeline' && (
                <DashboardButtonContainer>
                    <DownloadButton onClick={props.btnAction}>
                        <ItemLabel>
                            Download data <Download />
                        </ItemLabel>
                    </DownloadButton>
                </DashboardButtonContainer>
            )}
        </DashboardHeaderContainer>
    );
};

export default DashboardHeader;
