import React, { useState, useEffect } from 'react';
import { AppContainer, AppContent, TopBarWhiteSpace, SideBarWhiteSpace, LoadingEle, LoadingText } from './styles.css';
import { ThemeProvider } from 'styled-components';
import { themes } from '../Theme';
import SideNav from '../SideNav';
import NavBar from 'components/NavBar';
import Members from '../Pages/Members';
import Member from '../Pages/Member';
import AddNewMember from '../Pages/Member/AddNewMember';
import MemberRequest from '../Pages/Member/MemberRequest';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useLocation,
	useParams,
	useHistory,
} from 'react-router-dom';
import Home from '../Pages/Home';
import Settings from '../Pages/Settings';
import Notifications from '../Pages/Notifications';

import { ReportingAPI, ReportingDB } from '../../../types';

import {
	getCompanyDashboard,
	verifyLogin,
	getCompanies,
	getCompanyData,
	getPipelineStatuses,
	getATSStatuses,
	getMilestoneMarkers,
	getUserData,
} from '../../services/cariclub';
import Header from 'components/Header';
import Engagement from 'components/Pages/Engagement';
import { InsightsApp } from 'global';
import { CircularProgress } from '@material-ui/core';
import Groups from 'components/Pages/Settings/Groups';
import GroupTypes from 'components/Pages/Settings/GroupTypes';

type AuthStatus = 'unauthenticated::pending' | 'unauthenticated::denied' | 'authenticated' | string;

interface Location {
	city: string;
	state: string;
	type: string;
	city_key: string;
	org_key: string;
	is_current: number;
}

interface Company {
	org_key: string;
	org_name: string;
	org_logo: string;
	locations: Location[];
}

