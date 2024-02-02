import React, { useEffect, useState, useRef, MutableRefObject, useCallback } from 'react';
import { getCompanyData, getEngagementStatuses, getPipelineStatuses } from '../../../services/cariclub';
import { ReportingAPI, ReportingDB } from '../../../../types';
import { ReactComponent as Lock } from '../../../assets/lock.svg';
import { ReactComponent as Private } from '../../../assets/private.svg';
import { ReactComponent as Globe } from '../../../assets/globe-public.svg';
import { ReactComponent as Arrow } from '../../../assets/down-arrow.svg';

import { ReactComponent as Invisible } from '../../../assets/invisible.svg';
import defaultProfileImg from '../../../assets/default-user-avatar.png';
import Ringbell from '../../../assets/mail.png';
import eyeImg from '../../../assets/eyeicon.png';
import {
    Table,
    Container,
    ProfileImg,
    EyeImg,
    RingBell,
    PrimeStatus,
    ActiveStatus,
    InactiveStatus,
    IdleStatus,
    PrimeDatailStatus,
    ActiveDatailStatus,
    IdleDatailStatus,
    InactiveDatailStatus,
    TopBar,
    ProfileImgContainer,
    ProfileContainer,
    CheckboxInput,
    TableHeader,
    TableBody,
    EditDropdown,
    Dropdown,
    DropdownToggle,
    LicenseStatusCircle,
    AdvancedFiltersContainer,
    Overlay,
    FilterContainer,
    FilterParent,
    FilterChildrenContainer,
    SearchItem,
    MemberNonprofit,
    ImageNameContainer,
    MoreNonProfits,
    SelectionCounter,
    CheckboxInputAll,
    CheckboxContainer,
} from './styles.css';
import { EngagementStatuses } from './types';
import { ReactComponent as Notification } from '../../../assets/ringbell.svg';
import { ReactComponent as Filter } from '../../../assets/filter.svg';
import { ReactComponent as DropdownIcon } from '../../../assets/dropdown.svg';
import { ReactComponent as Dots } from '../../../assets/dots.svg';
import {
    ActionsContainer,
    DashboadHeaderFilters,
    FilterItem,
    FiltersContainer,
    ItemLabel,
    Title,
} from 'components/DashboardHeader/styles.css';

import { InsightsApp } from 'global';
import { useHistory } from 'react-router-dom';
import { CheckBox } from '@material-ui/icons';

import {
    getCandidateLicenses,
    getLicenseTerms,
    getCariclubRoles,
    updateUser,
    getGroups,
    getRequestedMembers,
} from '../../../services/cariclub';
import swal from 'sweetalert';
import { Alert } from '@material-ui/lab';
import { Tooltip } from '@material-ui/core';
import { getMemberTooltip } from '../helper';
import config from '../../../config';

export type currentMemberType = InsightsApp.MemberPage;

interface IProps {
    appState: ReportingAPI.PrimaryCompanyData | undefined;
    queryCompanyID: string | null;
    setApplicationState: React.Dispatch<React.SetStateAction<ReportingAPI.PrimaryCompanyData | undefined>>;
    currentMember?: currentMemberType;
    viewMode: number;
    setCurrentMember(member: currentMemberType): void;
    mapNPOsToMember(member: ReportingAPI.MemberInsight, npos: ReportingDB.Nonprofits[]): Promise<currentMemberType>;
    setActive(active: string): void;
    plStatuses: any;
    milestoneMarkers: any;
}

interface GroupObj {
    id: number;
    name: string;
    type_id: number;
    type_name: string;
    status: number;
    type_type: number;
    type_is_primary: number;
}

