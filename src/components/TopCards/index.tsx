import React, { useEffect } from 'react';
import { CardsWrapper, Card, CardInfos, CardInfosHeader, CardInfosText, Status } from './style.css';

import { ReactComponent as First } from '../../assets/first.svg';
import { ReactComponent as Rising } from '../../assets/rising.svg';
import { ReactComponent as Second } from '../../assets/second.svg';
import { ReactComponent as Third } from '../../assets/third.svg';
import { ReactComponent as Fourth } from '../../assets/fourth.svg';
import { ReactComponent as Falling } from '../../assets/falling.svg';
import { ReportingAPI } from '../../../types';

interface IProps {
    dashboardData: any;
    appState: ReportingAPI.PrimaryCompanyData | undefined;
}

const TopCards = ({ dashboardData, appState }: IProps) => {
    const data = {
        placements: {
            icon: <First />,
        },
    };

    return (
        <CardsWrapper>
            <Card>
                <Third />
                <CardInfos>
                    <CardInfosHeader>
                        {/* {(
                            applications &&
                            applications?.filter((application: any) =>
                                ['submitted', 'received', 'phone call', 'follow-up', 'approved'].includes(
                                    application.status.toLowerCase(),
                                ),
                            )
                        )?.length || '0'} */}
                        {dashboardData?.top_stats.open_applications || 0}
                    </CardInfosHeader>
                    <CardInfosText>Open Applications</CardInfosText>
                    {/*<CardInfosText>
                        <Status color="success">
                            <Rising /> 4.07%
                        </Status>
                        Last month
                    </CardInfosText>*/}
                </CardInfos>
            </Card>

            <Card>
                <First />
                <CardInfos>
                    <CardInfosHeader>
                        {' '}
                        {/* {(
                            applications &&
                            applications?.filter((application: any) =>
                                ['withdrawn', 'denied', 'declined', 'accepted'].includes(
                                    application.status.toLowerCase(),
                                ),
                            )
                        )?.length || '0'} */}
                        {dashboardData?.top_stats.closed_applications || 0}
                    </CardInfosHeader>
                    <CardInfosText>Closed Applications</CardInfosText>
                    {/*<CardInfosText>
                        <Status color="success">
                            <Rising /> 0.24%
                        </Status>
                        Last month
                    </CardInfosText>*/}
                </CardInfos>
            </Card>

            <Card>
                <Second />
                <CardInfos>
                    <CardInfosHeader>
                        {' '}
                        {/* {(
                            applications &&
                            applications?.filter((application: any) =>
                                ['approved', 'accepted'].includes(application.status.toLowerCase()),
                            )
                        )?.length || '0'} */}
                        {dashboardData?.top_stats.matched_applications || 0}
                    </CardInfosHeader>
                    <CardInfosText>Matched Applications</CardInfosText>
                    {/*<CardInfosText>
                        <Status color="danger">
                            <Falling /> 1.64%
                        </Status>
                        Last month
                    </CardInfosText>*/}
                </CardInfos>
            </Card>

            <Card>
                <Fourth />
                <CardInfos>
                    <CardInfosHeader>
                        {/* {(appState?.members &&
                            appState?.members?.filter(
                                (member: ReportingAPI.MemberInsight) =>
                                    member.candidate_license === 1 || member.cariclub_role === 3,
                            ).length) ||
                            '0'} */}
                        {dashboardData?.top_stats.matched_members || 0}
                    </CardInfosHeader>
                    <CardInfosText>Matched Members</CardInfosText>
                    {/*<CardInfosText>
                        <Status color="warning">
                            <Rising /> 0.00%
                        </Status>
                        Last month
                    </CardInfosText>*/}
                </CardInfos>
            </Card>
        </CardsWrapper>
    );
};

export default TopCards;
