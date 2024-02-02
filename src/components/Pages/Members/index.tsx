import React, { useState, useEffect, useRef, RefObject } from 'react';
import swal from 'sweetalert';
import { ReactComponent as DropdownIcon } from '../../../assets/dropdown.svg';
import { ReactComponent as Checkmark } from '../../../assets/checkmark-icon.svg';
import { ReactComponent as Lock } from '../../../assets/lock.svg';
import { ReactComponent as Private } from '../../../assets/private.svg';
import { ReactComponent as Globe } from '../../../assets/globe-public.svg';
import { ReactComponent as Invisible } from '../../../assets/invisible.svg';
import { ReactComponent as Dots } from '../../../assets/dots.svg';

import { ReactComponent as Download } from '../../../assets/download.svg';
import eyeImg from '../../../assets/eyeicon.png';

import {
	Container,
	MemberGrid,
	MemberCategoryList,
	MemberCategoryTitle,
	MemberCard,
	MemberTitle,
	MemberDetails,
	MemberNonprofit,
	ProfileImg,
	EyeImg,
	MemberHeader,
	MemberHeaderPipeline,
	MemberSubStatus,
	ImgContainer,
	MemberCardTopLevel,
	MemberCardTopLevelInfos,
	Status,
	MemberCategoryFilter,
	FilterIconContainer,
	FilterGroup,
	LicenseStatusCircle,
	MemberCardBottomLevel,
	MemberCompany,
	MemberDepartment,
	OrganizationLink,
	DropdownContainer,
	MenuContainer,
	Dropdown,
	SearchItem,
	DropdownItem,
	CohortContainer,
	StyledCheckBoxContainer,
	CheckBoxHeaderContainer,
} from './styles.css';

import { H1, H2 } from '../../Common/styles.css';

import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams } from 'react-router-dom';

import defaultProfileImg from '../../../assets/default-user-avatar.png';
import { ReportingAPI, ReportingDB } from '../../../../types';
import { InsightsApp } from 'global';
import config from '../../../config';
import {
	getMembersForExport,
	getLocations,
	getCompanyData,
	getMemberTypes,
	getLicenseTerms,
	getGroups,
} from '../../../services/cariclub';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';
import DashboardHeader from 'components/DashboardHeader';
import { ReactComponent as Filter } from '../../../assets/filter.svg';
import { boolean, number } from 'yup';
import { CircularProgress, Tooltip } from '@material-ui/core';
import {
	ActionsContainer,
	DashboadHeaderFilters,
	DashboardButtonContainer,
	DownloadButton,
	FilterItem,
	FiltersContainer,
	ItemLabel,
	MembersFiltersContainer,
	Title,
} from 'components/DashboardHeader/styles.css';
import { updateUser, getCandidateLicenses, getCariclubRoles, updateApplicationPipelineStatus, updateATS } from '../../../services/cariclub';
import {
	AdvancedFiltersContainer,
	FilterChildrenContainer,
	FilterContainer,
	FilterParent,
	LockIconContainer,
	Overlay,
} from '../Engagement/styles.css';
import { getMemberTooltip } from '../helper';

export type currentMemberType = InsightsApp.MemberPage;
interface IProps {
	appState: ReportingAPI.PrimaryCompanyData | undefined;
	queryCompanyID: string | null;
	setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
	isAuth: (userAuthStatus: string, threshold: string) => boolean;
	userAuthStatus: string;
	viewMode: number;
	appView: string;
	plStatuses: any;
	atsStatuses: any;
	milestoneMarkers: any;
	currentMember?: currentMemberType;
	setCurrentMember(member: currentMemberType): void;
	mapNPOsToMember(member: ReportingAPI.MemberInsight, npos: ReportingDB.Nonprofits[]): Promise<currentMemberType>;
	setActive(active: string): void;
}

const addMembersToStatus = (memberIds: Array<string>, appState: ReportingAPI.PrimaryCompanyData | undefined) => {
	if (!appState) return [];
	return memberIds
		.map((id) => {
			const targetIdx = appState.members.findIndex((member) => member.key === id);
			return appState.members[targetIdx];
		})
		.sort((a, b) => {
			if (a.first_name < b.first_name) {
				return -1;
			}
			if (a.first_name > b.first_name) {
				return 1;
			}
			return 0;
		});
};

const filterMembers = (
	pipelineStatusIds: Array<number>,
	appState: ReportingAPI.PrimaryCompanyData | undefined,
	plStatuses: any,
) => {
	if (!appState) return [];
	// currently fetch random five items from members.
	// var shuffled = appState.members.sort(function(){return .5 - Math.random()});
	// return shuffled.slice(0, 5);
	let filtered_members: Array<ReportingAPI.MemberInsight> = [];
	let members = appState.members;
	if (members && members.length > 0) {
		for (let key in pipelineStatusIds) {
			let filtered_pps: any = plStatuses.filter((el: any) => el.id == pipelineStatusIds[key]);
			let pipline_name = '';
			if (filtered_pps.length > 0) {
				pipline_name = filtered_pps[0].name;
			}
			for (let key1 in members) {
				let member_pps: Array<any> = members[key1].pipeline_statuses;
				if (member_pps && member_pps.length > 0) {
					for (let key2 in member_pps) {
						if (pipelineStatusIds[key] !== undefined && member_pps[key2].pps_id == pipelineStatusIds[key]) {
							let f_member = { ...members[key1] };
							f_member.pp_status = pipline_name;
							f_member.pp_obj = member_pps[key2];
							filtered_members.push(f_member);
						}
					}
				}
			}
		}
	}

	// const members = appState.members.filter(
	//     (el: ReportingAPI.MemberInsight) => {
	//         let exist = false;
	//         for(let key in el.pipeline_statuses) {
	//             if(pipelineStatusIds.indexOf(el.pipeline_statuses[key]) > -1) {
	//                 exist = true;
	//             }
	//         }
	//         return exist;
	//     }

	// );
	return filtered_members;
};

interface GroupObj {
	id: number;
	name: string;
	type_id: number;
	type_name: string;
	status: number;
	type_type: number;
	type_is_primary: number;
	desc: string;
}

