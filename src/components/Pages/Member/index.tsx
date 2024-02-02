import React, { useState, useEffect } from 'react';
import {
	Container,
	DetailsContainer,
	DetailsContent,
	PlaceholderImg,
	ProfileImg,
	EyeImg,
	MemberName,
	InterestIcon,
	HistoryContent,
	BackButton,
	ImageContainer,
	MemberInfosContainer,
	MemberUpdates,
	SectionHeader,
	SectionHeaderText,
	RightSection,
	RightSectionItem,
	ProgressBarContainer,
	LeftSection,
	LoadMoreContainer,
	StyledButton,
	StatsInfoBox,
	DownloadButton,
	ItemLabel,
	ButtonsRow,
	LicenseStatusCircle,
	Dropdown,
	DropdownMenu,
	Spinner,
	Overlay,
	ProgressSection
} from './styles.css';

import { ReactComponent as Back } from '../../../assets/backArrow.svg';
import { ReactComponent as EditIcon } from '../../../assets/edit-icon.svg';

import advocacy from '../../../assets/advocacy.svg';
import aid from '../../../assets/aid.svg';
import community from '../../../assets/community.svg';
import culture from '../../../assets/culture.svg';
import education from '../../../assets/education.svg';
import environment from '../../../assets/environment.svg';
import health from '../../../assets/health.svg';
import recreation from '../../../assets/recreation.svg';
import STEM from '../../../assets/STEM.svg';
import defaultProfileImg from '../../../assets/default-user-avatar.png';
import eyeImg from '../../../assets/eyeicon.png';

import { ReactComponent as LinkedIn } from '../../../assets/LinkedInLogo.svg';
import { ReactComponent as ExternalLink } from '../../../assets/ExternalLink.svg';
import CCLogo from '../../../assets/CCLogo.png';
import config from '../../../config';
import moment from 'moment';
import swal from 'sweetalert';

import { H1, P } from '../../Common/styles.css';

import { PrimeStatus, ActiveStatus, InactiveStatus, IdleStatus, RightSectionTopItem, CopperButton } from './styles.css';

import { InsightsApp } from 'global';
import { ReportingDB, ReportingAPI } from '../../../../types';
import MemberHistory from './MemberHistory';
import Application from './Application';
import { getApplications, getAdminLogs, getEngagementStatuses, getMemberStats, updateMemberStatus } from '../../../services/cariclub';
import { EngagementStatuses } from '../Engagement/types';
import ProgressBar from './ProgressBar';
import Post from './Post';
import EditMemberProfile from './EditMemeber';
import { Tooltip } from '@material-ui/core';
import { getMemberTooltip } from '../helper';
import { ReactComponent as Checkmark } from '../../../assets/checkmark-icon.svg';
import { ReactComponent as DropdownIcon } from '../../../assets/dropdown.svg';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LocalBar } from '@material-ui/icons';

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

interface Props {
	userData: any;
	member: InsightsApp.MemberPage | undefined;
	plStatuses: any;
	atsStatuses: any;
	milestoneMarkers: any;
	queryRoute: string | null;
	queryCompanyID: string | null;
	queryMemberKey: string | null;
	userAuthStatus: string;
	isAuth: (userAuthStatus: string, threshold: string) => boolean;
	viewMode: number;
	companyLogo: string;
	companyName: string | null;
	initDataLoad(companyID: string, companyName: string, reload: boolean): void;
	companies: Company[];
}

interface ILog {
	action: string;
	date: string;
	actor: { key: string; name: string };
	is_public: number;
	note: string;
}

const CAUSE_ICON_MAP = {
	Advocacy: advocacy,
	Aid: aid,
	Community: community,
	Culture: culture,
	Education: education,
	Environment: environment,
	Health: health,
	Recreation: recreation,
	STEM: STEM,
};

interface userStats {
	activatedDate: string | null;
	department: string | null;
	employer: string;
	invitationDate: string | null;
	lastLogin: string | null;
	license: string;
	location: string | null;
	personalEmail: string | null;
	personalPhone: string | null;
	profileCompletion: number;
	puaseDates: string | null;
	workEmail: string | null;
	workPhone: string | null;
}

