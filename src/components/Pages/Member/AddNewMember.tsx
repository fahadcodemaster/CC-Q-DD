import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import { TextField, CircularProgress, MenuItem, Checkbox, Paper, MenuList, ListSubheader } from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';

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
    MenuItems,
    MenuHeaderContainer,
} from './styles.css';
import { ReactComponent as Back } from '../../../assets/backArrow.svg';
import { AddNewMemberSchema } from './validation.schema';
import { AddNewMemberType } from './validation.types';
import {
    getOrgListwithOffices,
    getDepartmentByCompany,
    getCities,
    createUser,
    getLicenseTerms,
    getLicenseTypes,
    getGroups,
} from '../../../services/cariclub';
import { useHistory } from 'react-router-dom';
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
    companyId: string | null;
    companies: Company[];
    viewMode: number;
    queryCompanyID: string | null;
}

interface Department {
    name: string;
    department_key: string;
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

function AddNewMember({ companyId, companies, viewMode, queryCompanyID }: Props) {
    // const [opens, setOpens] = React.useState<Boolean[]>([false]);
    // const [cityOpen, setCityOpen] = React.useState(false);
    // const [cities, setCities] = useState<CityObj[]>([]);
    const [employers, setEmployers] = useState<OrgObj[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [groups, setGroups] = useState<GroupObj[]>([]);
    const [groupsArray, setGroupsArray] = useState<any>({});
    // const [permissions, setPermissions] = useState<MemberPermissions[]>([{ org_key: '', type: '' }]);
    // const [orgLists, setOrgLists] = useState<OrgObj[][]>([]);
    const [submitError, setSubmitError] = useState('');
    // const [addSecEmail, setAddSecEmail] = useState(false);
    // const [addSecPhone, setAddSecPhone] = useState(false);
    // const [licenses, setLicenses] = useState<licenseObj[]>([]);
    const [links, setLinks] = useState<licenseObj[]>([]);
    // const [clubs, setClubs] = useState<string[]>([""]);
    const history = useHistory();

    // const cityLoading = cityOpen && cities.length === 0;

    // const loadings = useMemo(() => {
    // 	let i = opens.findIndex((e) => e === true)
    // 	if (i > -1 && !orgLists[i]) return i
    // 	return -1;
    // }, [opens, orgLists]);

    // React.useEffect(() => {
    // 	let active = true;

    // 	if (!cityLoading) {
    // 		return undefined;
    // 	}

    // 	if (active) {
    // 		fetchCities(null)
    // 	}

    // 	return () => {
    // 		active = false;
    // 	};
    // }, [cityLoading]);

    // React.useEffect(() => {
    // 	let active = true;

    // 	if (loadings === -1) {
    // 		return undefined;
    // 	}

    // 	if (active) {
    // 		fetchOrgList(null, loadings)
    // 	}

    // 	return () => {
    // 		active = false;
    // 	};
    // }, [loadings]);

    const formik = useFormik({
        initialValues: {
            employer: '',
            orgLink: '',
            firstName: '',
            lastName: '',
            department: '',
            workEmail: '',
            phone: '',
            groups: [],
        },
        validationSchema: AddNewMemberSchema,
        onSubmit: (values: AddNewMemberType) => {
            handleLoginSubmit(values);
        },
    });

    useEffect(() => {
        fetchLinks();
        // fetchLicenses();
    }, []);

    useEffect(() => {
        if (companyId) {
            fetchDepartment(companyId);
            fetchGroups(companyId, viewMode);
            if (companies.length > 0) {
                let company_info = companies.filter((e: any) => e.org_key == companyId)[0];
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
                    // if(e.type === 'Headquarters Location') {
                    // 	formik.setFieldValue('employer', e.org_key);
                    // }
                });
                setEmployers([...emps]);
            }
        }
    }, [companyId, companies, viewMode]);

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

    const fetchLinks = async () => {
        let res = await getLicenseTerms();
        if (res && res.length) {
            setLinks([...res.filter((e: licenseObj) => !!e.forQ)]);
            formik.setFieldValue('orgLink', res[1].id);
        }
    };
    // const fetchLicenses = async () => {
    // 	let res = await getLicenseTypes();
    // 	if (res && res.length) {
    // 		setLicenses([...res]);
    // 		formik.setFieldValue('license', res[0].id);
    // 	}
    // }

    const fetchDepartment = async (companyId: string) => {
        let res = await getDepartmentByCompany(companyId);
        if (res && res.length > 0) {
            setDepartments(res);
        }
    };

    // const fetchOrgList = async (template: string | null, index: number) => {
    // 	let res = await getOrgListwithOffices(template);
    // 	if (res && res.length) {
    // 		let _orglists = [...orgLists]
    // 		_orglists[index] = res.slice(0, 10);
    // 		setOrgLists(_orglists);
    // 	}
    // }

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

