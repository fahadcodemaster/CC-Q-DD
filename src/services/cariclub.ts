import axios from 'axios';
// import { API } from 'aws-amplify'
import config from '../config';
import { ReportingAPI } from '../../types';

interface UserCredentials {
	email: string;
	password: string;
}
interface AuthResponse {
	status: 'success' | 'error';
	message: string;
	data: any;
}

export const getToken: (user?: UserCredentials) => Promise<AuthResponse> = async (user?: UserCredentials) => {
	const cc_apiGateway = config.cc_apiGateway;
	console.log(cc_apiGateway);

	return new Promise((resolve) => {
		axios
			.post(`${cc_apiGateway}`, {
				action: 'Q login',
				data: {
					email: user?.email,
					password: user?.password,
				},
			})
			.then((res) => {
				if (res.data.message === 'OK') {
					localStorage.setItem(
						'cc_token',
						JSON.stringify({ token: res.data.data.token, member_key: res.data.data.member_key, type: res.data.data.type }),
					);
					resolve(res.data);
				} else {
					resolve(res.data);
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				resolve(err.response.data);
			});
	});
};

export const logoutAPI = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Terminate session',
			token: cc_token.token
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then((res) => {
				// console.log(res.data);
				return true;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return true;
			});
	}
	return true
}

export const verifyLogin = () => {
	return localStorage.getItem('cc_token');
};

export const sendResetPasswordEmail = (email: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const options = {
		action: 'Reset password',
		data: {
			email: email
		}
	};

	return axios
		.post(`${cc_apiGateway}`, options)
		.then((res) => {
			console.log(res.data);
			return res.data;
		})
		.catch((err) => {
			console.log(`☠ ERROR`);
			console.log(err);
			return false;
		});
}

export const getUserData = async (member_key?: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get member profile data',
			token: cc_token.token,
			data: {
				member_key: member_key && member_key !== undefined ? member_key: cc_token.member_key
			}
		};

		return axios
			.post(`${cc_apiGateway}`, options)
			.then((res) => {
				console.log(res.data.data.member);
				return res.data.data.member;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return null;
			});
	} else {
		return [];
	}
}

export const getCompanies = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get org list for Q',
			token: cc_token.token,
			data: {
				org_type_filter: 'Company',
				cause_filter: '',
				sector_filter: '',
				status_filter: 'Active',
				location_filter: 'All',
				platformstatus_filter: 1,
				template: '',
				order_by: 'null',
				page: 1,
				page_size: 600,
				is_asc: 1
			}
		};

		return axios
			.post(`${cc_apiGateway}`, options)
			.then((res) => {
				// console.log(res.data);
				if (res.data.data.records) {
					let records = res.data.data && res.data.data.records ? res.data.data.records : [];
					let final_records: any = [];
					if (records.length > 0) {
						for (let key in records) {
							let exist_orgs = final_records.filter((el: any) => el.org_key == records[key].org_key);
							if (exist_orgs.length == 0) {
								final_records.push(records[key]);
							}
						}
					}
					return final_records;
				} else {
					return [];
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return [];
			});
	} else {
		return [];
	}
};