const Engagement = ({
    appState,
    queryCompanyID,
    plStatuses,
    milestoneMarkers,
    currentMember,
    setApplicationState,
    setCurrentMember,
    mapNPOsToMember,
    setActive,
    viewMode,
}: IProps) => {
    const [requestFilter, setRequestFilter] = useState(() => {
        const cached_filter = localStorage.getItem('user_engagement_filter--data-2') as string;
        return cached_filter == 'true' ? true : false;
    });
    const [searchKey, setSearchKey] = useState('');
    const [searchTmpKey, setSearchTmpKey] = useState('');
    const [engagementState, setEngagementState] = useState<EngagementStatuses[]>([]);
    const [members, setMembers] = useState(appState?.members);
    const [membersState, setMembersState] = useState(appState?.members);
    const [reqMembers, setReqMembers] = useState([]);
    const [filterStatus, setFilterStatus] = useState(0);
    const [short, setShort] = useState(false);
    const [filterTerm, setFilterTerm] = useState('');
    const [selectedIsAlumni, setSelectedIsAlumni] = useState(0);
    const [filterLocation, setFilterLocation] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<String[]>([]);
    const [dropdown, setDropdown] = useState<boolean>(false);
    const [licenses, setLicenses] = useState<{ name: string; id: string }[]>([]);
    const [links, setLinks] = useState<GroupObj[]>([]);
    const [roles, setRoles] = useState<GroupObj[]>([]);
    const [submitError, setSubmitError] = useState<string>('');
    const version = useRef(0);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [pipelineStatuses, setPipelineStatuses] = useState<{ name: string; id: string }[]>([]);
    const [selectedMembersFilter, setSelectedMembersFilter] = useState();
    const [openMemberFilters, setOpenMemberFilters] = useState(false);
    const [groups, setGroups] = useState<GroupObj[]>([]);
    const [orderBy, setOrderBy] = useState<string>('userpipeline_status');
    const [orderType, setOrderType] = useState<string>('asc');
    const [cohortTypeStats, setCohortTypeStats] = useState<any>({});
    const [advancedFilters, setAdvancedFilters] = useState<any>(() => {
        const cached_filters = JSON.parse(localStorage.getItem('user_engagement_filter--data') as string);
        return cached_filters && cached_filters['employment'] && cached_filters['allocation']
            ? {
                employment: { ...cached_filters['employment'] },
                allocation: { ...cached_filters['allocation'] },
            }
            : {
                allocation: {
                    exempted: true,
                    licensed: true,
                    unlicensed: true,
                    rescinded: true,
                },
                employment: {
                    alumni: true,
                    employees: true,
                },
                /*
engagement: {
active: true,
dormant: false,
},
status: {
matched: true,
unmatched: false,
},*/
            };
    });
    const [filteredMembers, setFilteredMembers] = useState<ReportingAPI.MemberInsight[] | undefined>([]);

    const ctypes = ['Cariclub', 'Universal', 'Global'];

    const clientViewAvailable = (member: any) => {
        return ((member.cariclub_role != 3 && member.candidate_license == 4) || ([65, 66, 71].includes(member.userpipeline_status))) ? true : false;
    }

    const history = useHistory();

    const cc_token: any = localStorage.getItem('cc_token');
    let _cc_token: { type: string; } | null = null;
    if (cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    }

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
    }, [advancedFilters]);

    useEffect(() => {
        const elements = document.querySelectorAll('.parent_checkboxes');
        if (elements.length > 0) {
            elements.forEach((element) => {
                const key = element.id;
                if (
                    Object.keys(advancedFilters[key]).filter((children) => advancedFilters[key][children] === true)
                        .length > 0 &&
                    Object.keys(advancedFilters[key]).filter((children) => advancedFilters[key][children] === true)
                        .length < Object.keys(advancedFilters[key]).length
                ) {
                    (element as HTMLInputElement).indeterminate = true;
                }
            });
        }
    }, [openMemberFilters]);

    const fetchMembers = () => {
        if (appState) {
            if (appState.members) {
                let helper = appState.members;

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
                    advancedFilters['allocation']['exempted'] &&
                    advancedFilters['allocation']['licensed'] &&
                    advancedFilters['allocation']['unlicensed'] &&
                    advancedFilters['allocation']['rescinded']
                ) {
                    helper = helper.filter((member: ReportingAPI.MemberInsight) =>
                        [1, 4, 5, 2, 3, 6].includes(member.candidate_license as number),
                    );
                } else {
                    if (advancedFilters['allocation']['exempted']) {
                        helper = helper.filter((member: ReportingAPI.MemberInsight) =>
                            [1].includes(member.candidate_license as number),
                        );
                    } else {
                        helper = helper.filter(
                            (member: ReportingAPI.MemberInsight) => ![1].includes(member.candidate_license as number),
                        );
                    }
                    if (advancedFilters['allocation']['licensed']) {
                        helper = helper.filter((member: ReportingAPI.MemberInsight) =>
                            [2, 3].includes(member.candidate_license as number),
                        );
                    } else {
                        helper = helper.filter(
                            (member: ReportingAPI.MemberInsight) =>
                                ![2, 3].includes(member.candidate_license as number),
                        );
                    }
                    if (advancedFilters['allocation']['unlicensed']) {
                        helper = helper.filter((member: ReportingAPI.MemberInsight) =>
                            [6, 5].includes(member.candidate_license as number),
                        );
                    } else {
                        helper = helper.filter(
                            (member: ReportingAPI.MemberInsight) =>
                                ![6, 5].includes(member.candidate_license as number),
                        );
                    }
                    if (advancedFilters['allocation']['rescinded']) {
                        helper = helper.filter((member: ReportingAPI.MemberInsight) =>
                            [4].includes(member.candidate_license as number),
                        );
                    } else {
                        helper = helper.filter(
                            (member: ReportingAPI.MemberInsight) => ![4].includes(member.candidate_license as number),
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
                    helper = appState.members;
                    localStorage.setItem('all_click_tracker--pipeline', 'false');
                } else if (allChecked.filter((b) => !b).length === Object.keys(advancedFilters).length) {
                    localStorage.setItem('all_click_tracker--pipeline', 'true');
                }
                helper.forEach((v, idx) => {
                    v.row_no = idx + 1
                })

                setFilteredMembers(helper);
            }
        }
    };

    const handleAllClick = () => {
        if (!localStorage.getItem('all_click_tracker--engagement')) {
            localStorage.setItem('all_click_tracker--engagement', 'true');
        }
        if (localStorage.getItem('all_click_tracker--engagement') === 'true') {
            Object.keys(advancedFilters).map((filter) => {
                Object.keys(advancedFilters[filter]).map((children) => {
                    advancedFilters[filter][children] = true;
                });
            });
            localStorage.setItem('all_click_tracker--engagement', 'false');
            fetchMembers();
        } else {
            Object.keys(advancedFilters).map((filter) => {
                Object.keys(advancedFilters[filter]).map((children) => {
                    advancedFilters[filter][children] = false;
                });
            });
            localStorage.setItem('all_click_tracker--engagement', 'true');
            fetchMembers();
        }
        localStorage.setItem('user_engagement_filter--data', JSON.stringify(advancedFilters));
    };

    useEffect(() => {
        const fetchCandidateLicenses = async () => {
            let res = await getCandidateLicenses();
            setLicenses(res);
        };

        const fetchLinks = async () => {
            let res = await getLicenseTerms();
            let helper: GroupObj[] = res.filter(
                (res: GroupObj) => !['employee', 'alumni', 'disavowed'].includes((res.name as string).toLowerCase()),
            );
            helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'employee')[0]);
            helper.unshift(res.filter((res: GroupObj) => (res.name as string).toLowerCase() === 'alumni')[0]);
            setLinks(helper);
        };

        const fetchCariclubRoles = async () => {
            let res = await getCariclubRoles();
            setRoles(res);
        };

        fetchCariclubRoles();
        fetchLinks();
        fetchCandidateLicenses();
    }, []);

    useEffect(() => {
        if (appState && appState.company) {
            const fetchGroups = async () => {
                let res = await getGroups(appState.company.org_key, viewMode, 1);
                setGroups([...res]);
                const cached_filters = JSON.parse(localStorage.getItem('user_engagement_filter--data') as string);
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
            fetchGroups();
        }
    }, [appState, viewMode]);

    const handleCheckAll = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement;
        setCheckAll(target.checked);
        if (target.checked) {
            if (requestFilter) {
                setSelectedMembers(reqMembers?.map((reqMember: any) => reqMember.key) as String[]);
            } else {
                setSelectedMembers(members?.map((member) => member.key) as String[]);
            }
        } else {
            setSelectedMembers([]);
        }
    };
    const getUserPipelineStatus = (userpipeline_status: number) => {
        let names = {
            'position': '',
            'stage': '',
            'description': '',
            'progress': '',
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

    const navigateToMember = async (member: ReportingAPI.MemberInsight) => {
        if (!appState) {
            history.push('/');
        } else {
            const formattedMemberDetails = await mapNPOsToMember(member, appState.nonprofits);
            setCurrentMember(formattedMemberDetails);
            history.push(`/engagement/${localStorage.getItem('company_id')}/${member.key}`);
        }
    };

    const navigateToReqMember = async (reqMmember: any) => {
        history.push(`/requestedMember/${localStorage.getItem('company_id')}/${reqMmember.key}`);
    };

    const getStausEle = (status: number | null) => {
        if (status !== null) {
            const statusString = engagementState[(engagementState[status - 1]?.parent_id || status) - 1]?.name;
            if (statusString === 'Prime') return <PrimeStatus>{statusString}</PrimeStatus>;
            else if (statusString === 'Active') return <ActiveStatus>{statusString}</ActiveStatus>;
            else if (statusString === 'Idle') return <IdleStatus>{statusString}</IdleStatus>;
            else if (statusString === 'Inactive') return <InactiveStatus>{statusString}</InactiveStatus>;
        }
    };
    const getStausDetail = (status: number | null) => {
        if (status !== null) {
            const statusString = engagementState[(engagementState[status - 1]?.parent_id || status) - 1]?.name;
            const statusDatailString =
                engagementState[(engagementState[status - 1]?.parent_id ? status : -1) - 1]?.name;
            // const statusDatailString = engagementState[(status || -1) - 1]?.name;
            if (statusString === 'Prime') return <PrimeDatailStatus>{statusDatailString}</PrimeDatailStatus>;
            else if (statusString === 'Active') return <ActiveDatailStatus>{statusDatailString}</ActiveDatailStatus>;
            else if (statusString === 'Idle') return <IdleDatailStatus>{statusDatailString}</IdleDatailStatus>;
            else if (statusString === 'Inactive')
                return <InactiveDatailStatus>{statusDatailString}</InactiveDatailStatus>;
        }
    };

    const newFilters: any = {
        prime: 'Matched',
        idle: 'Idled',
    };

    const fetchData = async (key: string, term: string, status: number, v: number, is_alumni: number) => {
        const res: any = await getCompanyData(
            appState?.company.org_key || '',
            appState?.company.org_name || '',
            key,
            '',
            term,
            0,
            status,
            viewMode,
            is_alumni,
        );
        const reqRes: any = await getRequestedMembers(appState?.company.org_key || '');

        if (v === version.current) {
            // console.log('reqRes->', reqRes.requestedMembers)
            setMembers(res.members);
            setMembersState(res.members);
            let req_member = reqRes?.requestedMembers?.filter((reqMember: any) => reqMember.work_email != "")
            req_member.forEach((v: any, idx: any) => {
                v.row_no = idx + 1
            });
            setReqMembers(req_member);
        }
    };
    useEffect(() => {
        version.current = version.current + 1;
        fetchData(searchKey, filterTerm, filterStatus, version.current, selectedIsAlumni);
    }, [filterStatus, filterTerm, searchKey, viewMode, selectedIsAlumni]);

    useEffect(() => {
        setMembers(membersState?.filter((v) => (filterLocation ? v.city === filterLocation : true)));
    }, [filterLocation, membersState]);

    useEffect(() => {
        const _getEngagementStatuses = async () => {
            const res = await getEngagementStatuses();
            setEngagementState(res);
        };

        const _getPipelineStatuses = async () => {
            const res = await getPipelineStatuses();
            setPipelineStatuses(res);
        };

        let engagement_location = '';
        if (localStorage.getItem('engagement_location') != null) {
            engagement_location = localStorage.getItem('engagement_location') || '';
        }
        let engagement_term = '';
        if (localStorage.getItem('engagement_term') != null) {
            engagement_term = localStorage.getItem('engagement_term') || '';
        }
        let engagement_status = 0;
        if (localStorage.getItem('engagement_status') != null) {
            engagement_status = parseInt(localStorage.getItem('engagement_status') || '0');
        }

        _getPipelineStatuses();
        _getEngagementStatuses();
        setFilterTerm(engagement_term);
        setFilterStatus(engagement_status);
        setFilterLocation(engagement_location);
    }, []);

    const termFilter = (e: any) => {
        const term = e.target.value;
        localStorage.setItem('engagement_term', term);
        setFilterTerm(term);
    };
    const locationFilter = (e: any) => {
        const location = e.target.value;
        setFilterLocation((location as string).toLowerCase());
    };
    const handleAlumniFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key: number = parseInt(event.target.value);
        setSelectedIsAlumni(key);
    };
    const getLocations = () => {
        const tmp: string[] = [];
        membersState?.map((v) => {
            if (tmp.indexOf(v.city || '') === -1 && v.city) tmp.push(v.city);
        });
        return tmp;
    };

    const navigateToNotifications = () => {
        history.push(`/notifications/${localStorage.getItem('company_id')}`);
        setActive('notifications');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key: string = (event.target as HTMLInputElement).value;
        setSearchTmpKey(key);
    };

    const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            setSearchKey(searchTmpKey.trim());
        }
    };

    const getLicenseStatus = (member_type: number) => {
        let result = '';
        if (member_type == 21) {
            //Candidate->Premier
            result = 'Licensed';
        } else if (member_type == 20) {
            //Candidate->Prime
            result = 'Elected';
        } else if (member_type == 23) {
            //Candidate->Legacy
            result = 'Legacy';
        } else {
            result = 'Unlicensed';
        }
        return result;
    };

    const handleMemberSelection = (e: React.SyntheticEvent, memberKey: string) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
            setSelectedMembers([...selectedMembers, memberKey]);
        } else {
            if (selectedMembers.includes(memberKey))
                setSelectedMembers(selectedMembers.filter((key) => key !== memberKey));
        }
    };

    const toggleDropdown = () => {
        if (selectedMembers.length > 0) setDropdown(!dropdown);
    };

    const licenseLabels: any = {
        pause: 'Pause CariClub License',
    };

    const employmentLabels: any = {
        employee: 'Convert to Employee',
        alumni: 'Convert to Alumni',
    };

    const handleUpdateLicense = async (e: React.SyntheticEvent, licenseKey: string) => {
        swal({
            title: 'Confirm update',
            text: 'Are you sure you want to update selected members licenses?',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                if (selectedMembers.length > 0) {
                    await selectedMembers?.map(async (memberKey: String, key) => {
                        let member = members?.filter(
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
                                setSubmitError(res.message);
                                window.location.reload();
                            } else {
                                swal({
                                    title: 'Success',
                                    text: 'Users have been updated successfully',
                                    icon: 'success',
                                    buttons: [false, true],
                                }).then(() => setDropdown(false));
                            }
                        }
                    });
                }
            } else {
                setDropdown(false);
                return false;
            }
        });
    };
    const handleUpdateLink = async (e: React.SyntheticEvent, orgLink: number) => {
        swal({
            title: 'Confirm update',
            text: 'Are you sure you want to update selected members employment statuses?',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                if (selectedMembers.length > 0) {
                    await selectedMembers?.map(async (memberKey: String, key) => {
                        let member = members?.filter(
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
                                setSubmitError(res.message);
                                window.location.reload();
                            } else {
                                swal({
                                    title: 'Success',
                                    text: 'Users have been updated successfully',
                                    icon: 'success',
                                    buttons: [false, true],
                                }).then(() => {
                                    setDropdown(false);
                                    window.location.reload();
                                });
                            }
                        }
                    });
                }
            } else {
                setDropdown(false);
                return false;
            }
        });
    };
    const handleUpdateRole = async (e: React.SyntheticEvent, roleKey: number) => {
        swal({
            title: 'Confirm update',
            text: 'Are you sure you want to update the selected members roles?',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                if (selectedMembers.length > 0) {
                    await selectedMembers?.map(async (memberKey: String, key) => {
                        let member = members?.filter(
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
                                setSubmitError(res.message);
                                window.location.reload();
                            } else {
                                swal({
                                    title: 'Success',
                                    text: 'Users have been updated successfully',
                                    icon: 'success',
                                    buttons: [false, true],
                                }).then(() => {
                                    setDropdown(false);
                                    window.location.reload();
                                });
                            }
                        }
                    });
                }
            } else {
                setDropdown(false);
                return false;
            }
        });
    };

    const handleUpdateGroup = async (e: React.SyntheticEvent, group_id: number) => {
        swal({
            title: 'Confirm update',
            text: 'Are you sure you want to update the selected members cohorts?',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                if (selectedMembers.length > 0) {
                    await selectedMembers?.map(async (memberKey: String, key) => {
                        let member = members?.filter(
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
                                groups: `[${group_id}]`,
                            };
                            const res = await updateUser(values);
                            if (res.code !== 'c74') {
                                setSubmitError(res.message);
                                window.location.reload();
                            } else {
                                swal({
                                    title: 'Success',
                                    text: 'Users have been updated successfully',
                                    icon: 'success',
                                    buttons: [false, true],
                                }).then(() => {
                                    setDropdown(false);
                                    window.location.reload();
                                });
                            }
                        }
                    });
                }
            } else {
                setDropdown(false);
                return false;
            }
        });
    };

    const checkboxRef = React.createRef<HTMLInputElement>();

    const order = useCallback(
        (a, b) => {
            console.log('initial order by', orderBy)
            if (orderBy) {
                if (orderBy === 'name') {
                    if (orderType) {
                        if (orderType === 'desc') {
                            if (a.first_name + ' ' + a.last_name < b.first_name + ' ' + b.last_name) {
                                return -1;
                            }
                            if (a.first_name + ' ' + a.last_name > b.first_name + ' ' + b.last_name) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a.first_name + ' ' + a.last_name < b.first_name + ' ' + b.last_name) {
                                return 1;
                            }
                            if (a.first_name + ' ' + a.last_name > b.first_name + ' ' + b.last_name) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'license') {
                    if (orderType) {
                        if (orderType === 'desc') {
                            if (
                                licenses.filter((license) => Number(license.id) === a.candidate_license)[0].name <
                                licenses.filter((license) => Number(license.id) === b.candidate_license)[0].name
                            ) {
                                return -1;
                            }
                            if (
                                licenses.filter((license) => Number(license.id) === a.candidate_license)[0].name >
                                licenses.filter((license) => Number(license.id) === b.candidate_license)[0].name
                            ) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (
                                licenses.filter((license) => Number(license.id) === a.candidate_license)[0].name <
                                licenses.filter((license) => Number(license.id) === b.candidate_license)[0].name
                            ) {
                                return 1;
                            }
                            if (
                                licenses.filter((license) => Number(license.id) === a.candidate_license)[0].name >
                                licenses.filter((license) => Number(license.id) === b.candidate_license)[0].name
                            ) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'office') {
                    if (orderType) {
                        if (orderType === 'desc') {
                            if (a.city < b.city) {
                                return -1;
                            }
                            if (a.city > b.city) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a.city < b.city) {
                                return 1;
                            }
                            if (a.city > b.city) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'department') {
                    if (orderType) {
                        if (orderType === 'desc') {
                            if (a.department_name < b.department_name) {
                                return -1;
                            }
                            if (a.department_name > b.department_name) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a.department_name < b.department_name) {
                                return 1;
                            }
                            if (a.department_name > b.department_name) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'cohort') {
                    if (orderType) {
                        let a_name =
                            a.pp_cohorts && a.pp_cohorts.length > 0
                                ? a.pp_cohorts.map((e: GroupObj) => e.name).join(', ')
                                : 'zzzzzzzzzzzz';
                        let b_name =
                            b.pp_cohorts && b.pp_cohorts.length > 0
                                ? b.pp_cohorts.map((e: GroupObj) => e.name).join(', ')
                                : 'zzzzzzzzzzzz';
                        if (orderType === 'desc') {
                            if (a_name < b_name) {
                                return -1;
                            }
                            if (a_name > b_name) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a_name < b_name) {
                                return 1;
                            }
                            if (a_name > b_name) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'activated_date') {
                    let a_activated_date = a.activated_date ? a.activated_date : a.requested ? a.requested : '';
                    let b_activated_date = b.activated_date ? b.activated_date : b.requested ? b.requested : '';
                    if (orderType) {
                        if (orderType === 'desc') {
                            if (a_activated_date < b_activated_date) {
                                return -1;
                            }
                            if (a_activated_date > b_activated_date) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a_activated_date < b_activated_date) {
                                return 1;
                            }
                            if (a_activated_date > b_activated_date) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                } else if (orderBy === 'userpipeline_status') {
                    let a_pl = getUserPipelineStatus(a.userpipeline_status);
                    let b_pl = getUserPipelineStatus(b.userpipeline_status);;

                    if (orderType) {
                        if (orderType === 'desc') {
                            if (a_pl.progress < b_pl.progress) {
                                return -1;
                            }
                            if (a_pl.progress > b_pl.progress) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (a_pl.progress < b_pl.progress) {
                                return 1;
                            }
                            if (a_pl.progress > b_pl.progress) {
                                return -1;
                            }
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                }
            } else {
                return 0;
            }
            return 0;
        },
        [orderBy, orderType],
    );

    const handleTableHeaderClick = (id: string) => {
        if (orderBy === id) {
            if (!orderType) setOrderType('asc');
            else if (orderType === 'asc') setOrderType('desc');
            else setOrderType('asc');
        } else {
            setOrderBy(id);
            setOrderType('asc');
        }
    };

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
        localStorage.setItem('user_engagement_filter--data', JSON.stringify(advancedFilters));
    };

    useEffect(() => { }, []);

    const handleFilterSelection = (event: React.SyntheticEvent, target: string, parent: string) => {
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
        localStorage.setItem('user_engagement_filter--data', JSON.stringify(advancedFilters));
    };

    useEffect(() => {
        if (selectedMembers.length > 0 && selectedMembers.length < (members?.length as number)) {
            if (checkboxRef.current) {
                checkboxRef.current.indeterminate = true;
            }
        } else {
            if (checkboxRef.current) {
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = selectedMembers.length > 0;
            }
        }
    }, [selectedMembers]);

    const handleFilterOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setOpenMemberFilters(!openMemberFilters);
    };

    const filterRequestedMembers = () => {
        setSelectedMembers([])
        setRequestFilter(!requestFilter)
        localStorage.setItem('user_engagement_filter--data-2', JSON.stringify(!requestFilter));
    }
    const checkViewModLicenseStatus = (name: string) => {
        if (viewMode === 1) {
            // if (['exempt', 'latent',].includes(name.toLowerCase()) || ['Exempted', "Flagged", "Honorary", "Requested", "Licensed (Locked)", "Unlicensed"].includes(name)) {
            if (['Exempted', "Flagged", "Honorary", "Requested", "Licensed (Locked)", "Unlicensed"].includes(name)) {
                    return 'none'
            } else {
                return 'all'
            }
        }
    }
    return (
        <>
            {openMemberFilters && <Overlay onClick={() => setOpenMemberFilters(!openMemberFilters)}></Overlay>}
            <Container>
                {selectedMembers.length > 0 && dropdown && (
                    <div className="dropdownlayout" onClick={toggleDropdown}></div>
                )}
                <TopBar>
                    <DashboadHeaderFilters>
                        <Title>
                            {requestFilter ? `CariClub Invite Requests` : `CariClub Members`}</Title>
                        <ActionsContainer onClick={filterRequestedMembers}>
                            <Tooltip title="Respond to employee invite request to join CariClub">
                                <RingBell className={requestFilter ? 'active' : ''} src={Ringbell} alt="Requested Member"></RingBell>
                            </Tooltip>
                            {reqMembers.filter((reqMember: any) => reqMember.work_email != "").length > 0 && (
                                <span>{reqMembers.filter((reqMember: any) => reqMember.work_email != "").length}</span>
                            )}
                        </ActionsContainer>

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

                                    <ItemLabel onClick={handleFilterOpen}>
                                        <Filter id="filter_icon" />
                                    </ItemLabel>
                                </SearchItem>

                                {openMemberFilters && (
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
                                                                    filter !== 'allocation' && filter !== 'employment'
                                                                        ? true
                                                                        : false,
                                                                )
                                                            }
                                                            checked={
                                                                Object.keys(advancedFilters[filter]).filter(
                                                                    (key) => advancedFilters[filter][key] === true,
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
                                                                ctypes[cohortTypeStats[filter].type] === 'Public' ? (
                                                                    <span className="public-icon">
                                                                        <Globe />
                                                                    </span>
                                                                ) : ctypes[cohortTypeStats[filter].type] ===
                                                                    'Private' ? (
                                                                    <span className="private-icon">
                                                                        <Private />
                                                                    </span>
                                                                ) : ctypes[cohortTypeStats[filter].type] ===
                                                                    'Cariclub' ? (
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
                                                        {Object.keys(advancedFilters[filter]).map((children, _id) => (
                                                            <label key={_id}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`child_${_id}`}
                                                                    onChange={(event: React.SyntheticEvent) =>
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
                                                                    checked={advancedFilters[filter][children]}
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
                                                        ))}
                                                    </FilterChildrenContainer>
                                                </FilterContainer>
                                            );
                                        })}
                                    </AdvancedFiltersContainer>
                                )}
                            </div>

                            <FilterItem onClick={handleAllClick}>
                                <ItemLabel>
                                    {localStorage.getItem('all_click_tracker--engagement') === 'true'
                                        ? 'Select All'
                                        : !localStorage.getItem('all_click_tracker--engagement')
                                            ? 'Select All'
                                            : 'Unselect All'}
                                </ItemLabel>
                            </FilterItem>
                            {/* <DropdownItem>
                                <select value={filterLocation} onChange={locationFilter}>
                                    <option key="0" value="" selected disabled>
                                        Location
                                    </option>
                                    <option key="1" value="all">
                                        All
                                    </option>
                                    {getLocations().map((location: any, key) => {
                                        return (
                                            <option key={key} value={location}>
                                                {location}
                                            </option>
                                        );
                                    })}
                                </select>
                            </DropdownItem> */}

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
                        </FiltersContainer>
                    </DashboadHeaderFilters>
                    {/* <DashboardButtonContainer>
                        <DownloadButton>
                            <ItemLabel>
                                Download data <Download />
                            </ItemLabel>
                        </DownloadButton>
                    </DashboardButtonContainer> */}
                </TopBar>

                <Table>
                    <TableHeader>
                        <tr>
                            <th style={{ maxWidth: '50px' }}>
                                <EditDropdown>
                                    <CheckboxContainer>
                                        <CheckboxInputAll
                                            type="checkbox"
                                            ref={checkboxRef}
                                            checked={selectedMembers.length === members?.length || selectedMembers.length === reqMembers?.length || checkAll}
                                            onChange={handleCheckAll}
                                            id="check_all"
                                        />
                                    </CheckboxContainer>
                                    <Dropdown>
                                        <li className="nav-item dropdown">
                                            <DropdownToggle
                                                onClick={toggleDropdown}
                                                className="dropdown-toggle"
                                                isDisabled={selectedMembers.length < 1}
                                            >
                                                <Arrow className="arrowIcon" />
                                            </DropdownToggle>
                                            {selectedMembers.length > 0 && dropdown && (
                                                <>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <span>
                                                                Employment status{' '}
                                                                <DropdownIcon
                                                                    className="DropdownIcon"
                                                                    style={{ transform: 'rotate(-90deg)' }}
                                                                />
                                                            </span>
                                                            <ul className="dropdown-menu dropdown-submenu">
                                                                {links &&
                                                                    links.map((link: GroupObj) => (
                                                                        <li
                                                                            key={`cariclub_links_${link.id}`}
                                                                            onClick={(e) =>
                                                                                handleUpdateLink(e, link.id)
                                                                            }
                                                                            style={{
                                                                                pointerEvents:
                                                                                    (viewMode === 1 &&
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
                                                                                {link.name}
                                                                                <span className="lock-icon">
                                                                                    {viewMode === 1 &&
                                                                                        [
                                                                                            'stakeholder',
                                                                                            'designee',
                                                                                            'disavowed',
                                                                                            'secondee',
                                                                                            'assisted',
                                                                                        ].includes(
                                                                                            link.name.toLowerCase(),
                                                                                        ) && <Lock />}
                                                                                </span>
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                License status{' '}
                                                                <DropdownIcon
                                                                    className="DropdownIcon"
                                                                    style={{ transform: 'rotate(-90deg)' }}
                                                                />
                                                            </span>
                                                            <ul className="dropdown-menu dropdown-submenu">
                                                                {licenses &&
                                                                    licenses.map(
                                                                        (license: { name: string; id: string }) => {
                                                                            return (
                                                                                <li
                                                                                    key={`cariclub_licenses_${license.id}`}
                                                                                    onClick={(e) =>
                                                                                        handleUpdateLicense(e, license.id)
                                                                                    }
                                                                                    style={{
                                                                                        pointerEvents: checkViewModLicenseStatus(license.name)
                                                                                    }}
                                                                                >
                                                                                    <span>
                                                                                        {license.name}
                                                                                        <span className="lock-icon">
                                                                                            {viewMode === 1 &&
                                                                                                [
                                                                                                    'exempt',
                                                                                                    'latent',
                                                                                                ].includes(
                                                                                                    license.name.toLowerCase(),
                                                                                                ) && <Lock />}
                                                                                        </span>
                                                                                    </span>
                                                                                </li>
                                                                            )
                                                                        }
                                                                    )}
                                                            </ul>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                CariClub role{' '}
                                                                <DropdownIcon
                                                                    className="DropdownIcon"
                                                                    style={{ transform: 'rotate(-90deg)' }}
                                                                />
                                                            </span>
                                                            <ul className="dropdown-menu dropdown-submenu">
                                                                {roles &&
                                                                    roles.map((role: GroupObj) => (
                                                                        <li
                                                                            key={`cariclub_roles_${role.id}`}
                                                                            onClick={(e) =>
                                                                                handleUpdateRole(e, role.id)
                                                                            }
                                                                            style={{
                                                                                pointerEvents:
                                                                                    (viewMode === 1 && 'none') || 'all',
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                {role.name}
                                                                                <span className="lock-icon">
                                                                                    {viewMode === 1 && <Lock />}
                                                                                </span>
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        </li>
                                                        <li className="line-breaker">
                                                            <span className="type-breaker"></span>
                                                        </li>
                                                        {Object.keys(advancedFilters)
                                                            .filter(
                                                                (key) =>
                                                                    !['allocation', 'employment'].includes(key) &&
                                                                    groups.filter(
                                                                        (group: GroupObj) =>
                                                                            group.type_name.toLowerCase() ===
                                                                            key.toLowerCase(),
                                                                    )[0]?.type_is_primary === 1,
                                                            )
                                                            .map((parent) => (
                                                                <li>
                                                                    <span className="category-menu">
                                                                        {parent}{' '}
                                                                        <DropdownIcon
                                                                            className="DropdownIcon"
                                                                            style={{ transform: 'rotate(-90deg)' }}
                                                                        />
                                                                    </span>
                                                                    <ul className="dropdown-menu dropdown-submenu">
                                                                        {Object.keys(advancedFilters[parent]) &&
                                                                            Object.keys(advancedFilters[parent]).map(
                                                                                (children: string) => (
                                                                                    <li
                                                                                        key={`groups_${parent}_${children}`}
                                                                                        onClick={(e) =>
                                                                                            handleUpdateGroup(
                                                                                                e,
                                                                                                groups.filter(
                                                                                                    (group) =>
                                                                                                        group.name.toLowerCase() ===
                                                                                                        children.toLowerCase(),
                                                                                                )[0]?.id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <span>{children}</span>
                                                                                    </li>
                                                                                ),
                                                                            )}
                                                                    </ul>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </>
                                            )}
                                        </li>
                                    </Dropdown>
                                </EditDropdown>
                                {requestFilter ?
                                    <SelectionCounter>{selectedMembers.length ? selectedMembers.length : reqMembers?.length} </SelectionCounter>
                                    :
                                    <SelectionCounter>{selectedMembers.length ? selectedMembers.length : filteredMembers?.length} </SelectionCounter>
                                }
                            </th>
                            <th onClick={() => handleTableHeaderClick('name')}>
                                <p>
                                    Name{' '}
                                    {orderBy === 'name' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            <th onClick={() => handleTableHeaderClick('license')}>
                                <p>
                                    License Status{' '}
                                    {orderBy === 'license' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            <th onClick={() => handleTableHeaderClick('userpipeline_status')}>
                                <p>
                                    Milestone Marker{' '}
                                    {orderBy === 'userpipeline_status' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            <th onClick={() => handleTableHeaderClick('office')}>
                                <p>
                                    Office{' '}
                                    {orderBy === 'office' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            <th onClick={() => handleTableHeaderClick('department')}>
                                <p>
                                    Department{' '}
                                    {orderBy === 'department' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            <th onClick={() => handleTableHeaderClick('activated_date')}>
                                <p>
                                    Date Activated{' '}
                                    {orderBy === 'activated_date' && orderType && (
                                        <span className="order-icon">
                                            <DropdownIcon
                                                style={{
                                                    transform: orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </span>
                                    )}
                                </p>
                            </th>
                            {groups.length &&
                                groups.filter((e) => e.type_type == 2 && e.type_is_primary == 1).length ? (
                                <th onClick={() => handleTableHeaderClick('cohort')}>
                                    <p>
                                        {groups.filter((e) => e.type_type == 2 && e.type_is_primary == 1)[0].type_name}{' '}
                                        {orderBy === 'cohort' && orderType && (
                                            <span className="order-icon">
                                                <DropdownIcon
                                                    style={{
                                                        transform:
                                                            orderType === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    }}
                                                />
                                            </span>
                                        )}
                                    </p>
                                </th>
                            ) : (
                                <></>
                            )}
                            <th></th>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {!requestFilter && (filteredMembers && filteredMembers)
                            ?.filter((member: ReportingAPI.MemberInsight) => {
                                return filterLocation.toLowerCase() === 'all'
                                    ? (member.first_name + ' ' + member.last_name)
                                        .toLowerCase()
                                        .includes(searchKey.toLowerCase())
                                    : (member.city?.toLowerCase().includes(filterLocation.toLowerCase()) ||
                                        filterLocation
                                            .toLowerCase()
                                            .includes(member.city?.toLowerCase() as string)) &&
                                    (member.first_name + ' ' + member.last_name)
                                        .toLowerCase()
                                        .includes(searchKey.toLowerCase());
                            })
                            ?.sort(order)
                            ?.map((member: ReportingAPI.MemberInsight, key) => (
                                <tr
                                    key={key}
                                    style={{
                                        position: 'relative',
                                        background: selectedMembers.includes(member.key) ? '#f2f6ff' : '#fff',
                                    }}
                                >
                                    <td style={{ maxWidth: '70px' }}>
                                        <CheckboxInput
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.key)}
                                            onChange={(e: React.SyntheticEvent) => handleMemberSelection(e, member.key)}
                                        />
                                        {member.row_no}
                                    </td>
                                    <td style={{ overflow: 'visible', justifyContent: 'flex-start' }}>
                                        <ImageNameContainer>
                                            <ProfileContainer>
                                                <ProfileImgContainer onClick={() => navigateToMember(member)}>
                                                    <ProfileImg
                                                        src={
                                                            member.profile_url &&
                                                                !member.profile_url.includes('media.licdn')
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
                                                </ProfileImgContainer>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '4px',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {member.pipeline_statuses &&
                                                            member.pipeline_statuses.length > 0 &&
                                                            member.pipeline_statuses.filter(
                                                                (pps) => pps.is_nonprofit === 1,
                                                            ).length > 0 &&
                                                            [
                                                                ...new Set(
                                                                    member.pipeline_statuses
                                                                        .filter((pps) => pps.is_nonprofit === 1)
                                                                        .map((pps) => pps.nonprofit_logo),
                                                                ),
                                                            ]
                                                                .slice(0, 2)
                                                                .map((pps) => (
                                                                    <MemberNonprofit>
                                                                        {pps && (
                                                                            <Tooltip
                                                                                title={
                                                                                    member.pipeline_statuses.filter(
                                                                                        (_pps) =>
                                                                                            _pps.nonprofit_logo === pps,
                                                                                    )[0].nonprofit_name
                                                                                }
                                                                            >
                                                                                {(_cc_token !== null && _cc_token.type == 'Internal' && viewMode == 0) ?
                                                                                    (
                                                                                        <a target="_blank" href={config.cc_admin_url + `/organizations/` + member.pipeline_statuses.filter(
                                                                                            (_pps) =>
                                                                                                _pps.nonprofit_logo === pps,
                                                                                        )[0].nonprofit_guid}>
                                                                                            <img src={pps} />
                                                                                        </a>
                                                                                    ) : (
                                                                                        <img src={pps} />
                                                                                    )}
                                                                            </Tooltip>
                                                                        )}
                                                                    </MemberNonprofit>
                                                                ))}
                                                        {member.pipeline_statuses &&
                                                            member.pipeline_statuses.length > 0 && [
                                                                ...new Set(
                                                                    member.pipeline_statuses
                                                                        .filter((pps) => pps.is_nonprofit === 1)
                                                                        .map((pps) => pps.nonprofit_logo),
                                                                ),
                                                            ].length > 2 && (
                                                                <MoreNonProfits>
                                                                    +
                                                                    {[
                                                                        ...new Set(
                                                                            member.pipeline_statuses
                                                                                .filter((pps) => pps.is_nonprofit === 1)
                                                                                .map((pps) => pps.nonprofit_logo),
                                                                        ),
                                                                    ].length - 2}
                                                                </MoreNonProfits>
                                                            )}
                                                    </div>
                                                </div>
                                            </ProfileContainer>
                                            <Tooltip title={member.first_name + ' ' + member.last_name}>
                                                <div
                                                    onClick={() => navigateToMember(member)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        maxWidth: '160px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {member.first_name || ''} {member.last_name || ''}
                                                    {clientViewAvailable(member) && (
                                                        <span>
                                                            <EyeImg src={eyeImg} alt="Not showing on client view"></EyeImg>
                                                        </span>
                                                    )}
                                                </div>
                                            </Tooltip>
                                        </ImageNameContainer>
                                    </td>
                                    <td style={{ padding: '5px 0' }}>
                                        {licenses.filter(
                                            (license) => Number(license.id) === member.candidate_license,
                                        )[0]?.name || '-'}
                                    </td>
                                    <td style={{ height: '100%' }}>
                                        <Tooltip title={getUserPipelineStatus(member.userpipeline_status).position + `: ` + getUserPipelineStatus(member.userpipeline_status).description}>
                                            <p>{getUserPipelineStatus(member.userpipeline_status).stage} [{getUserPipelineStatus(member.userpipeline_status).progress}%]</p>
                                        </Tooltip>
                                    </td>
                                    <td style={{ padding: '5px 0' }}>
                                        {member.organization + ' - ' + member.city || ''}
                                    </td>
                                    <td style={{ padding: '5px 0' }}>{member.department_name}</td>
                                    <td style={{ padding: '5px 0' }}>{member.activated_date || ''}</td>
                                    {groups.length &&
                                        groups.filter((e) => e.type_type == 2 && e.type_is_primary == 1).length > 0 ? (
                                        <td style={{ padding: '5px 0' }}>
                                            {member.pp_cohorts && member.pp_cohorts.length > 0
                                                ? member.pp_cohorts.map((e) => e.name).join(', ')
                                                : ''}
                                        </td>
                                    ) : (
                                        <></>
                                    )}
                                    <td style={{ height: '100%' }}>
                                        <Dots />
                                    </td>
                                </tr>
                            ))}

                        {requestFilter && reqMembers && reqMembers.length > 0 &&
                            reqMembers.filter((reqMember: any) => {
                                return reqMember.work_email && (filterLocation.toLowerCase() === 'all'
                                    ? (reqMember.first_name + ' ' + reqMember.last_name)
                                        .toLowerCase()
                                        .includes(searchKey.toLowerCase())
                                    : (reqMember.city?.toLowerCase().includes(filterLocation.toLowerCase()) ||
                                        filterLocation
                                            .toLowerCase()
                                            .includes(reqMember.city?.toLowerCase() as string)) &&
                                    (reqMember.first_name + ' ' + reqMember.last_name)
                                        .toLowerCase()
                                        .includes(searchKey.toLowerCase()));
                            })?.sort(order).map((reqMember: any, key) => (
                                <tr
                                    key={key}
                                    style={{
                                        position: 'relative',
                                        background: selectedMembers.includes(reqMember.key) ? '#f2f6ff' : '#fff',
                                    }}
                                >
                                    <td style={{ maxWidth: '70px' }}>
                                        <CheckboxInput
                                            type="checkbox"
                                            checked={selectedMembers.includes(reqMember.key)}
                                            onChange={(e: React.SyntheticEvent) => handleMemberSelection(e, reqMember.key)}
                                        />
                                        {reqMember.row_no}
                                    </td>
                                    <td style={{ overflow: 'visible', justifyContent: 'flex-start' }}>
                                        <ImageNameContainer>
                                            <ProfileContainer>
                                                <ProfileImgContainer onClick={() => navigateToReqMember(reqMember)}>
                                                    <ProfileImg
                                                        src={defaultProfileImg}
                                                        alt="profile-image"
                                                    />
                                                    <RingBell src={Ringbell} alt="Requested Member"></RingBell>
                                                    {/* <Tooltip title={getMemberTooltip(member).title}>
                                                        <LicenseStatusCircle
                                                            shape={getMemberTooltip(member).shape}
                                                            status={getMemberTooltip(member).color}
                                                        />
                                                    </Tooltip> */}
                                                </ProfileImgContainer>
                                            </ProfileContainer>
                                            <Tooltip title={reqMember.first_name + ' ' + reqMember.last_name}>
                                                <div
                                                    onClick={() => navigateToReqMember(reqMember)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        maxWidth: '160px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {reqMember.first_name || ''} {reqMember.last_name || ''}
                                                </div>
                                            </Tooltip>
                                        </ImageNameContainer>
                                    </td>
                                    <td style={{ padding: '5px 0' }}>
                                        {licenses.filter(
                                            (license) => Number(license.id) === reqMember.candidate_license,
                                        )[0]?.name || '-'}
                                    </td>
                                    <td style={{ height: '100%' }}>
                                        <Tooltip title={getUserPipelineStatus(reqMember.userpipeline_status).position + `: ` + getUserPipelineStatus(reqMember.userpipeline_status).description}>
                                            <p>{getUserPipelineStatus(reqMember.userpipeline_status).stage} [{getUserPipelineStatus(reqMember.userpipeline_status).progress}%]</p>
                                        </Tooltip>
                                    </td>
                                    <td style={{ padding: '5px 0' }}>
                                        {reqMember.organization + ' - ' + reqMember.city || ''}
                                    </td>
                                    <td style={{ padding: '5px 0' }}>-</td>
                                    <td style={{ padding: '5px 0' }}>Requested on<br />{reqMember.requested ? reqMember.requested.slice(0, 10) : ''}</td>
                                    {groups.length &&
                                        groups.filter((e) => e.type_type == 2 && e.type_is_primary == 1).length > 0 ? (
                                        <td style={{ padding: '5px 0' }}>
                                        </td>
                                    ) : (
                                        <></>
                                    )}
                                    <td style={{ height: '100%' }}>
                                        <Dots />
                                    </td>
                                </tr>
                            ))
                        }
                    </TableBody>
                </Table>
            </Container>
        </>
    );
};

export default Engagement;
