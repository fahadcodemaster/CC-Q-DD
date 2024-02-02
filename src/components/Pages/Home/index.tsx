import React, { useState, useEffect } from 'react';
import { Container } from './styles.css';
import { P, H1 } from '../../Common/styles.css';
import { RadialChart, VerticalBarSeries, XYPlot, XAxis, YAxis, HorizontalGridLines } from 'react-vis';
import { ReportingAPI } from '../../../../types';
import NavBar from 'components/NavBar';
import DashboardHeader from 'components/DashboardHeader';
import TopCards from 'components/TopCards';
import ActivitySummary from 'components/ActivitySummary';
import { useHistory } from 'react-router-dom';
import BottomCards from 'components/BottomCards';
// import { getMemberFandom, getApplications } from 'services/cariclub';

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
	dashboardData: any;
	isLoading: boolean;
	setActive(active: string): void;
	setIsLoading(loading: boolean): void;
}

interface IFandom {
	key: string;
	city: string;
	logo: string;
	name: string;
	state: string;
	causes: any[];
	is_fan: number;
	img_url: string;
	open_opp_list: string;
	involved_members: any[];
	match_percentage: number;
	description_short: string;
}

function Home({
	isAuth,
	userAuthStatus,
	handleToggleTheme,
	setApplicationState,
	companyId,
	setCompanyId,
	theme,
	viewMode,
	setViewMode,
	appState,
	dashboardData,
	isLoading,
	setActive,
	setIsLoading,
}: Props) {
	const history = useHistory();
	// const [applications, setApplications] = React.useState<any[]>([]);

	const addNewMember = () => {
		history.push(`/addNewMember/${companyId}`);
	};

	React.useEffect(() => {
		// let allApplications: any[] = new Array();
		// setApplications(allApplications);

		// const fetchApplications = async (memberKey: string) => {
		//     const res = await getApplications(memberKey);
		//     if (res !== null) {
		//         res.forEach((member: any) => {
		//             if (member.application_history !== null)
		//                 allApplications = [...allApplications, member.application_history[0]];
		//         });

		//         setApplications([...applications, ...allApplications]);
		//     }
		// };
		// appState?.members.forEach(async (member: ReportingAPI.MemberInsight, id: number) => {
		//     await fetchApplications(member.key);
		// });
	}, [appState]);

	return (
		<>
			<Container>
				<DashboardHeader
					sectionTitle="Dashboard"
					btnAction={addNewMember}
					filterAction={() => { }}
					showFilters={false}
					setActive={setActive}
				/>
				<TopCards
					appState={appState}
					dashboardData={dashboardData}
				// applications={applications} 
				/>
				<ActivitySummary
					dashboardData={dashboardData}
					isLoading={isLoading}
					appState={appState}
				// applications={applications}
				/>
			</Container>
		</>
	);
}

export default Home;