export const getCompanyDashboard = async (org_key: any, viewMode: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');

	if (!!_cc_token) {

		const cc_token = JSON.parse(_cc_token);
		return axios
			.post(`${cc_apiGateway}`, {
				action: 'Get admin dashboard data',
				token: cc_token.token,
				data: {
					org_key: org_key || '2d2989ad-3eca-11e8-b9c0-12e0c395e778',
					only_public: viewMode
				},
			})
			.then((res) => {
				console.log('resdata', res.data)
				return res.data.data
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return [];
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}

}

export const getApplications = async (member_key: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		return axios
			.post(`${cc_apiGateway}`, {
				action: 'Admin get member applications',
				token: cc_token.token,
				data: {
					member_key: member_key,
				},
			})
			.then((res) => {
				// console.log(res)
				if (res.data.code == 'c55') {
					// console.log(res.data.data);
					return res.data.data;
				} else {
					return [];
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return [];
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};

export const getLocations = async (org_key: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const options = {
		action: 'Get list of cities',
		data: {
			org_key: org_key,
			state: '',
			template: '',
		},
	};
	return axios
		.post(`${cc_apiGateway}`, options)
		.then(async (res) => {
			// console.log(res.data.data.cities);
			return res.data.data.cities;
		})
		.catch((err) => {
			console.log(`☠ ERROR`);
			console.log(err);
		});
};

export const getMemberFandom = async (member_key: string, page: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get member fandom nonprofits',
			token: cc_token.token,
			data: {
				member_key: member_key,
				page: page
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getPipelineStatuses = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Pipeline Statuses',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.pipeline_statuses;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};
export const getATSStatuses = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Application Statuses',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.ats_statuses;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};
export const updateATS = async (application_guid: any, ats_name: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Change application status',
			token: cc_token.token,
			data: {
				'application_key': application_guid,
				'status': ats_name,
				'send_notification': null,
				'undo': true,
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const updateMemberStatus = async (data: any) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Update Member Statuses',
			token: cc_token.token,
			data: data,
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const updateApplicationPipelineStatus = async (application_guid: any, pipeline_status: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Update Application Pipeline Status',
			token: cc_token.token,
			data: {
				'application_guid': application_guid,
				'pipeline_status': pipeline_status
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}
export const getMilestoneMarkers = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Milestone Markers',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.milestone_markers;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};
export const getEngagementStatuses = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Engagement Statuses',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.engagement_statuses;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};
export const getLicenseTypes = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get License Types',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.license_types;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getLicenseTerms = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get License Terms',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.license_terms;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getCariclubRoles = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Cariclub Roles',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.cariclub_roles;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getCandidateLicenses = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Candidate License',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.candidate_license;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getDepartmentByCompany = async (org_key: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get list of departments',
			token: cc_token.token,
			data: {
				org_key: org_key,
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.departments;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getOrgListwithOffices = async (org_type: string | null, search_key: string | null) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get list of orgs',
			token: cc_token.token,
			data: {
				org_type: org_type,
				template: search_key
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.organizations;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getCities = async (search_key: string | null) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get list of cities',
			token: cc_token.token,
			data: {
				org_type: null,
				template: search_key,
				state: null
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.cities;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const createUser = async (data: any) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Create member by admin',
			token: cc_token.token,
			data: data,
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const requestReviewSubmit = async (data: any) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Review access request',
			token: cc_token.token,
			data: data,
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const updateUser = async (data: any) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Update User for Q',
			token: cc_token.token,
			data: data,
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getMemberStats = async (member_key: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get User Stats for Q',
			token: cc_token.token,
			data: {
				user_key: member_key
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getMemberTypes = async () => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Member Types',
			token: cc_token.token,
			data: {},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.member_types;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
};

export const getAdminLogs = async (org_key?: string, member_key?: string, viewMode?: number, commentActionType?: number, filterValues?: any, page?: number, page_size?: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin get logs',
			token: cc_token.token,
			data: {
				org_key: org_key || null,
				member_key: member_key || null,
				page: page || 1,
				page_size: page_size || 5,
				only_public: cc_token.type == "Internal" ? (viewMode || 0) : 1,
				comment_action_type: commentActionType || null,
				filter_values: JSON.stringify(filterValues) || null
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res.data);
				if (res.data.data == null) {
					return [];
				}
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return [];
			});
	} else {
		return [];
	}
};

export const getMonthlyReports = async (
	org_key: string,
	viewMode?: number
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get monthly reports',
			token: cc_token.token,
			data: {
				org_key: org_key || null,
				only_public: cc_token.type == "Internal" ? (viewMode || 0) : 1
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res.data);
				if (res.data.data == null) {
					return [];
				}
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return [];
			});
	} else {
		return [];
	}
}

export const updateGoogleSheet = async (
	org_key?: string
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get members for q googlesheet',
			token: cc_token.token,
			data: {
				org_key: org_key || null
			}
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return 'success';
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getMembersForExport = async (
	org_key: string
	// search_key: string,
	// location_key: string,
	// term: string,
	// type_filter?: number,
	// engagement_status?: number,
	// viewMode?: number,
	// is_alumni?: number
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get members for q export',
			token: cc_token.token,
			data: {
				org_key: org_key,
				org_location_key: null,
				org_type_filter: null,
				status_filter: 'All',
				permission_filter: null,
				location_filter: null,
				term_filter: null,
				member_type_filter: null,
				engagement_status_filter: null,
				template: null,
				page: 1,
				page_size: 600,
				order_by: 'First Name',
				is_asc: 1,
				is_external: cc_token.type == 'External' ? 1 : 0,
				only_public: 0,
				is_alumni: 0
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res);
				const xhr = res.request;
				let filename = '';
				const disposition = xhr.getResponseHeader('Content-Disposition');
				console.log(disposition);
				if (disposition && disposition.indexOf('attachment') !== -1) {
					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
					const matches = filenameRegex.exec(disposition);
					if (matches !== null && matches[1]) filename = matches[1].replace(/['"]/g, '');

					const type = xhr.getResponseHeader('Content-Type');
					const BOM = '\uFEFF';
					const csvContent = BOM + xhr.responseText;
					const blob = new Blob([csvContent], { type: type });

					// if (typeof window.navigator.msSaveBlob !== 'undefined') {
					//     // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created.
					//     // These URLs will no longer resolve as the data backing the URL has been freed."
					//     window.navigator.msSaveBlob(blob, filename);
					// } else {
					const URL = window.URL || window.webkitURL;
					const downloadUrl = URL.createObjectURL(blob);
					if (filename) {
						// use HTML5 a[download] attribute to specify filename
						const a = document.createElement('a');
						// safari doesn't support this yet

						a.href = downloadUrl;
						a.download = filename;
						document.body.appendChild(a);
						a.click();
					}
					// $('.dataOutHeaders').val(xhr.getAllResponseHeaders());
					setTimeout(function () {
						URL.revokeObjectURL(downloadUrl);
					}, 100); // cleanup
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	}
};

export const getCompanyData = async (
	org_key: string,
	org_name: string,
	search_key: string,
	location_key: string,
	term: string,
	type_filter?: number,
	engagement_status?: number,
	viewMode?: number,
	is_alumni?: number
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const companyInsight: ReportingAPI.CompanyInsight = {
		company_interests: {},
		company_statuses: {
			Elected: [],
			Applied: [],
			Enrolled: [],
			Paused: [],
			Suspended: [],
		},
		org_key: org_key,
		org_name: org_name,
	};
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get all members for q',
			token: cc_token.token,
			data: {
				org_key: org_key,
				org_location_key: null,
				org_type_filter: null,
				status_filter: 'All',
				permission_filter: null,
				location_filter: location_key === undefined || location_key === '' ? null : location_key,
				term_filter: term === undefined || term === '' ? null : term,
				member_type_filter: type_filter === undefined || type_filter === 0 ? null : type_filter,
				engagement_status_filter: engagement_status === undefined || engagement_status === 0 ? null : engagement_status,
				template: search_key,
				page: 1,
				page_size: 600,
				order_by: 'First Name',
				is_asc: 1,
				is_external: cc_token.type == 'External' ? 1 : 0,
				only_public: cc_token.type == "Internal" ? (viewMode || 0) : 1,
				is_alumni: is_alumni || 0,
				// groups: '[1, 2]'
			},
		};
		// console.log(options);
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				
				if (res.data.data.records) {
					const resultTmp = {
						company: { ...companyInsight },
						members: [],
						nonprofits: [],
					} as ReportingAPI.PrimaryCompanyData;

					const members = res.data.data.records;
					for (let i = 0; i < members.length; i++) {
						const member = members[i];
						const memberInsight: ReportingAPI.MemberInsight = {
							...member,
							interests: formatInterests(member.causes),
							// fan_of: JSON.parse(member.fan_of),
							fan_of: [],
							status: convertStatus(member.matching_status),
							member_history: [],
							applications: [],
						};
						const memberInterests = memberInsight.interests;
						const companyStatuses = resultTmp.company.company_statuses;
						if (!companyStatuses[memberInsight.status]) {
							companyStatuses[memberInsight.status] = [memberInsight.key];
						} else {
							companyStatuses[memberInsight.status].push(memberInsight.key);
						}
						memberInterests.forEach((interest: string) => {
							const companyInterest = resultTmp.company.company_interests;
							if (!companyInterest[interest]) {
								companyInterest[interest] = 1;
							} else {
								companyInterest[interest] = companyInterest[interest] + 1;
							}
						});
						// // console.log(member.key);
						// const memberApplications = await getApplications(member.key);
						// // console.log("Applications", memberApplications);
						// memberInsight.applications = memberApplications;

						resultTmp.members.push(memberInsight);
					}
					const result = {
						company: { ...resultTmp.company },
						members: [...resultTmp.members],
						nonprofits: [...resultTmp.nonprofits],
					};

					return result;

					// return res.data.data.records;
				} else {
					return {
						company: { ...companyInsight },
						members: [],
						nonprofits: [],
					};
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {
					company: { ...companyInsight },
					members: [],
					nonprofits: [],
				};
			});
	} else {
		return {
			company: { ...companyInsight },
			members: [],
			nonprofits: [],
		};
	}
};

export const getMemberSearch = async (
	search_key: string
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get all members for q search',
			token: cc_token.token,
			data: {
				template: search_key
			},
		};
		// console.log(options);
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				
				if (res.data.data.records) {
					const members = res.data.data.records;
					
					const result = {
						members: members
					};

					return result;
				} else {
					return {
						members: []
					};
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {
					members: []
				};
			});
	} else {
		return [];
	}
};

export const getRequestedMembers = async (
	org_key: string
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get member requests',
			token: cc_token.token,
			data: {
				org_key: org_key,
				page: 1,
				page_size: 600,
				order_by: 'First Name',
				is_asc: 1
			},
		};
		// console.log(options);
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				
				if (res.data.data.records) {
					const members = res.data.data.records;
					
					const result = {
						requestedMembers: members
					};

					return result;
				} else {
					return {
						requestedMembers: []
					};
				}
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {
					requestedMembers: []
				};
			});
	} else {
		return {
			requestedMembers: []
		};
	}
};

export const uploadNotes = async (
	notes_json: any
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Bluk Upload Notes',
			token: cc_token.token,
			data: {
				notes: JSON.stringify(notes_json)
			},
		};
		// console.log(options);
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {status: false};
			});
	} else {
		return {status: false};
	}
};