function Members({
	appState,
	queryCompanyID,
	userAuthStatus,
	isAuth,
	setApplicationState,
	viewMode,
	appView,
	plStatuses,
	atsStatuses,
	milestoneMarkers,
	setCurrentMember,
	mapNPOsToMember,
	setActive,
}: IProps) {
	const match = useRouteMatch();
	const history = useHistory();

	const [memberStatuses, setMemberStatuses] = useState<FixMe>([]);
	const [locations, setLocations] = useState([]);
	const [memberTypes, setMemberTypes] = useState([]);
	const [localAppStates, setLocalAppStates] = useState<ReportingAPI.PrimaryCompanyData | undefined>(appState);
	const [searchKey, setSearchKey] = useState('');
	const [searchTmpKey, setSearchTmpKey] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [selectedType, setSelectedType] = useState(0);
	const [selectedTerm, setSelectedTerm] = useState('');
	const [selectedIsAlumni, setSelectedIsAlumni] = useState(0);
	const [pipelines, setPipelines] = useState<FixMe>([]);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const [isLoadingGoogleSheet, setIsLoadingGoogleSheet] = useState(false);
	const [filterOptions, setFilterOptions] = useState<string>('');
	const [openMemberFilters, setOpenMemberFilters] = useState(false);
	const [dropdownIsOpen, setDropdownIsOpen] = useState<string>('');
	const [licenses, setLicenses] = useState<GroupObj[]>([]);
	const [links, setLinks] = useState<GroupObj[]>([]);
	const [roles, setRoles] = useState<GroupObj[]>([]);
	const [groups, setGroups] = useState<GroupObj[]>([]);
	const [searchIsLoading, setSearchIsLoading] = useState<boolean>(false);
	const [cohortTypeStats, setCohortTypeStats] = useState<any>({});
	const [advancedFilters, setAdvancedFilters] = useState<any>(() => {
		const cached_filters = JSON.parse(localStorage.getItem('user_pipeline_filter--data') as string);
		return cached_filters && cached_filters['employment'] && cached_filters['allocation']
			? {
				employment: { ...cached_filters['employment'] },
				allocation: { ...cached_filters['allocation'] },
			}
			: {
				allocation: {
					discretionary: true,
					licensed: true,
					unlicensed: true,
					disabled: true,
				},
				employment: {
					alumni: true,
					employees: true,
				},
			};
	});
	const [selectedFilters, setSelectedFilters] = useState<any>({
		active_queue: {
			34: true,
			38: true,
			42: true,
			1010: true,
			1011: true,
		},
		dormant_queue: {
			46: true,
			50: true,
			64: true,
		},
		open_applications: {
			1001: true,
			1002: true,
			1003: true,
		},
		closed_applications: {
			1004: true,
			1005: true,
			1006: true,
		},
		matched_by_cariclub: {
			1: true,
			5: true,
			9: true,
			25: true,
		},
	});
	const [filteredMembers, setFilteredMembers] = useState<ReportingAPI.MemberInsight[] | undefined>([]);
	// const [version, setVersion] = useState(0);
	const [timeouts, setTimeouts] = useState<any[]>([]);
	const [memberInfos, setMemberInfos] = useState<{ role_id: number; license_id: number; link_id: number }>({
		role_id: -1,
		license_id: -1,
		link_id: -1,
	});

	const clientViewAvailable = (member: any) => {
		return (((member.cariclub_role != 3 && member.candidate_license == 4) || ([65, 66, 71].includes(member.userpipeline_status))) || ([27, 28].includes(member.pp_id))) ? true : false;
	}

	const ctypes = ['CariClub', 'Universal', 'Global'];

	const cc_token: any = localStorage.getItem('cc_token');
	let _cc_token: any = null;
	if (cc_token !== null) {
		_cc_token = JSON.parse(cc_token);
	}

	const versionRef = useRef(0);
	const headerCheckboxes = useRef<any>(null);
	headerCheckboxes.current = [];

	let param = useParams();

	useEffect(() => {
		/* License IDs
1 - prime
2 - active
3 - latent
4 - disable
5 - waitlist
6 - pause
*/
		fetchMembers();
	}, [localAppStates, advancedFilters]);

	const fetchMembers = () => {
		if (localAppStates) {
			if (localAppStates.members) {
				let helper = localAppStates.members;

				// if (advancedFilters['engagement']['active'] && advancedFilters['engagement']['dormant']) {
				//     helper = helper.filter(
				//         (member: ReportingAPI.MemberInsight) =>
				//             [2, 3, 6].includes(member.candidate_license as number) && member.cariclub_role !== 3,
				//     );
				// } else {
				//     if (advancedFilters['engagement']['active']) {
				//         helper = helper.filter(
				//             (member: ReportingAPI.MemberInsight) =>
				//                 [2].includes(member.candidate_license as number) && member.cariclub_role !== 3,
				//         );
				//     } else {
				//         helper = helper.filter(
				//             (member: ReportingAPI.MemberInsight) => ![2].includes(member.candidate_license as number),
				//         );
				//     }
				//     if (advancedFilters['engagement']['dormant']) {
				//         helper = helper.filter(
				//             (member: ReportingAPI.MemberInsight) =>
				//                 [3, 6].includes(member.candidate_license as number) && member.cariclub_role !== 3,
				//         );
				//     } else {
				//         helper = helper.filter(
				//             (member: ReportingAPI.MemberInsight) =>
				//                 ![3, 6].includes(member.candidate_license as number),
				//         );
				//     }
				// }

				if (
					advancedFilters['allocation']['discretionary'] &&
					advancedFilters['allocation']['licensed'] &&
					advancedFilters['allocation']['unlicensed'] &&
					advancedFilters['allocation']['disabled']
				) {
					helper = helper.filter((member: ReportingAPI.MemberInsight) =>
						[1, 4, 5, 2, 3, 6, 7, 8, 9].includes(member.candidate_license as number),
					);
				} else {
					if (advancedFilters['allocation']['discretionary']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[1, 7].includes(member.candidate_license as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) => ![1, 7].includes(member.candidate_license as number),
						);
					}
					if (advancedFilters['allocation']['licensed']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[2, 9].includes(member.candidate_license as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) =>
								![2, 9].includes(member.candidate_license as number),
						);
					}
					if (advancedFilters['allocation']['unlicensed']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[8, 5, 10].includes(member.candidate_license as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) =>
								![8, 5, 10].includes(member.candidate_license as number),
						);
					}
					if (advancedFilters['allocation']['disabled']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[3, 4, 6].includes(member.candidate_license as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) => ![3, 4, 6].includes(member.candidate_license as number),
						);
					}
				}

				if (advancedFilters['employment']['employees'] && advancedFilters['employment']['alumni']) {
					helper = helper.filter((member: ReportingAPI.MemberInsight) =>
						[2, 4].includes(member.priviledge_term as number),
					);
				} else {
					if (advancedFilters['employment']['employees']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[2].includes(member.priviledge_term as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) => ![2].includes(member.priviledge_term as number),
						);
					}
					if (advancedFilters['employment']['alumni']) {
						helper = helper.filter((member: ReportingAPI.MemberInsight) =>
							[4].includes(member.priviledge_term as number),
						);
					} else {
						helper = helper.filter(
							(member: ReportingAPI.MemberInsight) => ![4].includes(member.priviledge_term as number),
						);
					}
				}

				// check if all cohorts are checked, if yes, show all members even have not any cohorts.
				// if no, then show only members who has selected cohorts
				var is_all_checked: boolean = true as boolean;
				Object.keys(advancedFilters).forEach((parent) => {
					if (parent !== 'allocation' && parent !== 'employment') {
						// for cohorts, parent => cohort type name
						if (
							Object.keys(advancedFilters[parent]).filter(
								(children) => advancedFilters[parent][children] === true,
							).length !== Object.keys(advancedFilters[parent]).length
						) {
							is_all_checked = false;
						}
					}
				});
				if (is_all_checked === false) {
					let selectedGroups: number[] = [];
					Object.keys(advancedFilters).forEach((parent) => {
						if (parent !== 'allocation' && parent !== 'employment') {
							Object.keys(advancedFilters[parent]).forEach((children) => {
								if (advancedFilters[parent][children] === true) {
									selectedGroups.push(
										groups.filter(
											(group) =>
												group.name.toLowerCase() === children.toLowerCase() &&
												group.type_name.toLocaleLowerCase() === parent.toLowerCase(),
										)[0]?.id,
									);
								}
							});
						}
					});

					helper = helper.filter((member: ReportingAPI.MemberInsight) => {
						if (!member.groups) return false;
						var _groups = JSON.parse(member.groups);
						if (
							selectedGroups.length > 0 &&
							_groups.filter((g_id: number) => selectedGroups.indexOf(g_id) > -1).length > 0
						) {
							return true;
						} else {
							return false;
						}
					});
				}

				const allChecked = Object.keys(advancedFilters).map((parent) => {
					return (
						Object.keys(advancedFilters[parent]).filter((children) => {
							return advancedFilters[parent][children] === true;
						}).length === Object.keys(advancedFilters[parent]).length
					);
				});

				if (allChecked.filter((b) => b).length === Object.keys(advancedFilters).length) {
					helper = localAppStates.members;
					localStorage.setItem('all_click_tracker--pipeline', 'false');
				} else if (allChecked.filter((b) => !b).length === Object.keys(advancedFilters).length) {
					localStorage.setItem('all_click_tracker--pipeline', 'true');
				}
				setFilteredMembers(helper);
			}
		}
	};

	const matchMembersToPipelineStatus = (topLevel: any) => {
		if (!filteredMembers || filterMembers.length === 0) return topLevel;

		let members = filteredMembers?.filter((member: ReportingAPI.MemberInsight) => {
			return selectedLocation.toLowerCase() === 'all'
				? (member.first_name + ' ' + member.last_name).toLowerCase().includes(searchKey.toLowerCase())
				: (member.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
					selectedLocation.toLowerCase().includes(member.city?.toLowerCase() as string)) &&
				(member.first_name + ' ' + member.last_name).toLowerCase().includes(searchKey.toLowerCase());
		});
		if (members && members.length > 0) {
			for (let key1 in members) {
				let member_pps: Array<any> = members[key1].pipeline_statuses;
				if (member_pps && member_pps.length > 0) {
					for (let key2 in member_pps) {
						for (let key in topLevel) {
							for (let key3 in topLevel[key].sub_statuses) {
								if (parseInt(topLevel[key].sub_statuses[key3].id) < 1000) { // not applied
									if ((member_pps[key2].is_app != 0 || member_pps[key2].ats_stage != 0)) {
										let all_levels = topLevel[key].sub_statuses[key3].all_levels;
										let filtered = all_levels.filter((el: any) => el.id == member_pps[key2].pps_id);
										if (filtered.length > 0) {
											let f_member = { ...members[key1] };
											f_member.pp_status = filtered[0].name;
											f_member.pp_id = filtered[0].id;
											f_member.pp_obj = member_pps[key2];
											topLevel[key].sub_statuses[key3].members.push(f_member);
										}
									}
								} else if (parseInt(topLevel[key].sub_statuses[key3].id) == 1002) {
									// Received
									let pps = getUserPipelineStatus(32);
									if (member_pps[key2].pps_id == 32) {
										// 32 = Connecting/Received
										let f_member = { ...members[key1] };
										f_member.pp_status = pps.position;
										f_member.pp_id = pps.pps_id;
										f_member.pp_obj = member_pps[key2];
										f_member.pp_progress = pps.progress;
										topLevel[key].sub_statuses[key3].members.push(f_member);
									}
								} else if (parseInt(topLevel[key].sub_statuses[key3].id) > 1009) {
									//for Queue & Enrolled MilestoneMarker
									if ((member_pps[key2].is_app == 0 && member_pps[key2].ats_stage == 0)) {
										let all_levels = topLevel[key].sub_statuses[key3].all_levels;

										let filtered = all_levels.filter((el: any) => el.id == member_pps[key2].pps_id);
										if (filtered.length > 0) {
											let f_member = { ...members[key1] };
											f_member.pp_status = filtered[0].name;
											f_member.pp_id = filtered[0].id;
											f_member.pp_obj = member_pps[key2];
											topLevel[key].sub_statuses[key3].members.push(f_member);
										}
									}
								} else { // for Applied
									let all_ats_levels = topLevel[key].sub_statuses[key3].all_levels;
									let filtered = all_ats_levels.filter((el: any) => el == member_pps[key2].ats_stage);
									let pps = getUserPipelineStatus(member_pps[key2].pps_id);
									if (filtered.length > 0 && topLevel[key].sub_ids.indexOf(pps.pps_parent_id) > -1) {
										let f_member = { ...members[key1] };
										f_member.pp_status = pps.position;
										f_member.pp_progress = pps.progress;
										f_member.pp_id = pps.pps_id;
										f_member.pp_obj = member_pps[key2];
										topLevel[key].sub_statuses[key3].members.push(f_member);
									}
								}
							}
						}
					}
				}
			}
		}
		for (let key in topLevel) {
			for (let key3 in topLevel[key].sub_statuses) {
				topLevel[key].sub_statuses[key3].members.sort(
					(a: ReportingAPI.MemberInsight, b: ReportingAPI.MemberInsight) => {
						if (a.pp_id === b.pp_id) {
							if (a.first_name === b.first_name) {
								return a.last_name > b.last_name ? 1 : b.last_name > a.last_name ? -1 : 0;
							}
							return a.first_name > b.first_name ? 1 : b.first_name > a.first_name ? -1 : 0;
						}
						return a.pp_id - b.pp_id;
					},
				);
			}
		}
		return topLevel;
	};

	const handleFilterOpen = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	// useEffect(() => {
	//     if (appState && appState.company) {
	//         const fetchGroups = async () => {
	//             let res = await getGroups(appState.company.org_key, viewMode, 1);
	//             setGroups([...res]);
	//             const cached_filters = JSON.parse(localStorage.getItem('user_pipeline_filter--data') as string);
	//             let _temp = { ...advancedFilters };
	//             let ct_stats = { ...cohortTypeStats };
	//             if (res && res.length) {
	//                 res.forEach((group: GroupObj) => {
	//                     if (_temp[`${group.type_name}`]) {
	//                         if (
	//                             cached_filters[`${group.type_name}`] &&
	//                             cached_filters[`${group.type_name}`][`${group.name}`] !== undefined
	//                         ) {
	//                             _temp[`${group.type_name}`][`${group.name}`] =
	//                                 cached_filters[`${group.type_name}`][`${group.name}`];
	//                         } else {
	//                             _temp[`${group.type_name}`][`${group.name}`] = true;
	//                         }
	//                     } else {
	//                         _temp[`${group.type_name}`] = {};
	//                         if (
	//                             cached_filters[`${group.type_name}`] &&
	//                             cached_filters[`${group.type_name}`][`${group.name}`] !== undefined
	//                         ) {
	//                             _temp[`${group.type_name}`][`${group.name}`] =
	//                                 cached_filters[`${group.type_name}`][`${group.name}`];
	//                         } else {
	//                             _temp[`${group.type_name}`][`${group.name}`] = true;
	//                         }
	//                     }
	//                     if (ct_stats[`${group.type_name}`]) {
	//                         ct_stats[`${group.type_name}`].type = group.type_type;
	//                         ct_stats[`${group.type_name}`].primary = group.type_is_primary;
	//                     } else {
	//                         ct_stats[`${group.type_name}`] = {};
	//                         ct_stats[`${group.type_name}`].type = group.type_type;
	//                         ct_stats[`${group.type_name}`].primary = group.type_is_primary;
	//                     }
	//                 });
	//             }
	//             setCohortTypeStats({ ...ct_stats });
	//             setAdvancedFilters({ ..._temp });
	//         };

	//         const fetchCandidateLicenses = async () => {
	//             let res = await getCandidateLicenses();
	//             setLicenses(res);
	//         };

	//         const fetchLinks = async () => {
	//             let res = await getLicenseTerms();
	//             let helper: GroupObj[] = res.filter(
	//                 (res: GroupObj) =>
	//                     !['employee', 'alumni', 'disavowed'].includes((res.name as string).toLowerCase()),
	//             );
	//             helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'employee')[0]);
	//             helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'alumni')[0]);
	//             setLinks(helper);
	//         };

	//         const fetchCariclubRoles = async () => {
	//             let res = await getCariclubRoles();
	//             setRoles(res);
	//         };

	//         fetchGroups();
	//         fetchCariclubRoles();
	//         fetchLinks();
	//         fetchCandidateLicenses();
	//     }
	// }, [appState, viewMode]);

	const fetchData = async (
		location: string,
		term: string,
		type: number,
		key: string,
		v: number,
		is_alumni: number,
	) => {
		setSearchIsLoading(true);
		if (appState && appState.company && plStatuses.length > 0) {
			let company_members: any = await getCompanyData(
				appState.company.org_key,
				appState.company.org_name,
				key,
				location,
				term,
				type,
				undefined,
				viewMode,
				is_alumni,
			);
			setLocalAppStates(company_members);
			// if (v === versionRef.current) {

			setSearchIsLoading(false);
			// }
		}
	};

	useEffect(() => {
		if (localAppStates && localAppStates.company) {
			const fetchGroups = async () => {
				let res = await getGroups(localAppStates.company.org_key, viewMode, 1);
				setGroups([...res]);
				const cached_filters = JSON.parse(localStorage.getItem('user_pipeline_filter--data') as string);
				let _temp = { ...advancedFilters };
				let ct_stats = { ...cohortTypeStats };
				if (res && res.length) {
					res.forEach((group: GroupObj) => {
						if (_temp[`${group.type_name}`]) {
							if (
								cached_filters &&
								cached_filters[`${group.type_name}`] &&
								cached_filters[`${group.type_name}`][`${group.name}`] !== undefined
							) {
								_temp[`${group.type_name}`][`${group.name}`] =
									cached_filters[`${group.type_name}`][`${group.name}`];
							} else {
								_temp[`${group.type_name}`][`${group.name}`] = true;
							}
						} else {
							_temp[`${group.type_name}`] = {};
							if (
								cached_filters &&
								cached_filters[`${group.type_name}`] &&
								cached_filters[`${group.type_name}`][`${group.name}`] !== undefined
							) {
								_temp[`${group.type_name}`][`${group.name}`] =
									cached_filters[`${group.type_name}`][`${group.name}`];
							} else {
								_temp[`${group.type_name}`][`${group.name}`] = true;
							}
						}
						if (ct_stats[`${group.type_name}`]) {
							ct_stats[`${group.type_name}`].type = group.type_type;
							ct_stats[`${group.type_name}`].primary = group.type_is_primary;
						} else {
							ct_stats[`${group.type_name}`] = {};
							ct_stats[`${group.type_name}`].type = group.type_type;
							ct_stats[`${group.type_name}`].primary = group.type_is_primary;
						}
					});
				}
				setCohortTypeStats({ ...ct_stats });
				setAdvancedFilters({ ..._temp });
			};

			const fetchCandidateLicenses = async () => {
				let res = await getCandidateLicenses();
				setLicenses(res);
			};

			const fetchLinks = async () => {
				let res = await getLicenseTerms();
				let helper: GroupObj[] = res.filter(
					(res: GroupObj) =>
						!['employee', 'alumni', 'disavowed'].includes((res.name as string).toLowerCase()),
				);
				helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'employee')[0]);
				helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'alumni')[0]);
				setLinks(helper);
			};

			const fetchCariclubRoles = async () => {
				let res = await getCariclubRoles();
				setRoles(res);
			};

			// const fetchLocations = async () => {
			//     let locs = await getLocations(appState.company.org_key);
			//     setLocations(locs);
			// };

			// fetchData(selectedLocation, selectedTerm, selectedType, searchKey);
			// fetchLocations();
			fetchGroups();
			fetchCariclubRoles();
			fetchLinks();
			fetchCandidateLicenses();

			// let pipeline_location = '';
			// if (localStorage.getItem('pipeline_location') != null) {
			// 	pipeline_location = localStorage.getItem('pipeline_location') || '';
			// }
			// let pipeline_term = '';
			// if (localStorage.getItem('pipeline_term') != null) {
			// 	pipeline_term = localStorage.getItem('pipeline_term') || '';
			// }

			// let pipeline_type = 0;
			// if (localStorage.getItem('pipeline_type') != null) {
			// 	pipeline_type = parseInt(localStorage.getItem('pipeline_type') || '0');
			// }

			// let pipeline_search = '';
			// if (localStorage.getItem('pipeline_search') != null) {
			// 	pipeline_search = localStorage.getItem('pipeline_search') || '';
			// }

			// setSelectedLocation(pipeline_location);
			// setSelectedTerm(pipeline_term);
			// setSelectedType(pipeline_type);
			// setSearchKey(pipeline_search);
			// setSearchTmpKey(pipeline_search);

			// if (pipeline_location !== '' || pipeline_term !== '' || pipeline_type !== 0 || pipeline_search !== '') {
			// 	setIsFilterOpen(true);
			// }
		} else {
			history.push('/');
		}
	}, [localAppStates, plStatuses, appView, viewMode]);

	useEffect(() => {
		let topLevels = [
			{
				name: 'Queue',
				sub_ids: [34, 38, 42, 46, 50, 64],
				sub_statuses: [],
			},
			{
				name: 'Applied',
				sub_ids: [25, 29, 30, 74],
				sub_statuses: [],
			},
			{
				name: 'Matched',
				sub_ids: [1, 5, 9, 25],
				sub_statuses: [],
			} /*
								{
										name: 'floaters',
										sub_ids: [58, 61, 64],
										sub_statuses: []
								},*/,
		];
		// let pls = plStatuses.filter((el: any) => el.parent_id === null);
		for (let key in topLevels) {
			if (topLevels[key].name == 'Queue') {
				let sub_statuses = plStatuses.filter((el: any) => topLevels[key].sub_ids.indexOf(el.id) > -1);
				// filter members for top level pipeline statuses
				let all_levels = [];
				for (let key1 in sub_statuses) {
					//filter members for child pipeline statues
					all_levels = plStatuses.filter((el: any) => el.parent_id == sub_statuses[key1].id);
					all_levels.push(sub_statuses[key1]);

					// let sub_members = filterMembers(child_ids, appState, plStatuses);
					sub_statuses[key1].members = [];
					sub_statuses[key1].is_open = false;
					sub_statuses[key1].all_levels = all_levels;
				}
				//9, 13 are for MilestoneMarkers 
				sub_statuses.push({
					id: 1010,
					name: 'Guided',
					members: [],
					is_open: true,
					all_levels: [{
						id: 10,
						name: 'Recommendation',
					},
					{
						id: 11,
						name: 'Evaluation',
					},
					{
						id: 12,
						name: 'Registration',
					}] //MilestoneMarkers, hard coded
				})
				sub_statuses.push({
					id: 1011,
					name: 'Queued',
					members: [],
					is_open: true,
					all_levels: [{
						id: 14,
						name: 'Exploration',
					},
					{
						id: 15,
						name: 'Activation',
					},
					{
						id: 16,
						name: 'Invitation',
					}] //MilestoneMarkers, hard coded
				})
				topLevels[key].sub_statuses = sub_statuses;
			} else if (topLevels[key].name == 'Matched') {
				let sub_statuses = plStatuses.filter((el: any) => topLevels[key].sub_ids.indexOf(el.id) > -1);
				// filter members for top level pipeline statuses
				let all_levels = [];
				for (let key1 in sub_statuses) {
					//filter members for child pipeline statues
					all_levels = plStatuses.filter((el: any) => el.parent_id == sub_statuses[key1].id);
					all_levels.push(sub_statuses[key1]);

					// let sub_members = filterMembers(child_ids, appState, plStatuses);
					sub_statuses[key1].members = [];
					sub_statuses[key1].is_open = false;
					sub_statuses[key1].all_levels = all_levels;
				}
				topLevels[key].sub_statuses = sub_statuses;
			}
			else if (topLevels[key].name == 'Applied') {
				// for Applied, we need custom fetching/filtering
				let sub_statuses: any = [
					{
						id: 1001,
						name: 'Connected',
						members: [],
						is_open: false,
						all_levels: [7, 8]
					},
					{
						id: 1002,
						name: 'Received',
						members: [],
						is_open: true,
						all_levels: []
					},
					{
						id: 1003,
						name: 'Submitted',
						members: [],
						is_open: true,
						all_levels: [1]
					},
					{
						id: 1004,
						name: 'Approved',
						members: [],
						is_open: true,
						all_levels: [6]
					},
					{
						id: 1005,
						name: 'Declined',
						members: [],
						is_open: true,
						all_levels: [4, 9]
					},
					{
						id: 1006,
						name: 'Withdrew',
						members: [],
						is_open: true,
						all_levels: [5]
					}
				];
				topLevels[key].sub_statuses = sub_statuses;
			}
		}
		// fetchMembers();
		topLevels = matchMembersToPipelineStatus(topLevels);
		setPipelines(topLevels);
	}, [filteredMembers, plStatuses])

	const fetchLocations = () => {
		const tmp: string[] = [];
		localAppStates?.members?.map((v) => {
			if (tmp.indexOf(v.city || '') === -1 && v.city) tmp.push(v.city);
		});
		return tmp;
	};

	useEffect(() => {
		versionRef.current = versionRef.current + 1;
		fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
	}, [
		selectedLocation,
		selectedTerm,
		selectedType,
		searchKey,
		viewMode,
		selectedIsAlumni
	]);

	const addToRefs = (el: any) => {
		if (el && !headerCheckboxes.current.includes(el)) headerCheckboxes.current.push(el);
	};

	useEffect(() => {
		headerCheckboxes.current.map((current: HTMLInputElement) => {
			if (current.classList.contains('isIndeterminate')) {
				current.indeterminate = true;
			} else {
				current.indeterminate = false;
			}
		});
	}, [selectedFilters, addToRefs]);

	const navigateToMember = async (url: string, member: ReportingAPI.MemberInsight) => {
		if (!localAppStates) {
			history.push('/');
		} else {
			const formattedMemberDetails = await mapNPOsToMember(member, localAppStates.nonprofits);
			setCurrentMember(formattedMemberDetails);
			// localStorage.setItem('previousPage', "pipeline")
			history.push(`${url}/${member.key}`);
		}
	};

	const handleImgLoadError = (e: any) => {
		// return <ProfileImg src={defaultProfileImg} style={{ width: "200px" }} />
		e.target.src = defaultProfileImg;
		e.target.onerror = null;
	};

	const exportMembers = async () => {
		if (localAppStates && localAppStates.company) {
			setIsLoadingGoogleSheet(true);
			await getMembersForExport(
				localAppStates.company.org_key
				// searchKey,
				// selectedLocation,
				// selectedTerm,
				// selectedType,
				// undefined,
				// viewMode,
				// selectedIsAlumni,
			);
			setIsLoadingGoogleSheet(false);
		}
	};

	const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const type_key: number = parseInt(event.target.value);
		localStorage.setItem('pipeline_type', `${type_key}`);
		setSelectedType(type_key);
	};

	const handleLocationChange = (e: any) => {
		const location = e.target.value;
		setSelectedLocation(location);
	};

	const handleMenuDropdown = React.useCallback(async (id: string) => {
		if (id === dropdownIsOpen) {
			setDropdownIsOpen('');
			setMemberInfos({ role_id: -1, license_id: -1, link_id: -1 });
		} else {
			const memberKey: string = id.split('_')[3];
			if (memberKey) {
				const member = await localAppStates?.members.filter(
					(member: ReportingAPI.MemberInsight) => member.key === memberKey,
				)[0];

				if (member) {
					const infos = {
						role_id: member.cariclub_role as number,
						license_id: member.candidate_license as number,
						link_id: member.priviledge_term as number,
					};
					setMemberInfos(infos);
					setDropdownIsOpen(id);
				}
			}
		}
	}, []);
	const handleTermChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const term: string = event.target.value;
		localStorage.setItem('pipeline_term', term);
		setSelectedTerm(term);
	};

	const handleAlumniFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const key: number = parseInt(event.target.value);
		setSelectedIsAlumni(key);
	};
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const key: string = (event.target as HTMLInputElement).value;
		setSearchTmpKey(key);
	};

	const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key == 'Enter') {
			setSearchKey(searchTmpKey.trim());
		}
	};

	const toggleSubStatus = (topLevelIndex: number, subLevelIndex: number) => {
		let new_statuses = [...pipelines];
		new_statuses[topLevelIndex].sub_statuses[subLevelIndex].is_open =
			!new_statuses[topLevelIndex].sub_statuses[subLevelIndex].is_open;
		setPipelines(new_statuses);
	};
	const getTotalPipeUser = (pipe: any) => {
		let tmp = 0;
		pipe.map((s: any) => {
			if (
				Object.keys(selectedFilters).filter(
					(parent: string) =>
						Object.keys(selectedFilters[parent]).filter(
							(children) => children == s.id && selectedFilters[parent][children] === true,
						).length > 0,
				).length > 0
			) {
				tmp += s.members.length;
			}
		});

		return tmp;
	};

	const handleCategoryClick = (event: React.MouseEvent, target: string) => {
		event.preventDefault();
		if (event.currentTarget) {
			if (filterOptions === target) setFilterOptions('');
			else setFilterOptions(target);
		}
	};

	const getUserPipelineStatus = (userpipeline_status: number) => {
		let names = {
			'position': '',
			'stage': '',
			'pps_id': userpipeline_status,
			'pps_parent_id': null,
			'progress': '',
			'description': '',
		}
		let status = plStatuses.filter((el: any) => { return el.id === userpipeline_status; })
		if (status.length > 0) {
			status = status[0];
			names.position = status.name;
			names.progress = status.progress;
			names.description = status.descriptoin;
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

	const getUserMMStatus = (mm_id: number) => {
		let names = {
			'position': '',
			'stage': '',
			'description': '',
			'progress': '',
		}
		let status = milestoneMarkers.filter((el: any) => { return el.id === mm_id; })
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
	const handleFilterSelection = (event: React.SyntheticEvent, target: number = 0, parent: string) => {
		const newParentName = parent.toLowerCase().replace(/\s+/g, '_');
		let filterObject = selectedFilters[newParentName];
		if (target !== 0) {
			filterObject[target] = !filterObject[target];
			const parentCheckbox: HTMLInputElement = (
				event.target as HTMLElement
			)?.parentElement?.parentElement?.parentElement?.querySelectorAll('input')[0] as HTMLInputElement;
			if (
				Object.keys(filterObject).filter((key) => filterObject[key] === true).length <
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = true;
			} else if (
				Object.keys(filterObject).filter((key) => filterObject[key] === true).length ===
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = false;
			}
			if (
				Object.keys(filterObject).filter((key) => filterObject[key] === false).length ===
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = false;
				parentCheckbox.checked = false;
			}
		} else {
			if (Object.keys(filterObject).filter((key) => filterObject[key] === true).length > 2) {
				Object.keys(filterObject).map((key) => {
					filterObject[key] = false;
				});
			} else {
				Object.keys(filterObject).map((key) => {
					filterObject[key] = true;
				});
			}
		}
		setSelectedFilters({ ...selectedFilters, [newParentName]: { ...filterObject } });
	};

	const formatFilterKey = (key: string) => key.toLowerCase().replace('-', '').replace(/\s+/g, '_');

	const groupedFilters = [
		{
			parent: 'Queue',
			label: 'Active Queue',
			ids: [34, 38, 42, 1010, 1011],
		},
		{
			parent: 'Queue',
			label: 'Dormant Queue',
			ids: [46, 50, 64],
		},
		{
			parent: 'Applied',
			label: 'Open Applications',
			ids: [1001, 1002, 1003]
		},
		{
			parent: 'Applied',
			label: 'Closed Applications',
			ids: [1004, 1005, 1006]
		},
		{
			parent: 'Matched',
			label: 'Matched by CariClub',
			ids: [1, 5, 9, 25],
		},
	];

	const _handleFilterSelection = (
		event: React.SyntheticEvent,
		target: string,
		parent: string,
		is_cohort?: boolean,
	) => {
		let filterObject = advancedFilters[parent];
		if (target.length > 0) {
			filterObject[target] = !filterObject[target];
			const parentCheckbox: HTMLInputElement = (
				event.target as HTMLElement
			)?.parentElement?.parentElement?.parentElement?.querySelectorAll('input')[0] as HTMLInputElement;
			if (
				Object.keys(filterObject).filter((key) => filterObject[key] === true).length <
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = true;
			} else if (
				Object.keys(filterObject).filter((key) => filterObject[key] === true).length ===
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = false;
			}
			if (
				Object.keys(filterObject).filter((key) => filterObject[key] === false).length ===
				Object.keys(filterObject).length
			) {
				parentCheckbox.indeterminate = false;
				parentCheckbox.checked = false;
			}
		} else if (target === '') {
			if (Object.keys(filterObject).filter((key) => filterObject[key] === true).length > 0) {
				Object.keys(filterObject).map((key) => {
					filterObject[key] = false;
				});
			} else {
				Object.keys(filterObject).map((key) => {
					filterObject[key] = true;
				});
			}
		}
		setAdvancedFilters({ ...advancedFilters, [parent]: { ...filterObject } });
		localStorage.setItem('user_pipeline_filter--data', JSON.stringify(advancedFilters));
	};

	const headerCheckboxEventHandler = (groupName: string) => {
		const substatuses = [].concat.apply(
			[],
			groupedFilters
				.filter((g) => g.parent.toLowerCase() === groupName)
				.map((_g) =>
					Object.keys(selectedFilters[formatFilterKey(_g.label)]).filter(
						(children) =>
							selectedFilters[formatFilterKey(_g.label)][children] === true ||
							selectedFilters[formatFilterKey(_g.label)][children] === false,
					),
				) as unknown as ConcatArray<never>[],
		);
		const checkedSubstatuses = [].concat.apply(
			[],
			groupedFilters
				.filter((g) => g.parent.toLowerCase() === groupName)
				.map((_g) =>
					Object.keys(selectedFilters[formatFilterKey(_g.label)]).filter(
						(children) => selectedFilters[formatFilterKey(_g.label)][children] === true,
					),
				) as unknown as ConcatArray<never>[],
		);

		const _keys = [].concat.apply(
			[],
			groupedFilters
				.filter((g) => g.parent.toLowerCase() === groupName)
				.map((_g) => formatFilterKey(_g.label)) as unknown as ConcatArray<never>[],
		);

		const tempFilters = _keys.map((k) => ({ [k]: selectedFilters[k] }));

		if (substatuses.length > checkedSubstatuses.length) {
			let filters: any = {};
			tempFilters.map((filter) => {
				filters = { ...filters, ...filter };
			});

			Object.keys(filters).map((temp) =>
				Object.keys(filters[temp]).map((child) => {
					filters[temp][child] = true;
				}),
			);

			setSelectedFilters({ ...selectedFilters, ...filters });
		} else {
			let filters: any = {};
			tempFilters.map((filter) => {
				filters = { ...filters, ...filter };
			});

			Object.keys(filters).map((temp) =>
				Object.keys(filters[temp]).map((child) => {
					filters[temp][child] = false;
				}),
			);

			setSelectedFilters({ ...selectedFilters, ...filters });
		}
	};

	const handleUpdateLicense = async (e: React.SyntheticEvent, licenseKey: number, memberKey: string) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the member's license?",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure) {
				if (localAppStates?.members && localAppStates.members.length > 0) {
					const member = localAppStates.members.filter(
						(member: ReportingAPI.MemberInsight) => member.key === memberKey,
					)[0];
					if (member) {
						let values = {
							member_key: member.key,
							candidate_license: licenseKey,
							first_name: member.first_name,
							last_name: member.last_name,
							work_email: member.work_email,
							work_phone: member.work_phone,
							department: member.department_key,
							company_key: member.org_key,
							license_term: member.priviledge_term,
							city_key: 'null',
							location_key: 'null',
							cariclub_role: member.cariclub_role,
							// clubs: clubs,
							permissions: null,
						};

						const res = await updateUser(values);
						if (res.code !== 'c74') {
							fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
						} else {
							swal({
								title: 'Success',
								text: 'User has been updated successfully',
								icon: 'success',
								buttons: [false, true],
							}).then(() => {
								setDropdownIsOpen('');
								fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
							});
						}
					}
				}
			} else {
				setDropdownIsOpen('');
				return false;
			}
		});
	};
	const handleUpdateLink = async (e: React.SyntheticEvent, orgLink: number, memberKey: string) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the member's employment status?",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure) {
				if (localAppStates?.members && localAppStates.members.length > 0) {
					const member = localAppStates.members.filter(
						(member: ReportingAPI.MemberInsight) => member.key === memberKey,
					)[0];
					if (member) {
						let values = {
							member_key: member.key,
							license_term: orgLink,
							candidate_license: member.candidate_license,
							first_name: member.first_name,
							last_name: member.last_name,
							work_email: member.work_email,
							work_phone: member.work_phone,
							department: member.department_key,
							company_key: member.org_key,
							city_key: 'null',
							location_key: 'null',
							cariclub_role: member.cariclub_role,
							// clubs: clubs,
							permissions: null,
						};

						const res = await updateUser(values);
						if (res.code !== 'c74') {
							fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
						} else {
							swal({
								title: 'Success',
								text: 'User has been updated successfully',
								icon: 'success',
								buttons: [false, true],
							}).then(() => {
								setDropdownIsOpen('');
								fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
							});
						}
					}
				}
			} else {
				setDropdownIsOpen('');
				return false;
			}
		});
	};
	const handleUpdateRole = async (e: React.SyntheticEvent, roleKey: number, memberKey: string) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the member's role?",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure) {
				if (localAppStates?.members && localAppStates.members.length > 0) {
					const member = localAppStates.members.filter(
						(member: ReportingAPI.MemberInsight) => member.key === memberKey,
					)[0];
					if (member) {
						let values = {
							member_key: member.key,
							license_term: member.priviledge_term,
							candidate_license: member.candidate_license,
							first_name: member.first_name,
							last_name: member.last_name,
							work_email: member.work_email,
							work_phone: member.work_phone,
							department: member.department_key,
							company_key: member.org_key,
							city_key: 'null',
							location_key: 'null',
							cariclub_role: roleKey,
							// clubs: clubs,
							permissions: null,
						};

						const res = await updateUser(values);
						if (res.code !== 'c74') {
							fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
						} else {
							swal({
								title: 'Success',
								text: 'User has been updated successfully',
								icon: 'success',
								buttons: [false, true],
							}).then(() => {
								setDropdownIsOpen('');
								fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
							});
						}
					}
				}
			} else {
				setDropdownIsOpen('');
				return false;
			}
		});
	};

	const handleUpdateGroup = async (e: React.SyntheticEvent, groups: any[], memberKey: string) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the member's cohorts?",
			icon: 'warning',
			buttons: [true, 'Confirm'],
		}).then(async (sure) => {
			if (sure) {
				if (localAppStates?.members && localAppStates.members.length > 0) {
					const member = localAppStates.members.filter(
						(member: ReportingAPI.MemberInsight) => member.key === memberKey,
					)[0];
					if (member) {
						let values = {
							member_key: member.key,
							license_term: member.priviledge_term,
							candidate_license: member.candidate_license,
							first_name: member.first_name,
							last_name: member.last_name,
							work_email: member.work_email,
							work_phone: member.work_phone,
							department: member.department_key,
							company_key: member.org_key,
							city_key: 'null',
							location_key: 'null',
							cariclub_role: member.cariclub_role,
							// clubs: clubs,
							permissions: null,
							groups: `[${groups.toString()}]`,
						};

						const res = await updateUser(values);
						if (res.code !== 'c74') {
							fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
						} else {
							swal({
								title: 'Success',
								text: 'User has been updated successfully',
								icon: 'success',
								buttons: [false, true],
							}).then(() => {
								setDropdownIsOpen('');
								fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
							});
						}
					}
				}
			} else {
				setDropdownIsOpen('');
				return false;
			}
		});
	};

	function handleGroupSelection(e: React.SyntheticEvent, id: number, memberKey: string) {
		const target = e.target as HTMLInputElement;
		const member = localAppStates?.members.filter((member: ReportingAPI.MemberInsight) => member.key === memberKey)[0];
		let newGroups = [];
		if (target.checked) {
			if (!JSON.parse(member?.groups || '[]').includes(id))
				newGroups = [...JSON.parse(member?.groups || '[]'), id];
		} else {
			newGroups = JSON.parse(member?.groups || '[]').filter((i: number) => i !== id);
		}
		handleUpdateGroup(e, newGroups, memberKey);
	}

	const _handleFilterOpen = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setOpenMemberFilters(!openMemberFilters);
	};

	const handleAllClick = () => {
		if (!localStorage.getItem('all_click_tracker--pipeline')) {
			localStorage.setItem('all_click_tracker--pipeline', 'true');
		}
		if (localStorage.getItem('all_click_tracker--pipeline') === 'true') {
			Object.keys(advancedFilters).map((filter) => {
				Object.keys(advancedFilters[filter]).map((children) => {
					advancedFilters[filter][children] = true;
				});
			});
			localStorage.setItem('all_click_tracker--pipeline', 'false');
			fetchMembers();
		} else {
			Object.keys(advancedFilters).map((filter) => {
				Object.keys(advancedFilters[filter]).map((children) => {
					advancedFilters[filter][children] = false;
				});
			});
			localStorage.setItem('all_click_tracker--pipeline', 'true');
			fetchMembers();
		}
		localStorage.setItem('user_pipeline_filter--data', JSON.stringify(advancedFilters));
	};

	const atsTracker = [
		'Concluded', 'Leading', 'Serving', 'Matched', 'Interviewing', 'Connecting', 'Queuing', 'Retracted', 'Null'
	]

	const atsGroups = [
		{
			'name': 'Recommended',
			'group': 'Curation'
		},
		{
			'name': 'Drafted',
			'group': 'Curation'
		},
		{
			'name': 'Withdrawn',
			'group': 'Application'
		},
		{
			'name': 'Received',
			'group': 'Application'
		},
		{
			'name': 'Submitted',
			'group': 'Application'
		},
		{
			'name': 'Phone Call',
			'group': 'Selection'
		},
		{
			'name': 'Follow Up',
			'group': 'Selection'
		},
		{
			'name': 'Accepted',
			'group': 'Decision'
		},
		{
			'name': 'Declined',
			'group': 'Decision'
		},
		{
			'name': 'Denied',
			'group': 'Decision'
		},
		{
			'name': 'Approved',
			'group': 'Decision'
		}
	]

	const updateApplicationAts = (oa_guid: any, ats_name: string) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the ATS? ",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure) {
				await updateATS(oa_guid, ats_name)
				fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
				setDropdownIsOpen('');
			} else {
				setDropdownIsOpen('');
				return false;
			}
		})
	}

	const updateApplicationTracker = async (oa_guid: any, pipelinetatus_id: number) => {
		swal({
			title: 'Confirm update',
			text: "Are you sure you want to update the Application Tracker?",
			icon: 'warning',
			buttons: [true, true],
		}).then(async (sure) => {
			if (sure) {
				await updateApplicationPipelineStatus(oa_guid, pipelinetatus_id)
				fetchData(selectedLocation, selectedTerm, selectedType, searchKey, versionRef.current, selectedIsAlumni);
				setDropdownIsOpen('');
			} else {
				setDropdownIsOpen('');
				return false;
			}
		})
	}
	const checkViewModLicenseStatus = (name: string) => {
		if (viewMode === 1) {
			// if (!['assigned', 'rescinded', 'paused'].includes(name.toLowerCase()) || ['Exempted', "Flagged", "Honorary", "Requested", "Licensed (Locked)", "Unlicensed"].includes(name)) {
			if (['Exempted', "Flagged", "Honorary", "Requested", "Licensed (Locked)", "Unlicensed"].includes(name)) {
					return 'none'
			} else {
				return 'all'
			}
		}
	}

	const customSort = (substatus: any) => {
		// sort members by app tracker progress
		const mySort = (a: ReportingAPI.MemberInsight, b: ReportingAPI.MemberInsight) => {
			const a_progress = a.pp_progress ? a.pp_progress : 0
			const b_progress = b.pp_progress ? b.pp_progress : 0
			if (a_progress < b_progress) {
				return 1;
			}
			if (a_progress > b_progress) {
				return -1;
			}
			return 0;
		}

		substatus.members.sort(mySort)
		console.log('sort here->', substatus)
		return substatus.members
	}

	return (
		<>
			{(openMemberFilters || dropdownIsOpen.length > 0) && (
				<Overlay
					onClick={() => {
						setOpenMemberFilters(false);
						setDropdownIsOpen('');
					}}
				></Overlay>
			)}
			<Container>
				<Switch>
					<Route path={`${match.path}`}>
						{/* <DashboardHeader
                            sectionTitle="Pipeline"
                            btnAction={exportMembers}
                            isLoading={isLoadingGoogleSheet}
                            filterAction={handleFilterOpen}
                            hideNotifications
                            showFilters={false}
                            setActive={setActive}
                        /> */}
						<DashboadHeaderFilters>
							<MembersFiltersContainer>
								<Title>Pipeline</Title>

								<FiltersContainer>
									<div style={{ position: 'relative' }}>
										<SearchItem>
											<div>
												<input
													type="text"
													value={searchTmpKey}
													onChange={handleSearchChange}
													onKeyUp={handleSearch}
													placeholder="Search..."
												/>{' '}
											</div>
											{searchIsLoading && (
												<div className="loader">
													<CircularProgress color="inherit" size={15} />
												</div>
											)}
											{!searchIsLoading && (
												<ItemLabel onClick={_handleFilterOpen}>
													<Filter id="filter_icon" />
												</ItemLabel>
											)}
										</SearchItem>
										{openMemberFilters && !searchIsLoading && (
											<AdvancedFiltersContainer id="advanced_filter_container">
												{Object.keys(advancedFilters).map((filter, id) => {
													return (
														<FilterContainer key={id}>
															<FilterParent>
																<input
																	type="checkbox"
																	id={`parent_${id}`}
																	onChange={(event: React.SyntheticEvent) =>
																		_handleFilterSelection(
																			event,
																			'',
																			filter,
																			filter !== 'allocation' &&
																				filter !== 'employment'
																				? true
																				: false,
																		)
																	}
																	checked={
																		Object.keys(advancedFilters[filter]).filter(
																			(key) =>
																				advancedFilters[filter][key] === true,
																		).length > 0
																	}
																/>
																<span>
																	<span>{filter} (All)</span>
																	{(cohortTypeStats[filter] &&
																		cohortTypeStats[filter].primary && (
																			<span
																				style={{
																					color: '#f5f5f7',
																					background: '#49516d',
																					padding: '3px',
																					borderRadius: '4px',
																					fontSize: '14px',
																					display: 'flex',
																					maxWidth: '60px',
																				}}
																			>
																				primary
																			</span>
																		)) || <></>}
																	{cohortTypeStats[filter] ? (
																		ctypes[cohortTypeStats[filter].type] ===
																			'Public' ? (
																			<span className="public-icon">
																				<Globe />
																			</span>
																		) : ctypes[cohortTypeStats[filter].type] ===
																			'Private' ? (
																			<span className="private-icon">
																				<Private />
																			</span>
																		) : ctypes[
																			cohortTypeStats[filter].type
																		].toLowerCase() === 'cariclub' ? (
																			<span className="cariclub-icon">
																				<Invisible />
																			</span>
																		) : (
																			<></>
																		)
																	) : (
																		<></>
																	)}
																</span>
															</FilterParent>
															<FilterChildrenContainer>
																{Object.keys(advancedFilters[filter]).map(
																	(children, _id) => (
																		<label key={_id}>
																			<input
																				type="checkbox"
																				id={`child_${_id}`}
																				onChange={(
																					event: React.SyntheticEvent,
																				) =>
																					_handleFilterSelection(
																						event,
																						children,
																						filter,
																						filter !== 'allocation' &&
																							filter !== 'employment'
																							? true
																							: false,
																					)
																				}
																				checked={
																					advancedFilters[filter][children]
																				}
																			/>
																			<span
																				style={{
																					display: 'flex',
																					justifyContent: 'space-between',
																					alignItems: 'center',
																					width: '100%',
																				}}
																			>
																				<span
																					style={{
																						display: 'flex',
																						flex: '1',
																					}}
																				>
																					{children}
																				</span>{' '}
																			</span>
																		</label>
																	),
																)}
															</FilterChildrenContainer>
														</FilterContainer>
													);
												})}
											</AdvancedFiltersContainer>
										)}
									</div>
									{/* {engagementState.map(
																	(value, key) =>
																			!value.parent_id && (
																					<FilterItem key={key} isActive={value.id === filterStatus}>
																							<ItemLabel
																									onClick={() => {
																											localStorage.setItem('engagement_status', `${value.id}`);
																											setFilterStatus(value.id);
																									}}
																							>
																									{newFilters[value.name.toLowerCase()] || value.name}
																							</ItemLabel>
																					</FilterItem>
																			),
															)} */}
									<FilterItem onClick={handleAllClick}>
										<ItemLabel>
											{localStorage.getItem('all_click_tracker--pipeline') === 'true'
												? 'Select All'
												: !localStorage.getItem('all_click_tracker--pipeline')
													? 'Select All'
													: 'Unselect All'}
										</ItemLabel>
									</FilterItem>

									{/* <DropdownItem>
										<select value={selectedLocation} onChange={handleLocationChange}>
											<option key="0" value="" selected disabled>
												Location
											</option>
											<option key="1" value="all">
												All
											</option>
											{locations.map((location: any) => {
												return (
													<option key={location.key} value={location.key}>
														{location.name}, {location.state}
													</option>
												);
											})}
										</select>
									</DropdownItem> */}
								</FiltersContainer>
							</MembersFiltersContainer>
							<DashboardButtonContainer>
								<DownloadButton onClick={exportMembers}>
									<ItemLabel>
										Download data <Download />
									</ItemLabel>
								</DownloadButton>
							</DashboardButtonContainer>
						</DashboadHeaderFilters>
						<MemberHeaderPipeline>
							{/* &nbsp;&nbsp;&nbsp;
						<select value={selectedType} onChange={handleTypeChange}>
							<option key="0" value="0">
								All
							</option>
							{memberTypes.map((memberType: any) => {
								return memberType.parent_id === null && [1, 7, 13].indexOf(memberType.id) === -1 && (
									<option key={memberType.id} value={memberType.id}>
										{memberType.name}
									</option>
								);
							})}
						</select>{' '} */}
						</MemberHeaderPipeline>
						{appView == 'pipeline' ? (
							<MemberGrid>
								{pipelines.length > 0 ? (
									pipelines.map((topStatus: FixMe, idx: number) => {
										return (
											<MemberCategoryList key={`member-category-list-${idx}`}>
												<MemberCategoryTitle status={topStatus.name}>
													<div>
														<CheckBoxHeaderContainer status={topStatus.name}>
															<input
																type="checkbox"
																ref={addToRefs}
																id={formatFilterKey(topStatus.name)}
																className={`${[].concat.apply(
																	[],
																	groupedFilters
																		.filter(
																			(g) =>
																				g.parent.toLowerCase() ===
																				topStatus.name.toLowerCase(),
																		)
																		.map((_g) =>
																			Object.keys(
																				selectedFilters[
																				formatFilterKey(_g.label)
																				],
																			).filter(
																				(children) =>
																					selectedFilters[
																					formatFilterKey(_g.label)
																					][children] === true,
																			),
																		) as unknown as ConcatArray<never>[],
																).length > 0 &&
																	[].concat.apply(
																		[],
																		groupedFilters
																			.filter(
																				(g) =>
																					g.parent.toLowerCase() ===
																					topStatus.name.toLowerCase(),
																			)
																			.map((_g) =>
																				Object.keys(
																					selectedFilters[
																					formatFilterKey(_g.label)
																					],
																				).filter(
																					(children) =>
																						selectedFilters[
																						formatFilterKey(_g.label)
																						][children] === true,
																				),
																			) as unknown as ConcatArray<never>[],
																	).length <
																	[].concat.apply(
																		[],
																		groupedFilters
																			.filter(
																				(g) =>
																					g.parent.toLowerCase() ===
																					topStatus.name.toLowerCase(),
																			)
																			.map((_g) =>
																				Object.keys(
																					selectedFilters[
																					formatFilterKey(_g.label)
																					],
																				).filter(
																					(children) =>
																						selectedFilters[
																						formatFilterKey(
																							_g.label,
																						)
																						][children] === true ||
																						selectedFilters[
																						formatFilterKey(
																							_g.label,
																						)
																						][children] === false,
																				),
																			) as unknown as ConcatArray<never>[],
																	).length
																	? 'isIndeterminate'
																	: ''
																	}`}
																checked={
																	[].concat.apply(
																		[],
																		groupedFilters
																			.filter(
																				(g) =>
																					g.parent.toLowerCase() ===
																					topStatus.name.toLowerCase(),
																			)
																			.map((_g) =>
																				Object.keys(
																					selectedFilters[
																					formatFilterKey(_g.label)
																					],
																				).filter(
																					(children) =>
																						selectedFilters[
																						formatFilterKey(_g.label)
																						][children] === true,
																				),
																			) as unknown as ConcatArray<never>[],
																	).length ===
																	[].concat.apply(
																		[],
																		groupedFilters
																			.filter(
																				(g) =>
																					g.parent.toLowerCase() ===
																					topStatus.name.toLowerCase(),
																			)
																			.map((_g) =>
																				Object.keys(
																					selectedFilters[
																					formatFilterKey(_g.label)
																					],
																				).filter(
																					(children) =>
																						selectedFilters[
																						formatFilterKey(_g.label)
																						][children] === true ||
																						selectedFilters[
																						formatFilterKey(_g.label)
																						][children] === false,
																				),
																			) as unknown as ConcatArray<never>[],
																	).length
																}
																onChange={() =>
																	headerCheckboxEventHandler(
																		topStatus.name.toLowerCase(),
																	)
																}
															/>
															<label htmlFor={formatFilterKey(topStatus.name)}></label>
														</CheckBoxHeaderContainer>
														<H1> {topStatus.name}</H1>
														{' - '}
														<H2> {getTotalPipeUser(topStatus.sub_statuses)} </H2>
														<FilterIconContainer
															onMouseEnter={() => setFilterOptions(topStatus.name)}
															onMouseLeave={() => {
																setTimeouts([
																	...timeouts,
																	window.setTimeout(() => {
																		setFilterOptions('');
																	}, 1600),
																]);
															}}
														>
															<Filter />
														</FilterIconContainer>
													</div>
													{filterOptions === topStatus.name && (
														<MemberCategoryFilter
															status={topStatus.name}
															onMouseEnter={() => {
																timeouts.map((timeout) => clearTimeout(timeout));
																setFilterOptions(topStatus.name);
															}}
															onMouseLeave={() => setFilterOptions('')}
														>
															{groupedFilters
																.filter(
																	(group) =>
																		group.parent.toLocaleLowerCase() ===
																		topStatus.name.toLowerCase(),
																)
																.map((group, id) => {
																	return (
																		<FilterGroup key={id} status={topStatus.name}>
																			<StyledCheckBoxContainer
																				status={topStatus.name}
																				className="group-header"
																			>
																				<label>
																					<input
																						type="checkbox"
																						onChange={(
																							event: React.SyntheticEvent,
																						) =>
																							handleFilterSelection(
																								event,
																								0,
																								group.label,
																							)
																						}
																						id={formatFilterKey(
																							group.label,
																						)}
																						checked={
																							Object.keys(
																								selectedFilters[
																								formatFilterKey(
																									group.label,
																								)
																								],
																							).filter(
																								(key) =>
																									selectedFilters[
																									formatFilterKey(
																										group.label,
																									)
																									][key] === true,
																							).length > 0
																						}
																					/>
																					<label
																						className="label-checkbox"
																						htmlFor={formatFilterKey(
																							group.label,
																						)}
																					></label>
																					<span>
																						{group.label} (
																						{topStatus.sub_statuses
																							.filter(
																								(subStatus: FixMe) =>
																									group.ids.includes(
																										subStatus.id,
																									),
																							)
																							.map(
																								(subStatus: FixMe) =>
																									subStatus.members
																										.length,
																							)
																							.reduce(
																								(
																									p: number,
																									c: number,
																								) => p + c,
																								0,
																							)}
																						)
																					</span>
																				</label>
																			</StyledCheckBoxContainer>
																			<div className="group-children">
																				{topStatus.sub_statuses
																					.filter((subStatus: FixMe) =>
																						group.ids.includes(
																							subStatus.id,
																						),
																					)
																					.map(
																						(
																							subStatus: FixMe,
																							idx: number,
																						) => (
																							<label
																								key={`filter_option_${subStatus.name}_${idx}`}
																							>
																								<input
																									type="checkbox"
																									onChange={(
																										event: React.SyntheticEvent,
																									) =>
																										handleFilterSelection(
																											event,
																											subStatus.id,
																											group.label,
																										)
																									}
																									checked={
																										selectedFilters[
																										formatFilterKey(
																											group.label,
																										)
																										][subStatus.id]
																									}
																								/>
																								<span>
																									{(
																										subStatus.name as string
																									)
																										.toLowerCase()
																										.replace(
																											'archiving',
																											'waitlist',
																										)}{' '}
																									(
																									{
																										subStatus
																											.members
																											.length
																									}
																									)
																								</span>
																							</label>
																						),
																					)}
																			</div>
																		</FilterGroup>
																	);
																})}
														</MemberCategoryFilter>
													)}
												</MemberCategoryTitle>
												{topStatus.sub_statuses.map((subStatus: FixMe, idx1: number) => {
													return (
														<div key={idx1}>
															{/* {<MemberSubStatus
                                                            key={`sub-cate-list-${idx}-${idx1}`}
                                                            onClick={() => toggleSubStatus(idx, idx1)}
                                                            status={topStatus.name}
                                                        >
                                                            {subStatus.is_open ? (
                                                                <ArrowDropUp className="status"></ArrowDropUp>
                                                            ) : (
                                                                <ArrowDropDown className="status"></ArrowDropDown>
                                                            )}
                                                            <div>
                                                                <H2>{subStatus.name}</H2>
                                                                <H2>{subStatus.members.length}</H2>
                                                            </div>
                                                        </MemberSubStatus>} */}
															{!([] as any[]).concat
																.apply(
																	[],
																	Object.keys(selectedFilters).map((filter) =>
																		Object.keys(selectedFilters[filter]).filter(
																			(key) =>
																				selectedFilters[filter][key] === false,
																		),
																	) as unknown as ConcatArray<never>[],
																)
																.includes(String(subStatus.id)) &&
																subStatus.members.map(
																	(
																		member: ReportingAPI.MemberInsight,
																		idx2: number,
																	) => {
																		return (
																			<MemberCard
																				key={`member-card-${idx}-${idx1}-${idx2}`}
																			>
																				<MemberCardTopLevel>
																					<ImgContainer
																						onClick={() =>
																							navigateToMember(
																								match.url,
																								member,
																							)
																						}
																					>
																						{member.profile_url ? (
																							<ProfileImg
																								src={member.profile_url}
																								onError={(e) =>
																									handleImgLoadError(
																										e,
																									)
																								}
																							/>
																						) : (
																							<ProfileImg
																								src={defaultProfileImg}
																								style={{ opacity: 0.2 }}
																							/>
																						)}
																						<Tooltip
																							title={
																								getMemberTooltip(member)
																									.title
																							}
																						>
																							<LicenseStatusCircle
																								shape={
																									getMemberTooltip(
																										member,
																									).shape
																								}
																								status={
																									getMemberTooltip(
																										member,
																									).color
																								}
																							/>
																						</Tooltip>
																					</ImgContainer>
																					<MemberCardTopLevelInfos>
																						<MemberTitle
																							onClick={() =>
																								navigateToMember(
																									match.url,
																									member,
																								)
																							}
																						>
																							{member.first_name}{' '}
																							{member.last_name}
																							{clientViewAvailable(member) && (
																								<span>
																									<EyeImg src={eyeImg} alt="Not showing on client view"></EyeImg>
																								</span>
																							)}
																						</MemberTitle>
																						<MemberCompany>
																							{member.organization} -{' '}
																							{member.city}
																						</MemberCompany>
																						<MemberDepartment>
																							{member.department_name &&
																								member.department_name}
																						</MemberDepartment>
																						<div
																							style={{
																								display: 'flex',
																								gap: '4px',
																								flexWrap: 'wrap',
																								alignItems: 'center',
																								justifyContent:
																									'center',
																							}}
																						>
																							{member.pp_cohorts &&
																								member.pp_cohorts
																									.length > 0 &&
																								member.pp_cohorts
																									.slice(0, 6)
																									.map(
																										(
																											e: GroupObj,
																										) => (
																											<Tooltip
																												title={
																													e.desc ||
																													'Cohort Name'
																												}
																											>
																												<CohortContainer>
																													{
																														e.name
																													}
																												</CohortContainer>
																											</Tooltip>
																										),
																									)}
																							{member.pp_cohorts &&
																								member.pp_cohorts
																									.length > 6 && (
																									<Tooltip
																										title={member.pp_cohorts
																											.slice(
																												6,
																												member
																													.pp_cohorts
																													.length,
																											)
																											.map(
																												(
																													g: GroupObj,
																												) => (
																													<div
																														style={{
																															textAlign:
																																'center',
																														}}
																													>
																														{
																															g.name
																														}
																													</div>
																												),
																											)}
																									>
																										<CohortContainer>
																											+{' '}
																											{member
																												.pp_cohorts
																												.length -
																												6}
																										</CohortContainer>
																									</Tooltip>
																								)}
																						</div>
																					</MemberCardTopLevelInfos>
																				</MemberCardTopLevel>
																				{member.pp_obj &&
																					member.pp_obj.is_nonprofit == 1 && (
																						<MemberNonprofit>
																							{member.pp_obj
																								.nonprofit_logo && (
																									(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
																										(
																											<a target="_blank" href={config.cc_admin_url + `/organizations/` + member.pp_obj.nonprofit_guid}>
																												<img src={member.pp_obj.nonprofit_logo} style={{ height: 20, }} />
																											</a>
																										) : (
																											<img src={member.pp_obj.nonprofit_logo} style={{ height: 20, }} />
																										)
																								)}
																							&nbsp;&nbsp;
																							<p>
																								<Tooltip
																									title={
																										member.pp_obj
																											.nonprofit_name
																									}
																								>
																									<span>
																										{
																											member
																												.pp_obj
																												.nonprofit_name
																										}
																									</span>
																								</Tooltip>
																								&nbsp;
																								{'-'}&nbsp;{member.city}
																							</p>
																						</MemberNonprofit>
																					)}
																				<MemberCardBottomLevel>
																					<Tooltip
																						title={
																							(member.pp_obj.is_app == 0 && member.pp_obj.ats_stage == 0) ?
																								(getUserMMStatus(member.pp_obj.pps_id).position) + `: ` + getUserMMStatus(member.pp_obj.pps_id).description
																								: (getUserPipelineStatus(member.pp_obj.pps_id).position) + `: ` + getUserPipelineStatus(member.pp_obj.pps_id).description
																						}
																					>
																						<Status
																							status={member.pp_status.toUpperCase()}
																							topStatus={topStatus.name}
																						>
																							{member.pp_obj.is_app == 0 && member.pp_obj.ats_stage == 0 ? getUserMMStatus(member.pp_obj.pps_id).stage : getUserPipelineStatus(member.pp_obj.pps_id).stage}
																						</Status>
																					</Tooltip>
																					{member.pp_progress &&
																						<Status>Application Tracker: {member.pp_progress}%</Status>
																					}
																					<Tooltip title="Employment status">
																						<OrganizationLink
																							status={
																								links &&
																								links
																									.filter(
																										(link) =>
																											Number(
																												link.id,
																											) ===
																											member.priviledge_term,
																									)[0]
																									?.name.toUpperCase()
																							}
																							topStatus={topStatus.name}
																						>
																							{(links &&
																								links.filter(
																									(link) =>
																										Number(
																											link.id,
																										) ===
																										member.priviledge_term,
																								)[0]?.name) ||
																								'Unknown'}
																						</OrganizationLink>
																					</Tooltip>
																				</MemberCardBottomLevel>
																				<DropdownContainer className="dorpdown-container">
																					<MenuContainer
																						onClick={() =>
																							handleMenuDropdown(
																								`${idx}_${idx1}_${idx2}_${member.key}`,
																							)
																						}
																					>
																						<Dots />
																					</MenuContainer>
																				</DropdownContainer>
																				{dropdownIsOpen ===
																					`${idx}_${idx1}_${idx2}_${member.key}` &&
																					memberInfos.license_id !== -1 && (
																						<Dropdown isMatched={idx > 1}>
																							<>
																								<ul className="dropdown-menu">
																									<li>
																										<span className="category-menu">
																											Employment
																											status{' '}
																											<DropdownIcon
																												style={{
																													transform:
																														'rotate(-90deg)',
																												}}
																											/>
																										</span>
																										<ul className="dropdown-menu dropdown-submenu">
																											{links &&
																												links.map(
																													(
																														link: GroupObj,
																													) => (
																														<li
																															key={`cariclub_links_${link.id}`}
																															onClick={(
																																e,
																															) =>
																																handleUpdateLink(
																																	e,
																																	link.id,
																																	member.key,
																																)
																															}
																															style={{
																																pointerEvents:
																																	(viewMode ===
																																		1 &&
																																		[
																																			'stakeholder',
																																			'designee',
																																			'disavowed',
																																			'secondee',
																																			'assisted',
																																		].includes(
																																			link.name.toLowerCase(),
																																		) &&
																																		'none') ||
																																	'all',
																															}}
																														>
																															<span>
																																{
																																	link.name
																																}

																																{memberInfos.link_id ===
																																	link.id && (
																																		<Checkmark className="checkmark" />
																																	)}
																																<span className="lock-icon">
																																	{viewMode ===
																																		1 &&
																																		[
																																			'stakeholder',
																																			'designee',
																																			'disavowed',
																																			'secondee',
																																			'assisted',
																																		].includes(
																																			link.name.toLowerCase(),
																																		) && (
																																			<Lock />
																																		)}
																																</span>
																															</span>
																														</li>
																													),
																												)}
																										</ul>
																									</li>
																									<li>
																										<span className="category-menu">
																											License
																											status{' '}
																											<DropdownIcon
																												style={{
																													transform:
																														'rotate(-90deg)',
																												}}
																											/>
																										</span>
																										<ul className="dropdown-menu dropdown-submenu">
																											{licenses &&
																												licenses.map(
																													(
																														license: GroupObj,
																													) => (
																														<li
																															key={`cariclub_licenses_${license.id}`}
																															onClick={(
																																e,
																															) =>
																																handleUpdateLicense(
																																	e,
																																	license.id,
																																	member.key,
																																)
																															}
																															style={{
																																pointerEvents: checkViewModLicenseStatus(license.name)
																															}}
																														>
																															<span>
																																{
																																	license.name
																																}
																																{memberInfos.license_id ===
																																	license.id && (
																																		<Checkmark className="checkmark" />
																																	)}
																																<span className="lock-icon">
																																	{viewMode ===
																																		1 &&
																																		![
																																			'assigned',
																																			'rescinded',
																																			'paused'
																																		].includes(
																																			license.name.toLowerCase(),
																																		) && (
																																			<Lock />
																																		)}
																																</span>
																															</span>
																														</li>
																													),
																												)}
																										</ul>
																									</li>

																									<li>
																										<span className="category-menu">
																											CariClub
																											role{' '}
																											<DropdownIcon
																												style={{
																													transform:
																														'rotate(-90deg)',
																												}}
																											/>
																										</span>
																										<ul className="dropdown-menu dropdown-submenu">
																											{roles &&
																												roles.map(
																													(
																														role: GroupObj,
																													) => (
																														<li
																															key={`cariclub_roles_${role.id}`}
																															onClick={(
																																e,
																															) =>
																																handleUpdateRole(
																																	e,
																																	role.id,
																																	member.key,
																																)
																															}
																															style={{
																																pointerEvents:
																																	(viewMode ===
																																		1 &&
																																		'none') ||
																																	'all',
																															}}
																														>
																															<span>
																																{
																																	role.name
																																}
																																{memberInfos.role_id ===
																																	role.id && (
																																		<Checkmark className="checkmark" />
																																	)}
																																<span className="lock-icon">
																																	{viewMode ===
																																		1 && (
																																			<Lock />
																																		)}
																																</span>
																															</span>
																														</li>
																													),
																												)}
																										</ul>
																									</li>
																									<li className="line-breaker">
																										<span className="type-breaker"></span>
																									</li>
																									<li>
																										<span className="category-menu">
																											ATS Status{' '}
																											{(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
																												(<DropdownIcon
																													style={{
																														transform:
																															'rotate(-90deg)',
																													}}
																												/>)
																												: (
																													<span className="lock-icon">
																														<Lock />
																													</span>
																												)
																											}
																										</span>
																										{(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) &&
																											<ul className="dropdown-menu dropdown-submenu">
																												<li className="group-menu" key={`cariclub_main_links1_curation`}>
																													<span>Curation</span>
																												</li>
																												{
																													atsGroups.filter((group: any) => group.group == "Curation")
																														.map((ats: any) => (
																															<li key={`cariclub_main_links1_${ats.name}`}>
																																<span
																																	onClick={() => updateApplicationAts(member.pp_obj.oa_key, ats.name)} >
																																	{ats.name}
																																</span>
																																{
																																	ats.name ==
																																	(atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage).count > 0 ? atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage)[0].name : '')
																																	&&
																																	<Checkmark />
																																}
																															</li>
																														))
																												}
																												<li className="group-menu" key={`cariclub_main_links1_application`}>
																													<span>Application</span>
																												</li>
																												{
																													atsGroups.filter((group: any) => group.group == "Application")
																														.map((ats: any) => (
																															<li key={`cariclub_main_links1_${ats.name}`}>
																																<span onClick={() => updateApplicationAts(member.pp_obj.oa_key, ats.name)}>
																																	{ats.name}
																																</span>
																																{
																																	ats.name ==
																																	(atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage).count > 0 ? atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage)[0].name : '')
																																	&&
																																	<Checkmark />
																																}
																															</li>
																														))
																												}
																												<li className="group-menu" key={`cariclub_main_links1_selection`}>
																													<span>Selection</span>
																												</li>
																												{
																													atsGroups.filter((group: any) => group.group == "Selection")
																														.map((ats: any) => (
																															<li key={`cariclub_main_links1_${ats.name}`}>
																																<span onClick={() => updateApplicationAts(member.pp_obj.oa_key, ats.name)}>
																																	{ats.name}
																																</span>
																																{
																																	ats.name ==
																																	(atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage).count > 0 ? atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage)[0].name : '')
																																	&&
																																	<Checkmark />
																																}
																															</li>
																														))
																												}
																												<li className="group-menu" key={`cariclub_main_links1_decision`}>
																													<span>Decision</span>
																												</li>
																												{
																													atsGroups.filter((group: any) => group.group == "Decision")
																														.map((ats: any) => (
																															<li key={`cariclub_main_links1_${ats.name}`}>
																																<span onClick={() => updateApplicationAts(member.pp_obj.oa_key, ats.name)}>
																																	{ats.name}
																																</span>
																																{
																																	ats.name ==
																																	(atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage).count > 0 ? atsStatuses.filter((a1: any) => a1.id == member.pp_obj.ats_stage)[0].name : '')
																																	&&
																																	<Checkmark />
																																}
																															</li>
																														))
																												}
																											</ul>
																										}
																									</li>
																									<li>
																										<span className="category-menu">
																											App Tracker{' '}
																											{(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
																												(<DropdownIcon
																													style={{
																														transform:
																															'rotate(-90deg)',
																													}}
																												/>)
																												: (
																													<span className="lock-icon">
																														<Lock />
																													</span>
																												)
																											}
																										</span>
																										{(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) &&
																											<ul className="dropdown-menu dropdown-submenu">
																												{
																													atsTracker.map((stage: string) => (
																														<li key={`cariclub_main_links1_${stage}`}>
																															<span className={getUserPipelineStatus(member.pp_id).stage == stage ? `category-menu active` : `category-menu`}>
																																{stage}
																																<DropdownIcon className="DropdownIcon" style={{ transform: 'rotate(-90deg)' }} />
																															</span>
																															<ul className="dropdown-menu dropdown-submenu">
																																{
																																	stage != 'Null' &&
																																	plStatuses.filter(
																																		(pl: any) => getUserPipelineStatus(pl.id).stage == stage
																																	).map((subStage: any) => ((
																																		<li key={`cariclub_links1_${subStage.name}`}
																																			onClick={() => updateApplicationTracker(member.pp_obj.oa_key, subStage.id)}
																																		>
																																			<span>{subStage.name}</span>
																																			{
																																				getUserPipelineStatus(member.pp_id).pps_id == subStage.id &&
																																				<Checkmark />
																																			}
																																		</li>
																																	)))
																																}
																																{
																																	stage == 'Null' &&
																																	<li key={`cariclub_links_null`}><span>Null</span></li>
																																}
																															</ul>
																														</li>
																													))
																												}
																											</ul>
																										}
																									</li>
																									<li className="line-breaker">
																										<span className="type-breaker"></span>
																									</li>
																									{Object.keys(
																										advancedFilters,
																									)
																										.filter(
																											(key) =>
																												![
																													'allocation',
																													'employment',
																												].includes(
																													key,
																												) &&
																												groups.filter(
																													(
																														group: GroupObj,
																													) =>
																														group.type_name.toLowerCase() ===
																														key.toLowerCase(),
																												)[0]
																													?.type_is_primary ===
																												1,
																										)
																										.map(
																											(
																												parent,
																											) => (
																												<li>
																													<span className="category-menu">
																														{
																															parent
																														}{' '}
																														<DropdownIcon
																															style={{
																																transform:
																																	'rotate(-90deg)',
																															}}
																														/>
																													</span>
																													<ul className="dropdown-menu dropdown-submenu">
																														{Object.keys(
																															advancedFilters[
																															parent
																															],
																														) &&
																															Object.keys(
																																advancedFilters[
																																parent
																																],
																															).map(
																																(
																																	children: string,
																																) => (
																																	<li
																																		key={`groups_${parent}_${children}`}
																																	>
																																		<label
																																			style={{
																																				display:
																																					'flex',
																																				padding:
																																					'4px 8px',
																																				cursor: 'pointer',
																																				alignItems:
																																					'center',
																																			}}
																																		>
																																			<input
																																				type="checkbox"
																																				checked={JSON.parse(
																																					member.groups ||
																																					'[]',
																																				).includes(
																																					groups.filter(
																																						(
																																							group,
																																						) =>
																																							group.name.toLowerCase() ===
																																							children.toLowerCase(),
																																					)[0]
																																						?.id,
																																				)}
																																				onChange={(
																																					e: React.SyntheticEvent,
																																				) =>
																																					handleGroupSelection(
																																						e,
																																						groups.filter(
																																							(
																																								group,
																																							) =>
																																								group.name.toLowerCase() ===
																																								children.toLowerCase(),
																																						)[0]
																																							?.id,
																																						member.key,
																																					)
																																				}
																																			/>
																																			<span>
																																				{
																																					children
																																				}
																																			</span>
																																		</label>
																																	</li>
																																),
																															)}
																													</ul>
																												</li>
																											),
																										)}
																								</ul>
																							</>
																						</Dropdown>
																					)}
																			</MemberCard>
																		);
																	},
																)}
														</div>
													);
												})}
											</MemberCategoryList>
										);
									})
								) : (
									<></>
								)}
							</MemberGrid>
						) : (
							<MemberGrid>
								{memberStatuses.length &&
									memberStatuses.map((status: FixMe, idx: number) => {
										return (
											<MemberCategoryList key={`member-category-list-${idx}`}>
												<MemberCategoryTitle status={status.name}>
													<div>
														<H1> {status.name} </H1>
														<H2> {`(${status.count})`} </H2>
													</div>
												</MemberCategoryTitle>
												{status.members.map(
													(member: ReportingAPI.MemberInsight, idx: number) => {
														return (
															<MemberCard
																key={`member-card-${idx}`}
																onClick={() => navigateToMember(match.url, member)}
															>
																<ProfileImg
																	src={
																		member.profile_url &&
																			!member.profile_url.includes('media.licdn')
																			? member.profile_url
																			: defaultProfileImg
																	}
																	alt="profile-image"
																/>
																<div>
																	<MemberTitle>
																		{member.first_name} {member.last_name}
																	</MemberTitle>
																	<MemberDetails>
																		{`Applications: ${member.applications != null
																			? member.applications.length
																			: 0
																			}`}
																	</MemberDetails>
																</div>
															</MemberCard>
														);
													},
												)}
											</MemberCategoryList>
										);
									})}
							</MemberGrid>
						)}
					</Route>
				</Switch>
			</Container>
		</>
	);
}

export default Members;
