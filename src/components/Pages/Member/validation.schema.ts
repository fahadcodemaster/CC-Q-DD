import * as Yup from 'yup'

export const AddNewMemberSchema = Yup.object({
    // cariclubRole: Yup.number(),
    employer: Yup.string()
        .required("Employer is required"),
    orgLink: Yup.string().required("Link is required"),
    firstName: Yup.string()
        .required("First Name is Required"),
    lastName: Yup.string()
        .required("Last Name is Required"),
    department: Yup.string(),
    workEmail: Yup.string()
        .email("Invalid email")
        .required("Company Email is Required"),
    // secondaryEmail: Yup.string()
        // .email("Invalid email"),
    // license: Yup.number(),
    // city_key: Yup.string(),
    phone: Yup.string(),
    groups: Yup.array().of(Yup.number())
    // secondaryPhone: Yup.string()
})

export const EditMemberSchema = Yup.object({
    role: Yup.string()
        .required("CariClub Role is required"),
    license: Yup.string()
        .required("CariClub License is required"),
    employer: Yup.string()
        .required("Employer is required"),
    orgLink: Yup.string().required("Link is required"),
    firstName: Yup.string()
        .required("First Name is Required"),
    lastName: Yup.string()
        .required("Last Name is Required"),
    department: Yup.string(),
    workEmail: Yup.string()
        .email("Invalid email")
        .required("Company Email is Required"),
    // secondaryEmail: Yup.string()
        // .email("Invalid email"),
    // license: Yup.number(),
    // city_key: Yup.string(),
    phone: Yup.string(),
    groups: Yup.array().of(Yup.number())
    // secondaryPhone: Yup.string()
})

export const RequestMemberSchema = Yup.object({
    employer: Yup.string()
        .required("Location is required"),
    first_name: Yup.string()
        .required("First Name is Required"),
    last_name: Yup.string()
        .required("Last Name is Required"),
    work_email: Yup.string()
        .email("Invalid email")
        .required("Primary Email is Required"),
    status: Yup.string()
        .required("Status is Required"),
    role: Yup.string()
})