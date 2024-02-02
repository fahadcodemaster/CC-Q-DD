import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import { InsightsApp } from 'global';
import { TextField, CircularProgress, MenuItem, Checkbox, ListSubheader } from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import AddNewExpModal from './AddNewExpModal';

import {
	Container,
	FormContent,
	Formtitle,
	StyledForm,
	FullWidthFormItem,
	FormItem,
	BackButton,
	StyledButton,
	FormGroup,
	EditFormContainer,
} from './styles.css';
import { ReactComponent as Back } from '../../../assets/backArrow.svg';
import { EditMemberSchema } from './validation.schema';
import { EditMemberType } from './validation.types';
import {
	getOrgListwithOffices,
	getDepartmentByCompany,
	getCities,
	updateUser,
	getLicenseTerms,
	getLicenseTypes,
	getCariclubRoles,
	getCandidateLicenses,
	getGroups,
	getUserData,
} from '../../../services/cariclub';
import { useHistory } from 'react-router-dom';
import { MemberHeader } from '../Members/styles.css';
import swal from 'sweetalert';

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
	member: InsightsApp.MemberPage | undefined;
	parentCompanyID: string | null;
	companies: Company[];
	submit(): void;
	cancel(): void;
	viewMode: number;
}

interface Department {
	name: string;
	department_key: string;
}

interface RolesObj {
	role: string;
	is_current_employer: number;
	member_org_key: string;
}

interface UserOrgObj {
	city: string | null;
	key: string;
	logo: string | null;
	name: string;
	state: string | null;
	type: string;
	is_current_employer: number;
	roles: RolesObj[];
}

interface OrgObj {
	city: string | null;
	city_key: string;
	key: string;
	logo: string | null;
	name: string;
	state: string | null;
	type: string;
}

interface MemberPermissions {
	org_key: string;
	type: string;
}

interface CityObj {
	key: string;
	name: string;
	state: string;
	state_abbr: string;
}

interface MemberType {
	id: number;
	name: string;
	parent_id: number;
	forQ?: number | null;
}

interface licenseObj {
	id: number;
	name: string;
	forQ?: number | null;
}

interface GroupObj {
	id: number;
	name: string;
	type_id: number;
	type_name: string;
	status: number;
}