export const uploadMembers = async (org_key: string, 
	formData: any
) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		// console.log(options);
		return axios
			.post(`${cc_apiGateway}/file/bulk/upload/members/${cc_token.token}?org_key=${org_key}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(async (res) => {
				console.log(res);
				return res;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {status: false};
			});
	} else {
		return {status: false};
	}
};

export const postNote = async (member_key: string, note: string, is_private: boolean, note_headline?: string, application_id?: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Create Note',
			token: cc_token.token,
			data: {
				member_key: member_key,
				applicationID: application_id || null,
				noteHeadline: note_headline || null,
				note: note,
				noteType: 1,
				isPrivate: is_private ? 1 : 0
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.code;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return 'failed';
			});
	} else {
		return [];
	}
}

export const updateNote = async (log: any) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	console.log('log', log)
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Update Note',
			token: cc_token.token,
			data: {
				commentActionType: log.comment_action_type,
				logId: log.id,
				isPrivate: log.is_public ? 0 : 1,
				isArchived: log.is_archived ? 1: 0
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.code;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return 'failed';
			});
	} else {
		return [];
	}
}

export const postOrgNote = async (org_key: string, note: string, is_private: boolean, note_headline?: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Create Org Note',
			token: cc_token.token,
			data: {
				org_key: org_key,
				orgNoteHeadline: note_headline || null,
				orgNote: note,
				orgNoteType: 1,
				isPrivate: is_private ? 1: 0
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.code;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return 'failed';
			});
	} else {
		return [];
	}
}

export const getComments = async (action_type: number, action_id: number, parent_id?: number, last_id?: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Get Comments',
			token: cc_token.token,
			data: {
				ActionID: action_id,
				ActionType: action_type,
				ParentID: parent_id || null,
				LastID: last_id || null
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res.data);
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {};
			});
	}
}

export const postComment = async (action_type: number, action_id: number, comment_type: boolean, comment_content: string, parent_id?: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Add User Comment',
			token: cc_token.token,
			data: {
				ActionID: action_id,
				ActionType: action_type,
				CommentType: comment_type ? 1 : 0,
				CommentContent: comment_content,
				ParentID: parent_id || null
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res.data);
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {};
			});
	} else {
		return [];
	}
}

export const postUpdateComment = async (comment_id: number, comment_type: boolean, comment_content: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	if (localStorage.getItem('cc_token') === null) {
		await getToken();
	}
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Update User Comment',
			token: cc_token.token,
			data: {
				UserCommentID: comment_id,
				CommentType: comment_type ? 1 : 0,
				CommentContent: comment_content
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				console.log(res.data);
				// if (res.data.data.records == null) {
				//     return [];
				// }
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
				return {};
			});
	} else {
		return [];
	}
}

export const getGroupTypes = async (org_key: string, viewMode: number, status: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Group Types',
			token: cc_token.token,
			data: {
				org_key,
				only_public: cc_token.type == "Internal" ? (viewMode || 0) : 1,
				status
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.group_types;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const getGroups = async (org_key: string, viewMode: number, status: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Get Groups',
			token: cc_token.token,
			data: {
				org_key,
				only_public: cc_token.type == "Internal" ? (viewMode || 0) : 1,
				status
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data.groups;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const addGroupType = async (group_type_name: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Create Group Type',
			token: cc_token.token,
			data: {group_type_name},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const addEditGroup = async (group_id: number, group_name: string, group_type: number, group_status: number, org_key: string, group_desc: string) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Upsert Group',
			token: cc_token.token,
			data: {
				group_id,
				group_name,
				group_type,
				group_status,
				group_desc,
				org_key
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const removeGroup = async (group_id: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Remove Group',
			token: cc_token.token,
			data: {
				group_id
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

export const addEditGroupType = async (org_key: string, group_type_id: number, group_type_name: string, group_type_type: number, group_type_status: number, group_type_primary: number) => {
	const cc_apiGateway = config.cc_apiGateway;
	const _cc_token = localStorage.getItem('cc_token');
	if (!!_cc_token) {
		const cc_token = JSON.parse(_cc_token);
		const options = {
			action: 'Admin Upsert Group Type',
			token: cc_token.token,
			data: {
				org_key,
				group_type_id,
				group_type_name,
				group_type_type,
				group_type_status,
				group_type_primary
			},
		};
		return axios
			.post(`${cc_apiGateway}`, options)
			.then(async (res) => {
				return res.data.data;
			})
			.catch((err) => {
				console.log(`☠ ERROR`);
				console.log(err);
			});
	} else {
		console.log(`☠ ERROR`);
		console.log('Token Invalid');
		return [];
	}
}

const formatInterests = (interests: any) => {
	if (interests != null) {
		return interests.map((interest: any) => interest.name);
	} else {
		return [];
	}
};

const convertStatus = (status_key: number) => {
	if (status_key) {
		const status_arr = [
			'Enrolled',
			'Applied',
			'Paused',
			'Suspended',
			'Elected',
			'Do Not Show',
			'ADMIN',
			'Selected',
			'Accepted',
			'Withdrew',
			'Declined',
			'Introduced',
			'Received',
			'Matched',
			'Admitted',
			'Invited',
			'Waitlisted',
			'Idled',
			'Requested',
			'Substituted',
			'Dismissed',
			'Deactivated',
		];
		return status_key > 22 ? 'Enrolled' : status_arr[status_key - 1];
	} else {
		return 'Suspended';
	}
};
