import DashboardHeader from 'components/DashboardHeader';
import React, { useState, useEffect } from 'react';
import {
	Container,
	NotificationsContainer,
	SectionHeader,
	SectionHeaderText,
	ItemHeader,
	ProfileContainer,
	ProfileImage,
	ProfileName,
	NotificationItem,
	Details,
	NotifDate,
	EstimDate,
	Visibility,
	ItemContent,
	Note,
	NoteContent,
	LoadMoreContainer,
	StyledButton,
	Spinner,
	SpinnerContainer,
	NonprofitLogo,
	NonProfitName,
	LicenseStatusCircle,
} from './styles.css';

import defaultProfileImg from '../../../assets/default-user-avatar.png';
import { ReportingAPI, ReportingDB } from '../../../../types';
import { getAdminLogs, getMonthlyReports } from 'services/cariclub';
import { MailOutlineSharp } from '@material-ui/icons';
import { InsightsApp } from 'global';
import { useHistory } from 'react-router-dom';
import Comment from '../Member/MemberHistory/Comment';
import moment from 'moment/moment';
import Post from './Post';
import { Tooltip } from '@material-ui/core';
import { getMemberTooltip } from '../helper';
import config from '../../../config';
import { LeftSection, RightSection, RightSectionItem } from '../Member/styles.css';

export type currentMemberType = InsightsApp.MemberPage;
interface IProps {
	viewMode: number;
	appState: ReportingAPI.PrimaryCompanyData | undefined;
	currentMember?: currentMemberType;
	setCurrentMember(member: currentMemberType): void;
	mapNPOsToMember(member: ReportingAPI.MemberInsight, npos: ReportingDB.Nonprofits[]): Promise<currentMemberType>;
	setActive(active: string): void;
	userData: any;
	companyLogo: string;
}

interface ILog {
	action: string;
	date: string;
	actor: { key: string; name: string; logo: string };
	member: { key: string; name: string; logo: string };
	nonprofit_logo: string;
	nonprofit_guid: string;
	is_public: number;
	type: string;
	comments_count: any;
	comments: any;
	comment_action_type: number;
	nonprofit_name: string;
	action_headline: string;
}

