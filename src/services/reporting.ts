// import axios from 'axios'
// import { API } from 'aws-amplify'
// import config from '../config'

// import { data } from '../data'

// interface APIAddress {
//     name: string;
//     endpoint: string;
//     region: string;
// }

export const reporting = () => {
    
}

// /**
//  * @function getPrimaryCompanyData
//  * @description single API endpoint for MVP which fetches all PUBLIC data related to a company. This function
//  * should be deprecated in future releases in favor of true restful API with multiple endpoints
//  **/
// export const getPrimaryCompanyData = (companyId: number) => {
//     const testRoute = config.apiGateway.ENDPOINTS[0] as APIAddress
//     const {
//         name,
//         endpoint,
//         region
//     } = testRoute

//     const options = {
//         headers: {},
//         response: true,
//         queryStringParameters: { company_id: companyId }
//     }
//     return API.get(name, `${name}`, options)
//         .then(response => response.data)
//         .catch(err => {
//             console.log(`☠ ERROR`);
//             console.log(err.response);
//         })
// }

// /**
//  * @function getPrimaryCompanyDataP
//  * @description single API endpoint for MVP which fetches all PRIVATE data related to a company. This function
//  * should be deprecated in future releases in favor of true restful API with multiple endpoints
//  **/
// export const getPrimaryCompanyDataP = (companyId: number) => {
//     const testRoute = config.apiGateway.ENDPOINTS[4] as APIAddress
//     const {
//         name,
//         endpoint,
//         region
//     } = testRoute

//     const options = {
//         headers: {},
//         response: true,
//         queryStringParameters: { company_id: companyId }
//     }
//     return API.get(name, `${name}`, options)
//         .then(response => response.data)
//         .catch(err => {
//             console.log(`☠ ERROR`);
//             console.log(err.response);
//         })
// }

// export const validateUser = async (user: FixMe) => {
//     const {
//         name,
//         endpoint,
//         region
//     } = config.apiGateway.ENDPOINTS[1] as APIAddress

//     const options = {
//         body: { ...user },
//         response: true,
//     }


//     return API.post(name, `${name}`, options)
//         .then(res => res.data)
//         .catch(err => {
//             console.log(`☠ ERROR`);
//             console.log(err);
//         })
// }

// export const getCompanies = async () => {
//     const {
//         name,
//         endpoint,
//         region
//     } = config.apiGateway.ENDPOINTS[3] as APIAddress

//     const options = {
//         response: true,
//     }


//     return API.get(name, `${name}`, options)
//         .then(res => res.data)
//         .catch(err => {
//             console.log(`☠ ERROR`);
//             console.log(err);
//         })
// }