    const handleLoginSubmit = async (values: AddNewMemberType) => {
        // let perms = [...permissions].filter((e) => !!e.org_key )
        swal({
            title: 'Are you sure?',
            text: '',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                let form_value = {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    work_email: values.workEmail,
                    // personal_email: values.secondaryEmail,
                    work_phone: values.phone,
                    // personal_phone: values.secondaryPhone,
                    job_title: 'Board Candidate',
                    department: values.department,
                    company_key: values.employer,
                    license_term: values.orgLink,
                    city_key: 'null',
                    location_key: 'null',
                    member_type: 21, // old value... Candidate->Acitive
                    cariclub_role: 4, // Candidate
                    candidate_license: 2, // Active
                    // clubs: clubs,
                    permissions: null,
                    groups: JSON.stringify(values.groups),
                };

                if (values.employer && companyId && companies.length > 0) {
                    let company_info = companies.filter((e: any) => e.org_key == companyId)[0];
                    let chapter = company_info.locations.filter((e: any) => e.org_key == values.employer)[0];
                    form_value = { ...form_value, city_key: chapter.city_key, location_key: chapter.city_key };
                }

                let res = await createUser(form_value);
                if (res.code !== 'a1') {
                    setSubmitError(res.message);
                    return false;
                }
                swal('Success!', '', 'success').then((value) => {
                    history.push('/');
                });
            } else {
                return false;
            }
        });
    };

    return (
        <Container>
            <BackButton to="/">
                <Back /> Back
            </BackButton>
            <Paper style={{ marginTop: '45px', padding: '20px' }}>
                <FormContent>
                    <Formtitle>Invite New Candidate</Formtitle>
                    {submitError && <Alert severity="error">{submitError}</Alert>}
                    <form onSubmit={formik.handleSubmit} className="add-new-member-form">
                        <StyledForm>
                            <FullWidthFormItem>
                                <TextField
                                    fullWidth
                                    id="employer"
                                    name="employer"
                                    label="*Name and office location of corporate sponsor"
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
                            </FullWidthFormItem>
                            <FullWidthFormItem>
                                <TextField
                                    fullWidth
                                    id="orgLink"
                                    name="orgLink"
                                    label="*Candidate's link to corporate sponsor"
                                    error={formik.errors.orgLink && formik.touched.orgLink ? true : false}
                                    helperText={formik.errors.orgLink}
                                    value={formik.values.orgLink}
                                    onChange={formik.handleChange}
                                    select
                                >
                                    <MenuItem value="">Select Link</MenuItem>
                                    {links.length &&
                                        links.map((e) => (
                                            <MenuItem key={`links_${e.id}`} value={e.id}>
                                                {e.name}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </FullWidthFormItem>
                            <FormGroup>
                                <FormItem>
                                    <TextField
                                        fullWidth
                                        id="department"
                                        name="department"
                                        label="Department to which candidate belongs"
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
                                        id="groups"
                                        name="groups"
                                        label="Groups to which candidate belongs"
                                        // error={formik.errors.department && formik.touched.department ? true : false}
                                        // helperText={formik.errors.department}
                                        value={formik.values.groups}
                                        onChange={handleGroupsSelect}
                                        select
                                        SelectProps={{
                                            multiple: true,
                                            renderValue: (selected) =>
                                                (selected as number[])
                                                    .map((id: number) => {
                                                        return groups.find((x) => x.id == id)?.name || id;
                                                    })
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
                            <FormGroup>
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

                            {/* <FormItem>
							<TextField fullWidth id="title" name="title" label='Title or Role' error={formik.errors.title && formik.touched.title ? true : false} helperText={formik.errors.title} value={formik.values.title} onChange={formik.handleChange} />
						</FormItem> */}

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
                            {/* <FormItem>
							<TextField fullWidth id="license" name="license" label='CariClub License' error={formik.errors.license && formik.touched.license ? true : false} helperText={formik.errors.license} value={formik.values.license} onChange={formik.handleChange} select>
								<MenuItem value="0">Select License</MenuItem>
								{
									licenses.length && licenses.map((e) => (<MenuItem key={`licenses_${e.id}`} value={e.id}>{e.name}</MenuItem>))
								}
							</TextField>
						</FormItem> */}
                            <FullWidthFormItem>
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
                            </FullWidthFormItem>

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

                        <StyledForm style={{ justifyContent: 'center' }}>
                            <FormGroup>
                                <StyledButton isSubmit type="submit">
                                    Invite Candidate
                                </StyledButton>
                                <StyledButton isCancel type="button" onClick={() => history.push('/')}>
                                    Cancel
                                </StyledButton>
                            </FormGroup>
                        </StyledForm>
                    </form>
                </FormContent>
            </Paper>
        </Container>
    );
}

export default AddNewMember;
