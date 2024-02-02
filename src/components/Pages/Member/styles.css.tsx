import styled from 'styled-components';
import { Button, H1, H2, P } from '../../Common/styles.css';
import { Link } from 'react-router-dom';
import { keyframes } from "styled-components";

export const Container = styled.div`
    height: 100%;
    padding: 20px;
    background: ${({ theme }) => theme.backgroundColor.bgPrimary};
    width: 100%;
`;

export const EditFormContainer = styled.div`
    background: #fff;
    max-width: 1024px;
    min-width: 524px;
    width: 100%;
    padding: 20px 24px;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    margin-top: 25px;
`;

export const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
`;

export const MenuHeaderContainer = styled(P)`
    width: 100%;
    background: #f2f2f2;
    padding: 12px;
    font-weight: 500;
    color: #1d1d1d;
    font-size: 16px;
`;

export const FormGroup = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 100%;
`;

export const FormContent = styled.div`
    max-width: 800px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    background: #fff;
`;
export const Formtitle = styled.span`
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    
    display: flex;
    vertical-align: middle;
    a {
        margin-left: 20px;
        cursor: pointer;
    }
`;

export const ButtonsRow = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    a {
        width: 40px;
        height: 40px;
    }
`;

export const StyledForm = styled.div`
    font-family: Mulish,sans-serif;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    gap: 20px;
    padding-top: 20px;
`;

export const FullWidthFormItem = styled.div`
    width: 100%;
    span.custom-btn {
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
    }
`;

export const FormItem = styled.div`
    width: 100%;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    span.custom-btn {
        font-size: 14px;
        font-weight: normal;
        cursor: pointer;
    }
`;

export const DetailsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 400px;
    gap: 51px;
`;
export const StatsInfoBox = styled.div`
    width: 100%;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    background: white;
    padding: 20px 24px;
    gap: 24px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 500;
    font-size: 14px;
    color: #2c3152;
    p {
        margin: 5px;
    }
`;
export const RightSectionTopItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 312px;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    background: white;
    padding: 20px 24px;
    gap: 24px;
    a {
        max-height: 40px;
    }
`;

export const ProgressBarContainer = styled.div`
    position: relative;
`;

export const CopperButton = styled.button`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.font.family.primary};
    color: #ffffff;
    gap: 12px;
    border: none;
    outline: none;
    background: #3a82d0;
    cursor: pointer;
    flex: 1;
    border-radius: 4px;
`;

export const BackButton = styled(Link)`
    font-weight: 700;
    gap: 12px;
    text-decoration: none;
    font-size: 24px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    color: #2c3152;
    margin-bottom: 45px;
`;

export const ImageContainer = styled.div`
    width: 85px;
    height: 85px;
    position: relative;
`;

export const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: calc(100% - 335px);
`;

export const DetailsContent = styled.div`
    p {
        font-family: ${({ theme }) => theme.font.family.secondary};
        font-size: 20px;
        color: #767676;
        font-weight: 700;
    }
`;

export const HistoryContent = styled.div`
    display: flex;
    > div {
        height: 100%;
        width: 40%;
    }
`;

export const MemberInfosContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 32px;
    margin-top: 31px;
`;

export const MemberUpdates = styled.div`
    min-height: 888px;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    background: white;
`;

export const SectionHeader = styled.div`
    padding: 20px 24px;
    padding-bottom: 0;
`;

export const SectionHeaderText = styled(H2)`
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 19px;
    color: #252733;
    margin: 0;
    margin-bottom: 5px;
`;

export const MemberName = styled(H1)`
    margin: 0;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 24px;
    color: #2c3152;
    font-weight: 700;
`;

export const PlaceholderImg = styled.div`
    width: 200px;
    height: 200px;
    background-color: grey;
    border-radius: 7px;
`;

export const ProfileImg = styled.img`
    width: 85px;
    height: 85px;
    border-radius: 50%;
    object-fit: cover;
`;
export const EyeImg = styled.img`
    width: 20px;
    object-fit: cover;
    margin-left: 5px;
`;
export const InterestIcon = styled.img`
    width: 40px;
`;

export const RightSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 335px;
`;

export const RightSectionItem = styled.div`
    min-height: 376px;
    min-width: 312px;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    background: white;

    padding: 20px 24px;
`;

const StatusDefult = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    width: 100px;
    height: 25px;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    margin-top: 10px;
`;
export const PrimeStatus = styled(StatusDefult)`
    background: #5887ff1a;
    color: #5887ff;
`;
export const ActiveStatus = styled(StatusDefult)`
    background: #41b4611a;

    color: #41b461;
`;
export const IdleStatus = styled(StatusDefult)`
    background: #ffac321a;
    color: #ffb648;
`;
export const InactiveStatus = styled(StatusDefult)`
    background: #de654b1a;
    color: #de654b;