const Notifications = ({
	viewMode,
	appState,
	currentMember,
	setCurrentMember,
	mapNPOsToMember,
	userData,
	companyLogo,
}: IProps) => {
	const [logs, setLogs] = useState<any[]>([]);
	const [reports, setReports] = useState<any[]>([]);
	const [page, setPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [loadMore, setLoadMore] = useState(false);
	const [hideButton, setHideButton] = useState(false);
	let history = useHistory();

	const cc_token: any = localStorage.getItem('cc_token');
	let _cc_token: any = null;
	if (cc_token !== null) {
		_cc_token = JSON.parse(cc_token);
	}

	// useEffect(() => {
	//     setMembers(appState?.members)
	// }, [appState])
	const fetchNotifications = async (org_key: string, viewMode: number) => {
		setIsLoading(true);
		let results = await getAdminLogs(org_key, undefined, viewMode);
		setLogs(results);
		if (results.length == 5) {
			//page_size 5
			setLoadMore(true);
			setPage(page + 1);
		}
		setIsLoading(false);
	};

	const loadMonthlyReports = async(org_key: string, viewMode: number) => {
		let results = await getMonthlyReports(org_key, viewMode);
		setReports(results);
	}

	useEffect(() => {
		if (appState && appState.company.org_key) {
			fetchNotifications(appState.company.org_key, viewMode);
			loadMonthlyReports(appState.company.org_key, viewMode)
		}
	}, [appState, viewMode]);

	

	const loadMoreNoti = async () => {
		setIsLoading(true);
		let results = await getAdminLogs(appState?.company.org_key, undefined, viewMode, undefined, undefined, page, 15);
		if (results.length == 15) {
			//page_size 5
			setLoadMore(true);
			setPage(page + 1);
			setHideButton(false);
		} else if (results.length < 15) {
			setHideButton(true);
		}
		let new_logs = [...logs, ...results];
		setLogs(new_logs);
		setIsLoading(false);
	};

	const convertDateDiffHumanize = (date: string) => {
		var date_mom = convertUTCToLocal(date, 'YYYY-MM-DD HH:mm:ss');
		return moment.duration(date_mom.diff(moment(), 'minutes'), 'minutes').humanize(true);
	};

	const convertUTCToLocal = (dt: string, dtFormat: string) => {
		var toDt = moment.utc(dt, dtFormat).toDate();
		return moment(toDt);
	};

	function formatDate(date: string) {
		const datePart = date.slice(0, 10).split('-');

		return `${datePart[1]}/${datePart[2]}/${datePart[0]}`;
	}

	function parseDate(date: string) {
		return new Date(date);
	}

	async function navigateToMember(key: string) {
		const _member = appState?.members?.filter((mem) => mem.key === key)[0];
		if (_member) {
			if (!appState) {
				history.push('/');
			} else {
				const formattedMemberDetails = await mapNPOsToMember(_member, appState.nonprofits);
				setCurrentMember(formattedMemberDetails);
				history.push(`/notifications/${localStorage.getItem('company_id')}/${key}`);
			}
		}
	}

	return (
		<Container>
			{/*        
                <ComingSoon>
                    <ComingSoonText>
                        Coming soon...
                    </ComingSoonText>
                </ComingSoon>
            */}
			<DashboardHeader
				sectionTitle="Notifications"
				btnAction={() => { }}
				filterAction={() => { }}
				showFilters={false}
				setActive={() => { }}
			/>
			<div style={{ width: '100%', display: 'flex', gap: '32px' }}>
				<LeftSection>
					<Post
						org_key={appState?.company.org_key}
						viewMode={viewMode}
						companyLogo={companyLogo}
						fetchLogs={fetchNotifications}
					/>
					<NotificationsContainer>
						<SectionHeader>
							<SectionHeaderText>Member Updates</SectionHeaderText>
						</SectionHeader>

						{isLoading && (
							<SpinnerContainer>
								<Spinner />
							</SpinnerContainer>
						)}

						{logs &&
							!isLoading &&
							logs
								.sort((a: ILog, b: ILog) => {
									if (parseDate(a.date) < parseDate(b.date)) return 1;
									if (parseDate(a.date) > parseDate(b.date)) return -1;

									return 0;
								})
								.map((log: ILog, idx: number) => {
									return (
										<NotificationItem key={idx}>
											<ItemHeader>
												<ProfileContainer>
													{log.member.key ? (
														<>
															<ProfileImage
																src={
																	log.member.logo && !log.member.logo.includes('media.licdn')
																		? log.member.logo
																		: defaultProfileImg
																}
																alt="profile-img"
															/>
															<Tooltip title={getMemberTooltip(log.member).title}>
																<LicenseStatusCircle
																	shape={getMemberTooltip(log.member).shape}
																	status={getMemberTooltip(log.member).color}
																/>
															</Tooltip>
															<ProfileName onClick={() => navigateToMember(log.member.key)}>
																{log.member.name}
															</ProfileName>
														</>
													) : (
														<>
															<ProfileImage src={companyLogo} alt="profile-img" />
															<ProfileName>{appState?.company.org_name}</ProfileName>
														</>
													)}
												</ProfileContainer>
												<Details>
													<NotifDate>{formatDate(log.date)}</NotifDate>
													<EstimDate>{convertDateDiffHumanize(log.date)}</EstimDate>
													<Visibility visibility={log.is_public === 1 ? 'public' : 'private'}>
														{log.is_public === 1 ? 'Public' : 'Private'}
													</Visibility>
													{log.nonprofit_logo != '' && (
														(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
															(
																<a target="_blank" href={config.cc_admin_url + `/organizations/` + log.nonprofit_guid}>
																	<NonprofitLogo src={log.nonprofit_logo}></NonprofitLogo>
																</a>
															) : (
																<NonprofitLogo src={log.nonprofit_logo}></NonprofitLogo>
															)
													)}
													<NonProfitName>{log.nonprofit_name}</NonProfitName>
												</Details>
											</ItemHeader>

											<ItemContent>
												<Note>{log.action_headline ? log.action_headline : log.type}</Note>
												<NoteContent dangerouslySetInnerHTML={{ __html: log.action }}></NoteContent>
											</ItemContent>
											<Comment userData={userData} log={log}></Comment>
										</NotificationItem>
									);
								})}

						{!isLoading && loadMore && !hideButton && (
							<LoadMoreContainer>
								<StyledButton onClick={loadMoreNoti}>Load more notifications</StyledButton>
							</LoadMoreContainer>
						)}
					</NotificationsContainer>
				</LeftSection>
				<RightSection>
					<RightSectionItem>
						<SectionHeaderText>Monthly Reports</SectionHeaderText>
						<div>
							{
								reports.length ? 
								reports.map((report) => (
									<div style={{padding: '10px'}}>
										<a 
											href={`https://cc-upload-prod-cari.s3.amazonaws.com/${report.file_name}`} 
											style={{lineHeight: '20px', textDecoration: 'unset', fontSize: '14px', fontFamily: 'Inter, sans-serif'}}
										>
											{appState?.company.org_name} Monthly Engagement Data {moment.utc(report.created_date).subtract(5, 'hours').format("ddd, MMM DD, YYYY")} at {moment.utc(report.created_date).subtract(5, 'hours').format("hh:mm:ss A")}
										</a>
									</div>
								)) : 
								<></>
							}
						</div>
					</RightSectionItem>
				</RightSection>
			</div>
		</Container>
	);
};

export default Notifications;