function App() {
	const route = useLocation();
	const param: any = useParams();
	const history = useHistory();

	const activeNav = param.route ? param.route : 'dashboard';
	const [theme, toggleTheme] = useState<'light' | 'dark'>('light');
	const [viewMode, setViewMode] = useState(0); //0 internal view, 1 client view
	const [companyId, setCompanyId] = useState<string | null>(null);
	const [companyName, setCompanyName] = useState<string | null>(null);
	const [isSideNavToggled, toggleSideNav] = useState(true);
	const [isLoaded, setLoaded] = useState(false);
	const [userAuthStatus, setUserAuthStatus] = useState<AuthStatus>('unauthenticated::pending');
	const [applicationState, setApplicationState] = useState<ReportingAPI.PrimaryCompanyData | undefined>();
	const [plStatuses, setPlStatuses] = useState([]);
	const [atsStatuses, setATSStatuses] = useState([]);
	const [milestoneMarkers, setMilestoneMarkers] = useState([]);
	const [active, setActive] = useState(activeNav);
	const [dashboardData, setDashboardData] = useState();
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [companies, setCompanies] = useState<Company[]>([]);
	const [currentMember, setCurrentMember] = useState<InsightsApp.MemberPage>();
	const [companyLogo, setCompanyLogo] = useState('');
	const [userData, setUserData] = useState(null);
	const [pageIsLoading, setPageIsLoading] = useState<boolean>(false);

	function handleToggleTheme() {
		if (theme === 'light') {
			toggleTheme('dark');
		} else {
			toggleTheme('light');
		}
	}

	function handleSideNavToggle() {
		toggleSideNav(!isSideNavToggled);
	}

	function isAuth(userAuthStatus: string, threshold: string) {
		const delimiter = '::';

		if (userAuthStatus.split(delimiter).length !== 2) console.error(`${userAuthStatus} cannot be interpreted`);

		const [authentication, authorization] = userAuthStatus.split(delimiter);
		const [authenticationRequirement, authorizationRequirement] = threshold.split(delimiter);
		const authorizationPoints = new Map();
		authorizationPoints.set('super', 10);
		authorizationPoints.set('admin', 5);
		authorizationPoints.set('basic', 3);
		authorizationPoints.set('pending', 1);
		const authorizationWeight = authorizationPoints.get(authorization);
		const authorizationRequirementWeight = authorizationPoints.get(authorizationRequirement);
		if (authorization === 'denied' && authorizationRequirement === 'denied') {
			return true;
		}
		if (authorization !== 'denied' && authorizationRequirement === 'denied') {
			return false;
		}
		if (authentication !== authenticationRequirement) {
			return false;
		}
		if (authorizationWeight < authorizationRequirementWeight) {
			return false;
		}

		return true;
	}

	const sideNavStyles = {
		width: isSideNavToggled ? '250px' : '100px',
	};

	const shouldToggleSideBar = (e: any) => {
		const isWithinToggleableArea = e.clientX > 149 && e.clientY > 49;

		if (isWithinToggleableArea && isSideNavToggled) {
			handleSideNavToggle();
		}
	};

	/**
	 * @function mapNPOsToMember
	 * @description TODO: potentially deprecate this to ensure data manipulation is handled server-side. This function
	 * joins the array of NPO ids found in member.fan_of as well as applications[].nonprofit_id with npo data before
	 * it is passed into the member details page
	 **/
	const mapNPOsToMember: (
		member: ReportingAPI.MemberInsight,
		npos: ReportingDB.Nonprofits[],
	) => Promise<InsightsApp.MemberPage> = (member: ReportingAPI.MemberInsight, npos: ReportingDB.Nonprofits[]) => {
		return new Promise((resolve, reject) => {
			if (!npos) reject();
			const { fan_of: fanOf, applications } = member;
			const fanOfWithNPOs = fanOf.map((npoId: number) => {
				const targetIdxNPO = npos.findIndex((npo: ReportingDB.Nonprofits) => npo.id === npoId);
				if (targetIdxNPO < 0) {
					return {
						id: npoId,
						crm_company_id: 0,
						cc_org_id: 0,
						name: 'Null NPO',
						crm_created_at: null,
						crm_updated_at: null,
						cc_created_at: null,
						cc_updated_at: null,
					} as ReportingDB.Nonprofits;
				}
				return npos[targetIdxNPO];
			});
			if (applications !== null) {
				const applicationsWithNpos = applications.map((app: ReportingAPI.ApplicationInsight) => {
					const targetIdxNPO = npos.findIndex((npo: ReportingDB.Nonprofits) => npo.id === app.nonprofit_id);
					if (targetIdxNPO < 0) {
						return {
							...app,
							nonprofit: {
								id: app.nonprofit_id,
								crm_company_id: 0,
								cc_org_id: 0,
								name: 'Null NPO',
								crm_created_at: null,
								crm_updated_at: null,
								cc_created_at: null,
								cc_updated_at: null,
							} as ReportingDB.Nonprofits,
						} as InsightsApp.ApplicationDetails;
					}
					return {
						...app,
						nonprofit: npos[targetIdxNPO],
					};
				});
				resolve({
					...member,
					fan_of: fanOfWithNPOs,
					applications: applicationsWithNpos,
				});
			} else {
				resolve({
					...member,
					fan_of: fanOfWithNPOs,
					applications: [],
				});
			}
		});
	};

	useEffect(() => {
		const checkLoginStatus = async () => {
			const isLoggedIn = verifyLogin();

			if (isLoggedIn) {
				const auth_level = 'admin';
				// const _company_id = '2d2989ad-3eca-11e8-b9c0-12e0c395e778';
				// const _company_name = 'CariClub';
				// setCompanyId(_company_id);
				setUserAuthStatus(`authenticated::${auth_level}`);
				const _cc_token: any = localStorage.getItem('cc_token');
				if (_cc_token.type == 'External') {
					setViewMode(1);
				}
				fetchUserData();
				// await initDataLoad(_company_id, _company_name, '');
				fetchCompanies();
			} else {
				console.error('not Login');
				setUserAuthStatus('unauthenticated::denied');
			}
		};

		let storageViewMode = localStorage.getItem('viewMode');
		if (storageViewMode !== null) {
			setViewMode(parseInt(storageViewMode));
		}

		const fetchUserData = async () => {
			const user_data = await getUserData();
			setUserData(user_data);
		};

		const fetchCompanies = async () => {
			const companies = await getCompanies();
			setCompanies(companies);
			setCompanyLogo(companies[0].org_logo);
		};
		checkLoginStatus();
	}, []);

	useEffect(() => {
		if (companies && companies.length > 0) {
			if (param.companyId) {
				let company = companies.filter((el: any) => el.org_key == param.companyId);
				if (company.length > 0) {
					setCompanyName(company[0].org_name);
					setCompanyId(company[0].org_key);
					setCompanyLogo(company[0].org_logo);
					localStorage.setItem('company_id', company[0].org_key as string);
				} else {
					setCompanyName(companies[0].org_name);
					setCompanyId(companies[0].org_key);
					setCompanyLogo(companies[0].org_logo);
					localStorage.setItem('company_id', companies[0].org_key as string);
					history.push('/');
				}
			} else {
				const current_company = localStorage.getItem('company_id');
				if (current_company !== null) {
					const company = companies.filter((org: any) => org.org_key === current_company);
					if (company.length > 0) {
						setCompanyName(company[0].org_name);
						setCompanyId(company[0].org_key);
						setCompanyLogo(company[0].org_logo);
					}
				} else {
					if (companyId === null) {
						setCompanyName(companies[0].org_name);
						setCompanyId(companies[0].org_key);
						setCompanyLogo(companies[0].org_logo);
						localStorage.setItem('company_id', companies[0].org_key as string);
					}

					if (param.route) {
						history.push('/');
					}
				}
			}
		}
	}, [companies, param]);

	const initDataLoad = async (companyId: string, comName: string, reload: boolean = false) => {
		if (applicationState && !reload) return;
		let data: any;
		data = await getCompanyData(companyId, comName, '', '', '', undefined, undefined, viewMode);
		setApplicationState(data);
		setLoaded(true);
	};

	const initLoad = async () => {
		let pipelines = await getPipelineStatuses();
		setPlStatuses(pipelines);
		let ats = await getATSStatuses();
		setATSStatuses(ats);
		let mms = await getMilestoneMarkers();
		setMilestoneMarkers(mms);
	}

	useEffect(() => {
		if (companyId !== null && companyName !== null) {
			initDataLoad(companyId, companyName);
		}
		initLoad()
	}, [companyId, companyName]);

	useEffect(() => {
		if (companyId !== null && companyName !== null) {
			const fetchDashboardData = async () => {
				if (verifyLogin()) {
					setIsLoading(true);
					const data: any = await getCompanyDashboard(companyId, viewMode);
					setDashboardData(data);
					setIsLoading(false);
				}
			};
			fetchDashboardData();
		}
	}, [companyId, companyName, viewMode]);

	useEffect(() => {
		if (applicationState && param.memberKey) {
			const setMember = async () => {
				let filtered = applicationState.members.filter(
					(el: ReportingAPI.MemberInsight) => el.key === param.memberKey,
				);
				if (filtered.length > 0) {
					let member = filtered[0];
					const formattedMemberDetails = await mapNPOsToMember(member, applicationState.nonprofits);
					setCurrentMember(formattedMemberDetails);
				}
			};
			setMember();
		}
	}, [applicationState, param]);

	return (
		<ThemeProvider theme={theme === 'light' ? themes.light : themes.dark}>
			{isAuth(userAuthStatus, 'unauthenticated::pending') ||
				(!isLoaded && (
					<div
						style={{
							height: '100vh',
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<LoadingText>Loading company data</LoadingText>
						<CircularProgress color="inherit" size={30} />
					</div>
				))}

			{isAuth(userAuthStatus, 'authenticated::admin') && isLoaded && (
				<AppContainer>
					<Header
						isAuth={isAuth}
						userAuthStatus={userAuthStatus}
						handleToggleTheme={handleToggleTheme}
						companyId={companyId}
						companies={companies}
						theme={theme}
						viewMode={viewMode}
						setViewMode={setViewMode}
						setCompanyId={setCompanyId}
						setApplicationState={setApplicationState}
						setActive={setActive}
						setIsLoading={setPageIsLoading}
						setCompanyLogo={setCompanyLogo}
						appState={applicationState}
					/>
					<SideNav
						active={active}
						viewMode={viewMode}
						setActive={setActive}
						style={sideNavStyles}
						companyData={applicationState ? applicationState.company : applicationState}
						companyLogo={companyLogo}
					/>
					<AppContent>
						<Switch>
							<Route path="/requestedMember/:companyId/:memberKey">
								<MemberRequest
									appState={applicationState}
									companyId={param.companyId}
									companies={companies}
									viewMode={viewMode}
									memberId={param.memberKey}
								/>
							</Route>
							<Route path="/:route/:companyId/:memberKey">
								<Member
									userData={userData}
									member={currentMember}
									plStatuses={plStatuses}
									atsStatuses={atsStatuses}
									milestoneMarkers={milestoneMarkers}
									queryRoute={param.route}
									queryCompanyID={param.companyId}
									queryMemberKey={param.memberKey}
									viewMode={viewMode}
									isAuth={isAuth}
									userAuthStatus={userAuthStatus}
									companyLogo={companyLogo}
									companyName={companyName}
									companies={companies}
									initDataLoad={initDataLoad}
								/>
							</Route>
							<Route path="/pipeline/:companyId">
								<Members
									appView="pipeline"
									queryCompanyID={param.companyId}
									plStatuses={plStatuses}
									milestoneMarkers={milestoneMarkers}
									atsStatuses={atsStatuses}
									appState={applicationState}
									viewMode={viewMode}
									setApplicationState={setApplicationState}
									userAuthStatus={userAuthStatus}
									isAuth={isAuth}
									currentMember={currentMember}
									setCurrentMember={setCurrentMember}
									mapNPOsToMember={mapNPOsToMember}
									setActive={setActive}
								/>
							</Route>
							<Route path="/engagement/:companyId">
								<Engagement
									appState={applicationState}
									queryCompanyID={param.companyId}
									plStatuses={plStatuses}
									milestoneMarkers={milestoneMarkers}
									currentMember={currentMember}
									viewMode={viewMode}
									setApplicationState={setApplicationState}
									setCurrentMember={setCurrentMember}
									mapNPOsToMember={mapNPOsToMember}
									setActive={setActive}
								/>
							</Route>
							<Route path="/notifications/:companyId">
								<Notifications
									userData={userData}
									viewMode={viewMode}
									appState={applicationState}
									setCurrentMember={setCurrentMember}
									mapNPOsToMember={mapNPOsToMember}
									currentMember={currentMember}
									setActive={setActive}
									companyLogo={companyLogo}
								/>
							</Route>
							<Route path="/settings/:companyId">
								<Settings />
							</Route>
							<Route path="/addNewMember/:companyId">
								<AddNewMember
									companyId={companyId}
									companies={companies}
									viewMode={viewMode}
									queryCompanyID={param.companyId}
								/>
							</Route>
							<Route path="/cohorts/:companyId">
								<Groups
									companyId={companyId}
									viewMode={viewMode}
									queryCompanyID={param.companyId}
								/>
							</Route>
							<Route path="/cohort_types/:companyId">
								<GroupTypes
									companyId={companyId}
									viewMode={viewMode}
									queryCompanyID={param.companyId}
								/>
							</Route>
							<Route path="/">
								<Home
									isAuth={isAuth}
									userAuthStatus={userAuthStatus}
									handleToggleTheme={handleToggleTheme}
									companyId={companyId}
									theme={theme}
									viewMode={viewMode}
									setViewMode={setViewMode}
									setCompanyId={setCompanyId}
									setApplicationState={setApplicationState}
									appState={applicationState}
									dashboardData={dashboardData}
									isLoading={isLoading}
									setActive={setActive}
									setIsLoading={setIsLoading}
								/>
							</Route>
						</Switch>
					</AppContent>
				</AppContainer>
			)}

			{isAuth(userAuthStatus, 'unauthenticated::denied') && <Redirect to="/login" />}
		</ThemeProvider>
	);
}

export default App;