`;

export const LoadMoreContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
`;

export const StyledButton = styled.button<{ isSubmit?: boolean; isCancel?: boolean }>`
    padding: 14px 28px;
    font-size: 14px;
    max-width: 400px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.font.family.primary};
    color: #ffffff;
    border: none;
    outline: none;
    background: ${({ isSubmit, isCancel }) => (isSubmit ? '#49D2C9' : isCancel ? '#132A5D' : '#3a82d0')};
    cursor: pointer;
    flex: 1;
    border-radius: 4px;
    margin: 15px 0;
`;
export const ItemLabel = styled(P)`
    color: inherit;
    font-size: 14px;
    font-weight: 600;
    transition: color 0.4s ease-in-out;
    cursor: pointer;
`;

export const DownloadButton = styled(Button)`
    background: #2a3358;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 14px;
    font-weight: 600;
    color: white;
    height: 40px;
    width: 40px;
    border-color: #2a3358;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 18px;
        height: 18px;
    }
`;
const licenseColors: any = {
    purple: '#B660C7',
    green: '#49D2C9',
    blue: '#0084D6',
    red: '#F37A7C',
    yellow: '#FDBD41',
    gray: '#B3B3B3',
};
export const LicenseStatusCircle = styled.div<{ shape: string; status: string }>`
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 300;
    height: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    width: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    background: ${({ status }) => licenseColors[status]};
    border-radius: ${({ shape }) => (shape === 'circle' ? '50%' : '1px')};
    border: 4px solid #fff;
`;
const spinnerAnimation = keyframes`
   0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`
export const Spinner = styled.div`
    display: inline-block;
    width: 100%;
    height: 80px;

    &:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 50%;
        border: 6px solid #DFE0EB;
        border-color: #DFE0EB transparent #DFE0EB transparent;
        animation: ${spinnerAnimation} 1.2s linear infinite;
    }
`


export const Dropdown = styled.div`
    position: relative;
    label {
        background: #3A82D0;
        color: white;
        font-family: Mulish,sans-serif;
        font-weight: 500;
        font-size: 14px;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        padding: 5px;
        padding-right: 20px;
        margin-top: 10px;
        width: 100%;
        display: block;
        svg {
            float: right;
            position: absolute;
            right: 2px;
            top: 0;
        }
    }
`
export const DropdownMenu = styled.div`
    padding: 10px 0;
    background: #49516d;
    position: absolute;
    top: 30px;
    left: 0;
    font-family: Inter,sans-serif;
    font-weight: 500;
    font-size: 12px;
    z-index: 333;
    border-radius: 8px;
    color: #f5f5f7;
    cursor: pointer;
    width: 150px;

    .dropdown:not(.dropdown-toggle) {
        border-radius: 8px;
        color: #f5f5f7;
        .DropdownIcon {
            stroke: #f5f5f7;
        }
    }

    li {
        position: relative;
        font-size: 14px;
        .DropdownIcon {
            stroke: #f5f5f7;
        }
    }
    
    .dropdown-menu {
        background: #49516d;
        color: #f5f5f7;
        li { 
            span {
                white-space: nowrap;
                padding: 5px 10px;
                display: block;
                font-family: 'Inter', sans-serif;
                cursor: pointer;

                display: flex;
                align-items: center;
                justify-content: space-between;

                .lock-icon {
                    fill: #f5f5f7;
                    stroke: none !important;
                    border: none !important;
                    position: absolute;
                    right: 5px;
                    top: 50%;
                    transform: translateY(-50%) scale(0.35);
                }
                
            }
            &:hover {
                background: #7d8499;
            }
        }
        li > span.active {
            background: gray;
        }
    }

    .dropdown-menu .dropdown-submenu {
        min-width: 130px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 8px 0px;
        margin-left: 1px;
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        z-index: 1000;
        border-radius: 8px;
        padding: 5px 0px;

        li {
            padding-right: 15px;
        }

        li > svg {
            fill: #f5f5f7;
            border: #f5f5f7;
            stroke: #f5f5f7;
            width: 12px;
            height: 12px;
            position: absolute;
            right: 5px;
            top: 7px;
        }
    }
    .dropdown-menu .dropdown-submenu-left {
        right: 100%;
        left: auto;
    }
    .dropdown-menu > li:hover > .dropdown-submenu {
        display: block;
    }
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background: transparent;
    z-index: 100;
`;

export const ProgressSection = styled.div`
    width: 100%;
    border-radius: 8px;
    border: 1px solid #dfe0eb;
    background: white;
    padding: 20px 24px;
    gap: 24px;
    font-family: Mulish,sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #2c3152;

    span {
        margin-bottom: 5px;
        display: block;
        font-weight: 700;
        font-size: 19px;
    }
`;