import styled, { keyframes } from 'styled-components'
import { UL, LI, H1, P } from '../Common/styles.css'

interface INavigationItem {
    isActive?: boolean;
}

export const Container = styled.div`
    height: 100%;
    background: ${({ theme }) => theme.backgroundColor.bgPrimary};
    position: fixed;
    transition: width 1s ease-in;
    min-width: 220px;
    border-right: 1px white solid;
    z-index: 10;
`;

export const Heading = styled.div`
    width: 100%;
    margin-top: 24px;
    padding-left: 32px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 13px;
`;

export const UserStatus = styled(P)`
    font-family: ${({theme}) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 18px;
    color: #636781;
    line-height: 1;
`

export const NavContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    > svg {{companyData && <CompanyTitle>{companyData.name}</CompanyTitle>}
        fill: ${({ theme }) => theme.color.text.normal};
        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }
    }
`;

export const CompanyTitle = styled(H1)`
    max-width: 120px;
    word-break: normal;
    margin-right: 5px;
`;

export const NavigationContent = styled.nav`
    width: 100%;
    max-width: 220px;
`;

export const LogoContainer = styled.div`
    padding: 24px 32px;
    img{
        max-width: 100%;
    }
    
`

export const NavigationItems = styled(UL)`
    margin: 65px 0 0 0;
`;

export const NavigationItem = styled(LI)<INavigationItem>`
    list-style: none;
    display: flex;
    align-items: center;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    background: ${({isActive}) => isActive ? "rgba(33, 35, 45, 0.08)" : "none"};
    border-left: ${({isActive}) => isActive ? '3px solid #7884C7' : "3px solid #F7F5F9"};
    > a {
        padding: 20px 29px;
        width: 100%;
        height: 100%;
        text-decoration: none;
        font-weight: ${({ theme }) => theme.font.weight.light};
        color: ${({isActive}) => isActive ? "#7884C7" : "#A2A1A7"};
        &:hover {
            cursor: pointer;
        }

        > svg{
            margin-right: 25px;
            path{
                fill:${({isActive}) => isActive ? "#7884C7" : "#A2A1A7"};
            }
        }
        
    }

    transition: background .4s ease-in-out;

    &:hover{
        background: rgba(33, 35, 45, 0.08);
        transition: background .4s ease-in-out;
    }
`;

export const NavigationIcon = styled(LI)`
    list-style: none;
    text-align: center;
    height: 50px;
    font-size: ${({ theme }) => theme.font.size.ml};
       > a svg{
        text-decoration: none;
        color: ${({ theme }) => theme.color.text.normal};
        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }
    }
`;