function Member({
	member,
	plStatuses,
	atsStatuses,
	milestoneMarkers,
	queryRoute,
	queryCompanyID,
	queryMemberKey,
	userAuthStatus,
	isAuth,
	viewMode,
	companyLogo,
	userData,
	companies,
	companyName,
	initDataLoad,
}: Props) {
	const [engagementState, setEngagementState] = useState<EngagementStatuses[]>([]);
	const [applications, setApplications] = useState([]);
	const [logs, setLogs] = useState<any[]>([]);
	const [filterLogs, setFilterLogs] = useState<any[]>([]);
	const [page, setPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [loadMore, setLoadMore] = useState(false);
	const [memberStats, setMemberStats] = useState<userStats>();
	const [showEditForm, setShowEditForm] = useState(false);
	const [hideButton, setHideButton] = useState<boolean>(false);
	const [applicationFilters, setApplicationFilters] = useState<any[]>([]);

	const [toggleMMMenu, setToggleMMMenu] = useState(false)
	const [memberMM, setMemberMM] = useState(0)

	const cc_token: any = localStorage.getItem('cc_token');
	let _cc_token = null;
	if (cc_token !== null) {
		_cc_token = JSON.parse(cc_token);
	}
	function parseDate(date: string) {
		return new Date(date);
	}

	const getStausEle = (status: number | null) => {
		if (status !== null) {
			const statusString = engagementState[(engagementState[status - 1]?.parent_id || status) - 1]?.name;
			if (statusString === 'Prime') return <PrimeStatus>{statusString}</PrimeStatus>;
			else if (statusString === 'Active') return <ActiveStatus>{statusString}</ActiveStatus>;
			else if (statusString === 'Idle') return <IdleStatus>{statusString}</IdleStatus>;
			else if (statusString === 'Inactive') return <InactiveStatus>{statusString}</InactiveStatus>;
		}
	};

	const fetchInit = async () => {
		// console.log("member => ", member)
		if (member) {
			setIsLoading(true);
			let res = await getMemberStats(member.key);
			setMemberStats(res);
			setApplications(await getApplications(member.key));
			let results = await getAdminLogs(undefined, member.key, viewMode, applicationFilters.length ? 6 : undefined, applicationFilters);

			setLogs(results);
			if (results.length == 5) {
				//page_size 5
				setLoadMore(true);
			}
			setMemberMM(member.userpipeline_status)
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchInit();
	}, [member, viewMode]);

	const fetchAdminLogs = async () => {
		if (member) {
			setIsLoading(true);
			setPage(1);
			setLoadMore(true);
			setHideButton(false);

			let results = await getAdminLogs(undefined, member.key, viewMode, applicationFilters.length ? 6 : undefined, applicationFilters);

			setLogs(results);
			if (results.length == 5) {
				//page_size 5
				setLoadMore(true);
				setHideButton(false);
			}
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAdminLogs();
	}, [applicationFilters]);

	const loadMoreNoti = async () => {
		setIsLoading(true);
		let results = await getAdminLogs(undefined, member?.key, viewMode, applicationFilters.length ? 6 : undefined, applicationFilters, page + 1, 15);
		if (results.length == 15) {
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

	useEffect(() => {
		getEngagementStatuses()
			.then((res) => {
				setEngagementState(res);
			})
			.catch((error) => {
				console.log({ engagementStateErr: error.response.data });
			});
	}, []);

	const steps = [
		'Deactivating',
		'Dismissing',
		'Suspending',
		'Idling',
		'Pausing',
		'Pending',
		'Activating',
		'Matching',
		'Consulting',
	];

	const handleImgLoadError = (e: any) => {
		// return <ProfileImg src={defaultProfileImg} style={{ width: "200px" }} />
		e.target.src = defaultProfileImg;
		e.target.onerror = null;
	};

	const onSave = () => {
		if (queryCompanyID) {
			initDataLoad(queryCompanyID, companyName || '', true);
			setShowEditForm(false);
		} else {
			swal('Something went wrong!', '', 'error').then((value) => {
				setShowEditForm(false);
			});
		}
	};

	const onCancel = () => {
		setShowEditForm(false);
	};

	const clientViewAvailable = (member: any) => {
		return ((member.cariclub_role != 3 && member.candidate_license == 4) || ([65, 66, 71].includes(member.userpipeline_status))) ? true : false;
	}

	const filterChanged = (applicationId: any) => {
		console.log(applicationId)
		let temp = [...applicationFilters]
		if (!temp.includes(applicationId)) {
			temp.push(applicationId)
		} else {
			temp.splice(temp.indexOf(applicationId), 1)
		}

		setApplicationFilters(temp)
	}

	const getUserPipelineStatus = (userpipeline_status: number) => {
		let names = {
			'position': '',
			'stage': '',
			'description': '',
			'progress': ''
		}
		let status = milestoneMarkers.filter((el: any) => { return el.id === userpipeline_status; })
		if (status.length > 0) {
			status = status[0];
			names.position = status.name;
			names.description = status.description;
			names.progress = status.progress;

			// check if it has parent stage
			if (status.parent_id) {
				const parent_status = milestoneMarkers.filter((el: any) => { return el.id === status.parent_id; })
				if (parent_status.length > 0) {
					names.stage = parent_status[0].name;
				}
			}
		}
		return names;
	}

	const getAppPipelineStatus = (userpipeline_status: number) => {
		let names = {
		  'position': '',
		  'stage': '',
		  'description': '',
		  'pps_id': userpipeline_status,
		  'pps_parent_id': null,
		  'progress': ''
		}
		let status = plStatuses.filter((el: any) => { return el.id === userpipeline_status; })
		if (status.length > 0) {
		  status = status[0];
		  names.position = status.name;
		  names.description = status.descriptoin;
		  names.progress = status.progress;
	
		  // check if it has parent stage
		  if (status.parent_id) {
			names.pps_parent_id = status.parent_id
			const parent_status = plStatuses.filter((el: any) => { return el.id === status.parent_id; })
			if (parent_status.length > 0) {
			  names.stage = parent_status[0].name;
			}
		  }
		}
		return names;
	  }

	const updateMemberMM = async (mileston_marker_id: number) => {
		setToggleMMMenu(false)
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the Milestone Marker?",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure && member) {
				var data = {
					member_key: member.key,
					// ...userStatuses
					UserPriviledgeTerm: member.priviledge_term,
					UserPriviledgeType: member.priviledge_type,
					CariclubRole: member.cariclub_role,
					CandidateLicense: member.candidate_license,
					UserPipelineStatus: mileston_marker_id
				}
				await updateMemberStatus(data)
				setMemberMM(mileston_marker_id)
			} else {
				return false;
			}
		})
	}

	const customSort = (apps: any) => {
		// sort members by app tracker progress
		const mySort = (a: ReportingAPI.ApplicationInsight, b: ReportingAPI.ApplicationInsight) => {
			const a_progress = getAppPipelineStatus(a.pipelinestatus_id).progress ? getAppPipelineStatus(a.pipelinestatus_id).progress : 0
			const b_progress = getAppPipelineStatus(b.pipelinestatus_id).progress ? getAppPipelineStatus(b.pipelinestatus_id).progress : 0
			if (a_progress < b_progress) {
				return 1;
			}
			if (a_progress > b_progress) {
				return -1;
			}
			return 0;
		}

		apps.sort(mySort)
		console.log('sort here->', apps)
		return apps
	}

	return (
		<Container>
			<BackButton to={`/${queryRoute}/${queryCompanyID}`}>
				<a>
					<Back /> Back
				</a>
			</BackButton>
			{toggleMMMenu && (
				<Overlay
					onClick={() => {
						setToggleMMMenu(false);
					}}
				></Overlay>
			)}
			{member && (
				<DetailsContainer style={{ marginTop: '45px' }}>
					<ImageContainer>
						<ProfileImg
							src={
								member.profile_url && !member.profile_url.includes('media.licdn')
									? member.profile_url
									: defaultProfileImg
							}
							alt="profile-image"
						/>
						<Tooltip title={getMemberTooltip(member).title}>
							<LicenseStatusCircle
								shape={getMemberTooltip(member).shape}
								status={getMemberTooltip(member).color}
							/>
						</Tooltip>
					</ImageContainer>
					<DetailsContent>
						<MemberName>
							{member.first_name} {member.last_name}
							{clientViewAvailable(member) && (
								<span>
									<EyeImg src={eyeImg} alt="Not showing on client view"></EyeImg>
								</span>
							)}
						</MemberName>
						<Dropdown>
							<label onClick={() => setToggleMMMenu(!toggleMMMenu)}
							>{getUserPipelineStatus(memberMM).position ? getUserPipelineStatus(memberMM).position : "Update Milestone Marker"}&nbsp;&nbsp;
								<ExpandMoreIcon /></label>
							{
								toggleMMMenu &&
								milestoneMarkers &&
								<DropdownMenu>
									<ul className="dropdown-menu">
										{
											milestoneMarkers.filter((m1: any) => m1.parent_id == null).map((mm: any) => (
												<li key={`cariclub_mm_${mm.name}`}>
													<span className={getUserPipelineStatus(memberMM).stage == mm.name ? `category-menu active` : `category-menu`}>
														{mm.name}
														<DropdownIcon className="DropdownIcon" style={{ transform: 'rotate(-90deg)' }} />
													</span>
													<ul className="dropdown-menu dropdown-submenu">
														{
															milestoneMarkers.filter(
																(m2: any) => m2.parent_id == mm.id).map((subMM: any) => ((
																	<li key={`cariclub_mm_${subMM.name}`}
																		onClick={() => updateMemberMM(subMM.id)}
																	>
																		<span>{subMM.name}</span>
																		{
																			memberMM == subMM.id &&
																			<Checkmark />
																		}
																	</li>
																)))
														}
													</ul>
												</li>
											))
										}
									</ul>
								</DropdownMenu>
							}
						</Dropdown>

						{
							//</div>
							//<hr />
							//<P>Interests:</P>
							//<div>
							//member.interests.map((interest: InsightsApp.Interests, idx: number) => {
							//    return (
							//        <div key={`member-interest-${idx}`}>
							//            <InterestIcon src={CAUSE_ICON_MAP[interest]} />
							//            <P>{interest}</P>
							//        </div>
							//    )
							//})
						}
					</DetailsContent>
					<ButtonsRow>
						<Tooltip title="Click to enter member edit mode.">
							<DownloadButton onClick={() => setShowEditForm(true)}>
								<EditIcon style={{ fill: '#FFF' }} />
							</DownloadButton>
						</Tooltip>
						{viewMode == 0 && (
							<a href={`${config.cc_admin_url}/members/${member.key}`} target="_blank">
								<img src={CCLogo} alt="cc-logo" />
							</a>
						)}
						{viewMode == 1 && (
							<a href={`${config.cc_url}/member-profile/${member.key}`} target="_blank">
								<img src={CCLogo} alt="cc-logo" />
							</a>
						)}
						{member.linkedin_url && (
							<a href={`${member.linkedin_url || 'https://linkedin.com'}`} target="_blank">
								<LinkedIn />
							</a>
						)}
					</ButtonsRow>
				</DetailsContainer>
			)}
			{showEditForm && (
				<EditMemberProfile
					member={member}
					parentCompanyID={queryCompanyID}
					companies={companies}
					submit={onSave}
					cancel={onCancel}
					viewMode={viewMode}
				/>
			)}
			{member && (
				<MemberInfosContainer>
					<LeftSection>
						{getUserPipelineStatus(memberMM).progress && (
							<ProgressSection>
								<span>{getUserPipelineStatus(memberMM).progress}% Milestones achieved</span>
								{getUserPipelineStatus(memberMM).description}
							</ProgressSection>
						)}
						{memberStats && memberStats.license && (
							<StatsInfoBox>
								<SectionHeaderText>Activity Data</SectionHeaderText>
								<p>License: {memberStats.license}</p>
								<p>
									Invitation Date:{' '}
									{memberStats.invitationDate
										? moment(memberStats.invitationDate).format('MMMM Do YYYY, h:mm:ss a')
										: ''}
								</p>
								<p>
									Activation Date:{' '}
									{memberStats.activatedDate
										? moment(memberStats.activatedDate).format('MMMM Do YYYY, h:mm:ss a')
										: ''}
								</p>
								<p>
									Profile Completion:{' '}
									{memberStats.profileCompletion == 100
										? 'Completed'
										: `${memberStats.profileCompletion || 0} / 6`}
								</p>
								<p>
									Last Login:{' '}
									{memberStats.lastLogin
										? moment(memberStats.lastLogin).format('MMMM Do YYYY, h:mm:ss a')
										: ''}
								</p>
							</StatsInfoBox>
						)}
						<Post
							member={member}
							companyLogo={companyLogo}
							applications={applications}
							fetchLogs={fetchInit}
						/>
						<MemberUpdates>
							<SectionHeader>
								<SectionHeaderText>Member Updates</SectionHeaderText>
							</SectionHeader>
							{!isLoading && logs &&
								logs.length > 0 &&
								logs
									.sort((a: ILog, b: ILog) => {
										if (parseDate(a.date) < parseDate(b.date)) return 1;
										if (parseDate(a.date) > parseDate(b.date)) return -1;

										return 0;
									})
									.map((log, idx: number) => {
										return (
											<MemberHistory
												userData={userData}
												key={`member-history-${idx}`}
												log={log}
												isAuth={isAuth}
												userAuthStatus={userAuthStatus}
												viewMode={viewMode}
												fetchLogs={fetchAdminLogs}
											/>
										);
									})}
							{!isLoading && loadMore && !hideButton && (
								<LoadMoreContainer>
									<StyledButton onClick={loadMoreNoti}>Load more notifications</StyledButton>
								</LoadMoreContainer>
							)}
							{isLoading && <Spinner />}
						</MemberUpdates>
					</LeftSection>

					<RightSection>
						{memberStats && memberStats.license && (
							<StatsInfoBox>
								<SectionHeaderText>Contact Information</SectionHeaderText>
								<p>Employer: {memberStats.employer}</p>
								<p>Department: {memberStats.department || ''}</p>
								<p>
									Email:{' '}
									{memberStats.workEmail && memberStats.personalEmail
										? `${memberStats.workEmail}(Work), ${memberStats.personalEmail}(Personal)`
										: memberStats.workEmail || memberStats.personalEmail}
								</p>
								<p>
									Phone #:{' '}
									{memberStats.workPhone && memberStats.personalPhone
										? `${memberStats.workPhone}(Work), ${memberStats.personalPhone}(Personal)`
										: memberStats.workPhone || memberStats.personalPhone}
								</p>
								<p>Location: {memberStats.location || ''}</p>
							</StatsInfoBox>
						)}

						<div>
							<SectionHeaderText>
								Opportunities
							</SectionHeaderText>
							<div>
								{applications &&
									applications.length > 0 &&
									customSort(applications).map(
										(application: ReportingAPI.ApplicationInsight, idx: number) => {
											return (
												<Application
													key={`member-application-${idx}`}
													application={application}
													plStatuses={plStatuses}
													atsStatuses={atsStatuses}
													isAuth={isAuth}
													userAuthStatus={userAuthStatus}
													filterChanged={filterChanged}
													viewMode={viewMode}
												/>
											);
										},
									)}
							</div>
						</div>

						<RightSectionItem>
							<SectionHeaderText>{member.first_name}’s Interests</SectionHeaderText>
						</RightSectionItem>
					</RightSection>
				</MemberInfosContainer>
			)}
		</Container>
	);
}

export default Member;
