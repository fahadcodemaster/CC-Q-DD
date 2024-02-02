import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Field, Form, FormikHelpers, useFormik } from 'formik';
import { TextField, CircularProgress, MenuItem, Checkbox, Paper, MenuList, ListSubheader } from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';

import { Tooltip } from '@material-ui/core';
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
import { RequestMemberSchema } from './validation.schema';
import { RequestMemberType } from './validation.types';
import { ReportingAPI, ReportingDB } from '../../../../types';
import {
    getRequestedMembers,
    requestReviewSubmit,
} from '../../../services/cariclub';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import CCLogo from '../../../assets/CCLogo.png';
import config from '../../../config';

import moment from 'moment';

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
    appState: ReportingAPI.PrimaryCompanyData | undefined;
    companyId: string | null;
    companies: Company[];
    viewMode: number;
    memberId: string | null;
}

interface RequetedMember {
    key: string;
    first_name: string;
    last_name: string;
    organization: string;
    city: string;
    state: string;
    personal_email: string;
    work_email: string;
    title: string;
    matching_status: string;
    person_type: string;
    requested: string;
}
// Review access request
// Admin_ReviewAccessRequest

function MemberRequest({ appState, companyId, companies, viewMode, memberId }: Props) {
    const [companyInfo, setCompanyInfo] = useState<Company>();
    const [chapters, setChapters] = useState<Location[]>([]);
    const [submitError, setSubmitError] = useState('');
    const [requestedMember, setRequestedMember] = useState<RequetedMember>();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            employer: '',
            first_name: requestedMember?.first_name || '',
            last_name: requestedMember?.last_name || '',
            status: '',
            role: requestedMember?.title || '',
            work_email: requestedMember?.work_email || '',
            city: requestedMember?.city
        },
        enableReinitialize: true,
        validationSchema: RequestMemberSchema,
        onSubmit: (values: RequestMemberType) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        
    }, []);

    useEffect(() => {
        if (companyId) {
            if (companies.length > 0) {
                let company_info : Company = companies.filter((e: any) => e.org_key == companyId)[0];
                let chapters = company_info.locations;
                console.log('chappters',chapters);
                setCompanyInfo(company_info);
                setChapters(chapters);
            }
        }

        const getRequestedMember = async (companyId: any, memberId: any) => {
            const reqRes: any = await getRequestedMembers (companyId);
            const mem = reqRes.requestedMembers.filter((tempMem : any) => tempMem.key == memberId)[0];
            console.log('req member', mem);
            setRequestedMember(mem);
        }

        getRequestedMember(companyId, memberId);
    }, [companyId, memberId, companies, viewMode]);

    const handleSubmit = async (values: RequestMemberType) => {
        // let perms = [...permissions].filter((e) => !!e.org_key )
        swal({
            title: 'Are you sure?',
            text: '',
            icon: 'warning',
            buttons: [true, 'Confirm'],
        }).then(async (sure) => {
            if (sure) {
                // get chapter locationId (city_key)
                const selectedChapter = chapters.filter((tempChapter: any) => tempChapter.org_key == values.employer)[0];
                const location_key = selectedChapter.city_key;

                let form_value = {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    work_email: values.work_email,
                    role: values.role,
                    status: values.status,
                    org_key: values.employer,
                    member_key: memberId,
                    location_key: location_key
                };

                console.log(form_value);
                let res = await requestReviewSubmit(form_value);
                if (res.code !== 'c16') {
                    setSubmitError(res.message);
                    return false;
                }
                swal('Success!', '', 'success').then((value) => {
                    history.push(`/engagement/${companyId}`);
                });
            } else {
                return false;
            }
        });
    };

    return (
        <Container>
            <BackButton to={`/engagement/${companyId}`}>
                <Back /> Back
            </BackButton>
            <Paper style={{ marginTop: '45px', padding: '20px' }}>
                <FormContent>
                    <Formtitle>New Member Request 
                        { viewMode == 0 && (
                            <a href={`${config.cc_admin_url}/member-requests/${requestedMember?.key}`} target="_blank">
                                <img src={CCLogo} alt="cc-logo" />
                            </a>
                        )}
                    </Formtitle>
                    { requestedMember?.requested && (
                        <p>{`Submitted on ${moment(requestedMember?.requested).format('MMMM Do YYYY, h:mm:ss a')}`}</p>
                    )}
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
                                    <MenuItem value="">Select Chapter</MenuItem>
                                    {chapters.length &&
                                        chapters.map((location) => (
                                            <MenuItem key={location.org_key} value={location.org_key}>
                                                {companyInfo?.org_name} - {location.city}, {location.state}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </FullWidthFormItem>
                            
                            <FormGroup>
                                <FormItem>
                                    <TextField
                                        fullWidth
                                        id="first_name"
                                        name="first_name"
                                        label="First Name"
                                        error={formik.errors.first_name && formik.touched.first_name ? true : false}
                                        helperText={formik.errors.first_name}
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                    />
                                </FormItem>

                                <FormItem>
                                    <TextField
                                        fullWidth
                                        id="last_name"
                                        name="last_name"
                                        label="Last Name"
                                        error={formik.errors.last_name && formik.touched.last_name ? true : false}
                                        helperText={formik.errors.last_name}
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                    />
                                </FormItem>
                            </FormGroup>
                            <FormGroup>
                                <FormItem>
                                    <TextField
                                        fullWidth
                                        id="work_email"
                                        name="work_email"
                                        label="Primary Email"
                                        error={formik.errors.work_email && formik.touched.work_email ? true : false}
                                        helperText={formik.errors.work_email}
                                        value={formik.values.work_email}
                                        onChange={formik.handleChange}
                                    />
                                </FormItem>
                                <FormItem>
                                    <TextField
                                        fullWidth
                                        id="role"
                                        name="role"
                                        label="Role"
                                        error={formik.errors.role && formik.touched.role ? true : false}
                                        helperText={formik.errors.role}
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                    />
                                </FormItem>
                            </FormGroup>
                            <FormItem>
                                <TextField
                                    fullWidth
                                    id="status"
                                    name="status"
                                    label="Account Status"
                                    error={formik.errors.status && formik.touched.status ? true : false}
                                    helperText={formik.errors.status}
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    select
                                >
                                    <MenuItem value="">Select Status</MenuItem>
                                    
                                    <MenuItem key='Active' value='Active'>
                                        <Tooltip title="Approve request and send invitation email">
                                            <span>Assign CariClub License</span>
                                        </Tooltip>
                                    </MenuItem>
                                                                        
                                    <MenuItem key='Waitlisted' value='Waitlisted'>
                                        <Tooltip title="Employee is eligible, add to CariClub License Waitlist">
                                            <span>Add to License Waitlist</span>
                                        </Tooltip>
                                    </MenuItem>
                                    
                                    <MenuItem key='Inactive' value='Deactivated'>
                                        <Tooltip title="Employee is currently ineligible for CariClub License">
                                            <span>Move to Request Backlog</span>
                                        </Tooltip>
                                    </MenuItem>
                                </TextField>
                            </FormItem>
                        </StyledForm>
                        <StyledForm style={{ justifyContent: 'center' }}>
                            <FormGroup>
                                <StyledButton isSubmit type="submit">
                                    Confirm
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

export default MemberRequest;