function EditMemberProfile({ member, parentCompanyID, companies, submit, cancel, viewMode }: Props) {
	// const [opens, setOpens] = React.useState<Boolean[]>([false]);
	// const [cityOpen, setCityOpen] = React.useState(false);
	// const [cities, setCities] = useState<CityObj[]>([]);
	const [memberTypes, setMemeberTypes] = useState<MemberType[]>([]);
	const [cariclubRoles, setCariclubRoles] = useState<licenseObj[]>([]);
	const [employers, setEmployers] = useState<OrgObj[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [groups, setGroups] = useState<GroupObj[]>([]);
	const [groupsArray, setGroupsArray] = useState<any>({});
	// const [permissions, setPermissions] = useState<MemberPermissions[]>([{ org_key: '', type: '' }]);
	const [submitError, setSubmitError] = useState('');
	// const [addSecEmail, setAddSecEmail] = useState(false);
	// const [addSecPhone, setAddSecPhone] = useState(false);
	const [licenses, setLicenses] = useState<licenseObj[]>([]);
	const [links, setLinks] = useState<licenseObj[]>([]);
	const [showCEForm, setShowCEForm] = useState<boolean>(false);
	const [openCEOAutocomplete, setOpenCEOAutocomplete] = useState<boolean>(false);
	const [loadingCEOAutocomplete, setLoadingCEOAutocomplete] = useState<boolean>(false);
	const [currentEmployerOrg, setCurrentEmployerOrg] = useState('');
	const [currentEmployerRole, setCurrentEmployerRole] = useState('');
	const [roles, setRoles] = useState<RolesObj[]>([]);
	const [orgLists, setOrgLists] = useState<UserOrgObj[]>([]);
	const [showAddExpModal, setShowAddExpModal] = useState(false);

	// const [clubs, setClubs] = useState<string[]>([""]);
	const history = useHistory();

	const formik = useFormik({
		initialValues: {
			role: '',
			license: '',
			employer: '',
			orgLink: '',
			firstName: '',
			lastName: '',
			department: '',
			workEmail: '',
			phone: '',
			groups: [],
		},
		validationSchema: EditMemberSchema,
		onSubmit: (values: EditMemberType) => {
			handleLoginSubmit(values);
		},
	});

	useEffect(() => {
		fetchLinks();
		fetchCariclubRoles();
		fetchCandidateLicenses();

		if (member) {
			formik.setFieldValue('firstName', member.first_name);
			formik.setFieldValue('lastName', member.last_name);
			formik.setFieldValue('workEmail', member.work_email);
			formik.setFieldValue('phone', member.work_phone);
			formik.setFieldValue('groups', member.groups ? JSON.parse(member.groups) : []);
			fetchMemberProfile(member.key);
		}
		if (parentCompanyID) {
			fetchGroups(parentCompanyID, viewMode);
			fetchDepartment(parentCompanyID);
			if (companies.length > 0) {
				let company_info = companies.filter((e: any) => e.org_key == parentCompanyID)[0];
				let emps: OrgObj[] = [];
				company_info.locations.forEach((e: any) => {
					emps.push({
						city: e.city,
						city_key: e.city_key,
						key: e.org_key,
						logo: company_info.org_logo,
						name: company_info.org_name,
						state: e.state,
						type: e.type,
					});
					if (member && member.org_key) {
						formik.setFieldValue('employer', member.org_key);
					}
				});
				setEmployers([...emps]);
			}
		}
	}, [parentCompanyID, companies, member, viewMode]);

	// useEffect(() => {
	// 	if (companyId) {
	// 		fetchDepartment(companyId);
	// 		if(companies.length > 0) {
	// 			let company_info = companies.filter((e: any) => e.org_key == companyId)[0];
	// 			let emps:OrgObj[] = [];
	// 			company_info.locations.forEach((e: any) => {
	// 				emps.push({
	// 					city: e.city,
	// 					city_key: e.city_key,
	// 					key: e.org_key,
	// 					logo: company_info.org_logo,
	// 					name: company_info.org_name,
	// 					state: e.state,
	// 					type: e.type
	// 				})
	// 				// if(e.type === 'Headquarters Location') {
	// 				// 	formik.setFieldValue('employer', e.org_key);
	// 				// }
	// 			})
	// 			setEmployers([...emps]);
	// 		}
	// 	}
	// }, [companyId, companies])

	// React.useEffect(() => {
	//   if (!open) {
	//     setOrgList([]);
	//   }
	// }, [open]);

	// const fetchCities = async (template: string | null) => {
	// 	let res = await getCities(template);
	// 	if (res && res.length) {
	// 		setCities(res.slice(0, 10));
	// 	}
	// }

	useEffect(() => {
		if (member && cariclubRoles.length) {
			formik.setFieldValue('role', member.cariclub_role || '');
		}
	}, [member, cariclubRoles]);

	useEffect(() => {
		if (member && licenses.length) {
			formik.setFieldValue('license', member.candidate_license || '');
		}
	}, [member, licenses]);

	useEffect(() => {
		if (member && links.length) {
			if (member.priviledge_term) {
				formik.setFieldValue('orgLink', member.priviledge_term);
			} else {
				formik.setFieldValue('orgLink', links[1].id);
			}
		}
	}, [member, links]);

	useEffect(() => {
		if(orgLists.length && currentEmployerOrg) {
			let obj = orgLists.filter((o: UserOrgObj) => o.key == currentEmployerOrg)[0]
			setRoles([...obj.roles])
			let role_key = '';
			if(obj.roles.length) {
				obj.roles.forEach((role: any, idx: number) => {
					if(idx == 0) {
						role_key = role.member_org_key;
					}
					if(role.is_current_employer == 1) {
						role_key = role.member_org_key;
					}
				})
			}
			setCurrentEmployerRole(role_key);
		}
	}, [currentEmployerOrg, orgLists])

	const fetchMemberProfile = async (member_key: string) => {
		let res = await getUserData(member_key);
		var objs: UserOrgObj[] = []
		if(res.companies && res.companies.length) {
			res.companies.forEach((companyObj: any) => {
				var obj: UserOrgObj = {
					city: companyObj.location.city,
					state: companyObj.location.state,
					key: companyObj.org.key,
					logo:  companyObj.org.logo,
					name: companyObj.org.name,
					type: companyObj.org.type,
					is_current_employer: companyObj.org.is_current_employer,
					roles: companyObj.roles
				}
				objs.push(obj);
				if(obj.is_current_employer > 0) {
					setCurrentEmployerOrg(obj.key)
				}
			});
		}
		setOrgLists([...objs]);
	}

	const fetchLinks = async () => {
		let res = await getLicenseTerms();
		if (res && res.length) {
			setLinks(res);
		}
	};

	const fetchGroups = async (companyId: string, vmode: number) => {
		let res = await getGroups(companyId, vmode, 1);
		let _temp: any = {};
		if (res && res.length) {
			res.map((group: GroupObj) => {
				if (_temp[`${group.type_name}`]) {
					_temp[`${group.type_name}`][`${group.name}`] = group.id;
				} else {
					_temp[`${group.type_name}`] = {};
					_temp[`${group.type_name}`][`${group.name}`] = group.id;
				}
			});
		}
		setGroups(res || []);
		setGroupsArray({ ..._temp });
	};

	const fetchCariclubRoles = async () => {
		let res = await getCariclubRoles();
		// setMemeberTypes(res);
		// let roles = res.filter((e: any) => e.parent_id == null && !!e.forQ)
		console.log('CRs => ', res);
		setCariclubRoles(res);
		// if (member && member.member_type) {
		//   let cur_role = res.filter((e: any) => e.id == member.member_type);
		//   if (cur_role.length > 0) {
		//     formik.setFieldValue('role', cur_role[0].parent_id);
		//     let cc_licenses = res.filter((e: any) => e.parent_id == cur_role[0].parent_id);
		//     setLicenses([...cc_licenses]);
		//     formik.setFieldValue('license', cur_role[0].id);
		//   } else {
		//     let cc_licenses = res.filter((e: any) => e.parent_id == 19);
		//     setLicenses([...cc_licenses]);
		//     formik.setFieldValue('license', 21);
		//   }
		// } else {
		//   formik.setFieldValue('role', 19);
		//   let cc_licenses = res.filter((e: any) => e.parent_id == 19);
		//   setLicenses([...cc_licenses]);
		//   formik.setFieldValue('license', 21);
		// }
	};

	const fetchCandidateLicenses = async () => {
		let res = await getCandidateLicenses();
		console.log('CLs =>', res);
		setLicenses(res);
	};

	const fetchDepartment = async (companyId: string) => {
		let res = await getDepartmentByCompany(companyId);
		if (res && res.length > 0) {
			setDepartments(res);
			if (member && member.department_key) {
				formik.setFieldValue('department', member.department_key);
			}
		}
	};

	const fetchOrgList = async (template: string | null) => {
		let res = await getOrgListwithOffices(null, template);
		if (res && res.length) {
			let _orglists = [...orgLists]
			_orglists = res.slice(0, 10);
			setOrgLists([..._orglists]);
		}
	}

	// const addMorePermission = () => {
	// 	// formik.setFieldValue("permissions", )
	// 	setPermissions([...permissions, { org_key: '', type: '' }]);
	// 	// setOpens([...opens, false]);
	// }

	const handleGroupsSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
		let selected = e.target.value as number[];
		const index = selected.indexOf(0);
		if (index > -1) {
			// only splice array when item is found
			selected.splice(index, 1); // 2nd parameter means remove one item only
		}
		formik.setFieldValue('groups', selected);
	};

	const handleLoginSubmit = async (values: EditMemberType) => {
		// let perms = [...permissions].filter((e) => !!e.org_key )
		swal({
			title: 'Are you sure?',
			text: '',
			icon: 'warning',
			buttons: [true, 'Confirm'],
		}).then(async (sure) => {
			if (sure) {
				if (member) {
					let form_value = {
						member_key: member.key,
						first_name: values.firstName,
						last_name: values.lastName,
						work_email: values.workEmail,
						// personal_email: values.secondaryEmail,
						work_phone: values.phone,
						// personal_phone: values.secondaryPhone,
						// job_title: 'Board Candidate',
						department: values.department,
						company_key: values.employer,
						license_term: values.orgLink,
						city_key: 'null',
						location_key: 'null',
						cariclub_role: values.role,
						candidate_license: values.license,
						// clubs: clubs,
						permissions: null,
						groups: JSON.stringify(values.groups),
					};


					if (values.employer && parentCompanyID && companies.length > 0) {
						let company_info = companies.filter((e: any) => e.org_key == parentCompanyID)[0];
						let chapter = company_info.locations.filter((e: any) => e.org_key == values.employer)[0];
						form_value = { ...form_value, city_key: chapter.city_key, location_key: chapter.city_key };
					}

					let res = await updateUser(form_value);
					if (res.code !== 'c74') {
						setSubmitError(res.message);
						return false;
					} else {
						swal('Success!', '', 'success').then((value) => {
							submit();
						});
					}
					// history.push('/');
				}
			} else {
				return false;
			}
		});
	};

	const checkViewModLicenseStatus = (name: string) => {
        if (viewMode === 1) {
            if (['exempt', 'latent'].includes(name.toLowerCase()) || ['Exempted', "Flagged", "Honorary", "Requested", "Licensed (Locked)", "Unlicensed"].includes(name)) {
                return true
            } else {
                return false
            }
        }
    }

	const setCurrentEmployer = () => {
		setShowCEForm(true);
	}

	const addNewExperience = () => {
		setShowAddExpModal(true);
	}

	const handleSaveNewExp = () => {
		setShowAddExpModal(false);
	}

	const handleCancelNewExp = () => {
		setShowAddExpModal(false);
	}

	// const fetchLicenses = async () => {
	//   let res = await getLicenseTypes();
	//   if (res && res.length) {
	//     setLicenses([...res]);
	//     formik.setFieldValue('license', res[0].id);
	//   }
	// }

	return (
		<EditFormContainer>
			{/* <BackButton to="/"><Back /> Back</BackButton> */}
			<FormContent>
				{/* <Formtitle>Invite New Candidate</Formtitle> */}
				{submitError && <Alert severity="error">{submitError}</Alert>}
				<form onSubmit={formik.handleSubmit} className="add-new-member-form">
					<StyledForm>
						<FormGroup>
							<FormItem>
								<TextField
									fullWidth
									id="role"
									name="role"
									label="CariClub Role"
									error={formik.errors.role && formik.touched.role ? true : false}
									helperText={formik.errors.role}
									value={formik.values.role}
									onChange={formik.handleChange}
									select
								>
									<MenuItem value="">Select Role</MenuItem>
									{cariclubRoles.length &&
										cariclubRoles.map((cr) => (
											<MenuItem
												key={`cariclub_roles_${cr.id}`}
												value={cr.id}
												disabled={
													viewMode === 1 &&
													!['administrator', 'candidate'].includes(cr.name.toLowerCase())
												}
											>
												{cr.name}
											</MenuItem>
										))}
								</TextField>
							</FormItem>
							<FormItem>
								<TextField
									fullWidth
									id="firstName"
									name="firstName"
									label="First Name"
									error={formik.errors.firstName && formik.touched.firstName ? true : false}
									helperText={formik.errors.firstName}
									value={formik.values.firstName}
									onChange={formik.handleChange}
								/>
							</FormItem>
						</FormGroup>
						<FormGroup>
							<FormItem>
								<TextField
									fullWidth
									id="license"
									name="license"
									label="CariClub License"
									error={formik.errors.license && formik.touched.license ? true : false}
									helperText={formik.errors.license}
									value={formik.values.license}
									onChange={formik.handleChange}
									select
								>
									<MenuItem value="">Select License</MenuItem>
									{licenses.length &&
										licenses.map((cl) => (
											<MenuItem
												key={`cariclub_licenses_${cl.id}`}
												value={cl.id}
												disabled={checkViewModLicenseStatus(cl.name)}
											>
												{cl.name}
											</MenuItem>
										))}
								</TextField>
							</FormItem>
							<FormItem>
								<TextField
									fullWidth
									id="lastName"
									name="lastName"
									label="Last Name"
									error={formik.errors.lastName && formik.touched.lastName ? true : false}
									helperText={formik.errors.lastName}
									value={formik.values.lastName}
									onChange={formik.handleChange}
								/>
							</FormItem>
						</FormGroup>
						<FormGroup>
							<FormItem>
								<TextField
									fullWidth
									id="employer"
									name="employer"
									label="Corporate Sponsor & Location"
									error={formik.errors.employer && formik.touched.employer ? true : false}
									helperText={formik.errors.employer}
									value={formik.values.employer}
									onChange={formik.handleChange}
									select
								>
									<MenuItem value="">Select Employer</MenuItem>
									{employers.length &&
										employers.map((emp) => (
											<MenuItem key={emp.key} value={emp.key}>
												{emp.name} - {emp.city}, {emp.state}
											</MenuItem>
										))}
								</TextField>
							</FormItem>
							<FormItem>
								<TextField
									fullWidth
									id="workEmail"
									name="workEmail"
									label="Company Email"
									error={formik.errors.workEmail && formik.touched.workEmail ? true : false}
									helperText={formik.errors.workEmail}
									value={formik.values.workEmail}
									onChange={formik.handleChange}
								/>
								{/* { addSecEmail && <TextField fullWidth id="secondaryEmail" name="secondaryEmail" label='Secondary Email' error={formik.errors.secondaryEmail && formik.touched.secondaryEmail ? true : false} helperText={formik.errors.secondaryEmail} value={formik.values.secondaryEmail} onChange={formik.handleChange} />}
								{ !addSecEmail && <span className='custom-btn' onClick={() => setAddSecEmail(true)}>+ Add secondary email address</span>} */}
							</FormItem>
						</FormGroup>
						<FormGroup>
							<FormItem>
								<TextField
									fullWidth
									id="orgLink"
									name="orgLink"
									label="Link to Corporate Sponsor"
									error={formik.errors.orgLink && formik.touched.orgLink ? true : false}
									helperText={formik.errors.orgLink}
									value={formik.values.orgLink}
									onChange={formik.handleChange}
									select
								>
									<MenuItem value="">Select Link</MenuItem>
									{links.length &&
										links.map((e) => (
											<MenuItem
												key={`links_${e.id}`}
												value={e.id}
												disabled={
													viewMode === 1 &&
													['stakeholder', 'designee', 'secondee'].includes(
														e.name.toLowerCase(),
													)
												}
											>
												{e.name}
											</MenuItem>
										))}
								</TextField>
							</FormItem>
							<FormItem>
								<TextField
									fullWidth
									id="phone"
									name="phone"
									label="Work Phone #"
									error={formik.errors.phone && formik.touched.phone ? true : false}
									helperText={formik.errors.phone}
									value={formik.values.phone}
									onChange={formik.handleChange}
								/>
								{/* { addSecPhone && <TextField fullWidth id="secondaryPhone" name="secondaryPhone" label='Secondary Phone #' error={formik.errors.secondaryPhone && formik.touched.secondaryPhone ? true : false} helperText={formik.errors.secondaryPhone} value={formik.values.secondaryPhone} onChange={formik.handleChange} />}
							{ !addSecPhone && <span className='custom-btn' onClick={() => setAddSecPhone(true)}>+ Add secondary phone number</span>} */}
							</FormItem>
						</FormGroup>
						<FormGroup>
							<FormItem>
								<TextField
									fullWidth
									id="department"
									name="department"
									label="Department"
									error={formik.errors.department && formik.touched.department ? true : false}
									helperText={formik.errors.department}
									value={formik.values.department}
									onChange={formik.handleChange}
									select
								>
									<MenuItem value="">Select Department</MenuItem>
									{departments.length &&
										departments.map((option) => (
											<MenuItem key={option.department_key} value={option.department_key}>
												{option.name}
											</MenuItem>
										))}
								</TextField>
							</FormItem>
							<FormItem>
								<TextField
									fullWidth
									id="group"
									name="Group"
									label="Group"
									// error={formik.errors.department && formik.touched.department ? true : false}
									// helperText={formik.errors.department}
									value={formik.values.groups}
									onChange={handleGroupsSelect}
									select
									SelectProps={{
										multiple: true,
										renderValue: (selected) =>
											(selected as number[])
												.filter((id: number) => groups.find((x) => x.id == id))
												.map((id: number) => groups.find((x) => x.id == id)?.name || id)
												.join(', '),
									}}
								>
									<MenuItem value={0}>Select Group</MenuItem>
									{Object.keys(groupsArray).map((parent) => {
										return [
											<ListSubheader
												style={{
													width: '100%',
													background: '#f2f2f2',
													padding: 12,
													fontWeight: 500,
													color: '#1d1d1d',
													fontSize: 16,
												}}
											>
												{parent}
											</ListSubheader>,
											Object.keys(groupsArray[parent]).map((child: any) => {
												return (
													<MenuItem
														key={`group_${groupsArray[parent][child]}`}
														value={groupsArray[parent][child] as number}
														role="option"
													>
														<Checkbox
															checked={
																formik.values.groups.indexOf(
																	Number(groupsArray[parent][child]),
																) > -1
															}
														/>
														{child}
													</MenuItem>
												);
											}),
										];
									})}
								</TextField>
							</FormItem>
						</FormGroup>
						{/* <FormItem>
							<TextField fullWidth id="cariclubRole" name="cariclubRole" label='CariClub Role' error={formik.errors.cariclubRole && formik.touched.cariclubRole ? true : false} helperText={formik.errors.cariclubRole} value={formik.values.cariclubRole} onChange={formik.handleChange} select>
								<MenuItem value="1">Company Administrator</MenuItem>
								<MenuItem value="2">Board Candidate</MenuItem>
							</TextField>
						</FormItem> */}

						{/* <FormItem>
							<TextField fullWidth id="title" name="title" label='Title or Role' error={formik.errors.title && formik.touched.title ? true : false} helperText={formik.errors.title} value={formik.values.title} onChange={formik.handleChange} />
						</FormItem> */}

						{/* <FormItem>
							<TextField fullWidth id="license" name="license" label='CariClub License' error={formik.errors.license && formik.touched.license ? true : false} helperText={formik.errors.license} value={formik.values.license} onChange={formik.handleChange} select>
								<MenuItem value="0">Select License</MenuItem>
								{
									licenses.length && licenses.map((e) => (<MenuItem key={`licenses_${e.id}`} value={e.id}>{e.name}</MenuItem>))
								}
							</TextField>
						</FormItem> */}

						{/* <FormItem>
							{clubs.length && clubs.map((clb, index) => (
								<TextField fullWidth key={`group_${index}`} id={`group_${index}`} name={`group_${index}`} label='Club' value={clb} onChange={(e) => {
									let clbs = [...clubs]
									clbs[index] = e.target.value;
									setClubs([...clbs])
								}} select>
									<MenuItem value="">Select Club</MenuItem>
									<MenuItem value="Unassigned">Unassigned</MenuItem>
								</TextField>
							))}
							<span className='custom-btn' onClick={() => setClubs([...clubs, ""])}>+ Add club</span>
						</FormItem> */}
						{/* <FormItem>
							<Autocomplete
								fullWidth
								id={`city`}
								open={cityOpen}
								onOpen={() => setCityOpen(true)}
								onClose={() => setCityOpen(false)}
								options={cities}
								getOptionLabel={(option) => `${option.name}, ${option.state}`}
								loading={cityLoading}
								onChange={(event, value) => {
									if (value) {
										formik.setFieldValue(`city_key`, value.key);
									}
								}}
								onInputChange={(event, newInputValue) => {
									fetchCities(newInputValue);
								}}
								filterOptions={(x) => x}
								renderInput={(params) => (
									<TextField
										{...params}
										margin="normal"
										label="Actual City"
										fullWidth
										value={formik.values.city_key}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<React.Fragment>
													{cityLoading ? <CircularProgress color="inherit" size={20} /> : null}
													{params.InputProps.endAdornment}
												</React.Fragment>
											),
										}}
									/>
								)}
							/>
						</FormItem> */}
					</StyledForm>
					{/* <div style={{ height: '1px', width: '100%', backgroundColor: 'gray', marginTop: '30px', marginBottom: '30px' }}></div>
					<label>Permissions</label>
					<StyledForm>
						{
							permissions && permissions.map((permission, i) => (
								<React.Fragment key={`permission_row_${i}`}>
									<FormItem>
										<Autocomplete
											fullWidth
											id={`permission_org_${i}`}
											open={opens[i] || false}
											onOpen={() => {
												let _opens = [...opens]
												_opens[i] = true;
												setOpens(_opens);
											}}
											onClose={() => {
												let _opens = [...opens]
												_opens[i] = false;
												setOpens(_opens);
											}}
											options={orgLists[i] || []}
											getOptionLabel={(option) => `${option.name.trim()}`}
											loading={loadings === i}
											onChange={(event, value) => {
												if (value) {
													console.log("auto onchange => ", value);
													let _permissions = [...permissions];
													_permissions[i].org_key = value.key;
													setPermissions(_permissions);
													// formik.setFieldValue(`permissions[${i}].orgId`, value.key);
												}
											}}
											onInputChange={(event, newInputValue) => {
												fetchOrgList(newInputValue, i);
											}}
											filterOptions={(x) => x}
											renderInput={(params) => (
												<TextField
													{...params}
													margin="normal"
													label="Set Organization Name"
													fullWidth
													value={permission.org_key}
													InputProps={{
														...params.InputProps,
														endAdornment: (
															<React.Fragment>
																{loadings === i ? <CircularProgress color="inherit" size={20} /> : null}
																{params.InputProps.endAdornment}
															</React.Fragment>
														),
													}}
												/>
											)}
										/>
									</FormItem>
									<FormItem>
										<TextField
											fullWidth
											id={`permission_perm_${i}`}
											name={`permission_perm_${i}`}
											label='Set Permissions'
											value={permission.type}
											onChange={(e) => {
												let _permissions = [...permissions];
												_permissions[i].type = e.target.value;
												setPermissions(_permissions);
											}} select>
											<MenuItem value="General Admin">General Admin</MenuItem>
											<MenuItem value="Local Admin">Local Admin</MenuItem>
										</TextField>
									</FormItem>
								</React.Fragment>
							))
						}
					</StyledForm> */}
					{/* <StyledButton type='button' onClick={addMorePermission}>+ Add Permission</StyledButton> */}
					{
						showCEForm == false && 
						<StyledForm style={{ justifyContent: 'center' }}>
							<FormGroup>
								<StyledButton type='button' onClick={setCurrentEmployer} style={{maxWidth: 'none'}}>Add Current Employer</StyledButton>
							</FormGroup>	
						</StyledForm>
					}
					{
						showCEForm == true && (
							<StyledForm style={{paddingTop: '40px'}}>
								<FormItem>
									<TextField
										fullWidth
										id={`current_org`}
										name={`current_org`}
										label='Set Current Employer'
										value={currentEmployerOrg}
										onChange={(e) => {
											setCurrentEmployerOrg(e.target.value);
										}} select>
										<MenuItem value={0}>Select Organization</MenuItem>
										{orgLists.length &&
											orgLists.map((option) => (
												<MenuItem key={`org_${option.key}`} value={option.key}>
													{option.name} - {option.city}, {option.state}
												</MenuItem>
											))}
									</TextField>
								</FormItem>
								<FormItem>
									<TextField
										fullWidth
										id={`current_role`}
										name={`current_role`}
										label='Set Role'
										value={currentEmployerRole}
										onChange={(e) => {
											setCurrentEmployerRole(e.target.value);
										}} select>
										<MenuItem value={0}>Select Role</MenuItem>
										{roles.length &&
											roles.map((option) => (
												<MenuItem key={`roles_${option.member_org_key}`} value={option.member_org_key}>
													{option.role}
												</MenuItem>
											))}
									</TextField>
								</FormItem>
							</StyledForm>
						)
					}
					{
						showCEForm == true && 
						<StyledForm style={{ paddingTop: '0px' }}>
							<FormGroup>
								<StyledButton type='button' onClick={addNewExperience} style={{maxWidth: 'none'}}>Add New Experience</StyledButton>
							</FormGroup>	
						</StyledForm>
					}

					<StyledForm style={{ justifyContent: 'center' }}>
						<FormGroup>
							<StyledButton isSubmit type="submit">
								Save
							</StyledButton>
							<StyledButton isCancel type="button" onClick={cancel}>
								Cancel
							</StyledButton>
						</FormGroup>
					</StyledForm>
				</form>
			</FormContent>
			<AddNewExpModal showAddExpModal={showAddExpModal} handleSaveNewExp={handleSaveNewExp} handleCancelNewExp={handleCancelNewExp} />
		</EditFormContainer>
	);
}

export default EditMemberProfile;
