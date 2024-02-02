import styled from 'styled-components';
import { P } from '../../Common/styles.css';

interface IStatus {
    status: string;
}

interface IFilters {
    isOpen: boolean;
}

export const EngagementFiltersContainer = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 50px;
    transition: height 0.4 ease-in-out;
    margin-top: 15px;
    font-family: ${({ theme }) => theme.font.family.primary};
    input {
        padding: 5px 16px;
        border: 1px #828aa0 solid;
        border-radius: 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: #828aa0;
        margin-top: 4px;
    }
    select {
        padding: 5px 16px;
        border: 1px #828aa0 solid;
        border-radius: 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: #828aa0;
        margin-top: 4px;
    }
    > div {
        text-align: center;
        span {
            font-style: normal;
            font-weight: 600;
            font-size: 12px;
            color: #828aa0;
        }
    }
`;

const colors: any = {
    info: '#5887FF',
    danger: '#F26464',
    warning: '#FFB648',
    success: '#41B461',
};
const backgrounds: any = {
    info: '#5887FF1A',
    danger: '#DE654B1A',
    warning: '#FFAC321A',
    success: '#41B4611A',
};

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
    top: -10px;
    right: -10px;
    z-index: 300;
    height: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    width: ${({ shape }) => (shape === 'circle' ? '25px' : '20px')};
    background: ${({ status }) => licenseColors[status]};
    border-radius: ${({ shape }) => (shape === 'circle' ? '50%' : '1px')};
    border: 4px solid #fff;
`;

export const AdvancedFiltersContainer = styled.div`
    font-family: ${({ theme }) => theme.font.family.primary};
    position: absolute;
    left: 50%;
    top: calc(100% + 8px);
    z-index: 1000;
    border-radius: 8px;
    transform: translateX(-50%);
    padding: 8px 12px;
    width: auto;
    background: #fff;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

export const FilterContainer = styled.div`
    &:not(:last-child) {
        margin-bottom: 8px;
    }
`;

export const LockIconContainer = styled.div`
    display: flex;
    align-items: center;
    height: 17px;
    width: fit-content;
    svg {
        fill: #7d8499;
        transform: scale(0.35);
    }
`;

export const MemberNonprofit = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    background: transparent;

    img {
        border-radius: 8px;
        width: 30px;
        height: 30px;
        background: transparent;
        object-fit: cover;
    }

    transition: 300ms box-shadow ease-in-out;

    &:hover {
        box-shadow: rgba(73, 210, 201, 0.5) 0px 5px 15px;
    }
`;

export const MoreNonProfits = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-family: ${({ theme }) => theme.font.family.primary};
    background: #49d2c9;
    color: #f5f5f7;
`;

export const FilterParent = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    span {
        text-transform: capitalize;
        margin-left: 8px;
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        white-space: nowrap;

        .public-icon,
        .private-icon,
        .cariclub-icon {
            flex: 0;
            svg {
                width: 18px;
                height: 18px;
            }
        }
    }
    margin-bottom: 8px;

    padding: 4px;
    background: rgba(0, 0, 0, 0.1);
    color: #3d3d3d;
    border-radius: 4px;
`;

export const FilterChildrenContainer = styled.div`
    label {
        padding-left: 8px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        span {
            text-transform: capitalize;
            margin-left: 8px;
            isplay: block;
            font-weight: 400;
        }
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

export const Container = styled.div`
    height: 100%;
    width: 100%;
    padding: 20px;

    .dropdownlayout {
        z-index: 999;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
`;

export const TopBar = styled.div`
    display: flex;
    width: 100%;
    //padding: 25px 10px;
    height: max-content;
    justify-content: space-between;
    font-size: 22px;

    > ul {
        display: flex;
        justify-content: center;
        align-items: center;
        > span {
            color: #2c3152;
            padding: 0 40px;
            font-family: sans-serif;
        }
        > li {
            padding: 2px;
        }
    }
`;

export const EditDropdown = styled.div`
    display: flex;
    align-items: center;
    margin-right: 5px;
    border: 1px solid #a1a1a1;
    border-radius: 8px;
`;

export const SelectAllText = styled.span`
    font-family: 'Inter', sans-serif;
    font-size: 14px;
`;

export const DropdownToggle = styled.span<{ isDisabled: boolean }>`
    border-radius: 0 !important;
    height: 20px;
    width: 20px;
    display: block;
    font-family: 'Inter', sans-serif;
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    display: flex;
    align-items: center;
    justify-content: center;
    .arrowIcon {
        fill: #a1a1a1;s
    }
    .dropdown-toggle {
        background: transparent !important;
    }
`;

export const Dropdown = styled.ul`
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

    li .dropdown-menu {
        width: auto;
        background: #49516d;
        position: absolute;
        top: calc(100% + 10px);
        z-index: 1000;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        li > span {
            white-space: nowrap;
            padding: 12px 36px;
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
            &:hover {
                background: #7d8499;
            }
        }
    }

    .dropdown-menu .dropdown-submenu {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 8px 0px;
        margin-left: 1px;
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        z-index: 1000;
    }
    .dropdown-menu .dropdown-submenu-left {
        right: 100%;
        left: auto;
    }
    .dropdown-menu > li:hover > .dropdown-submenu {
        display: block;
    }
`;

export const DropdownItem = styled.div`
    select {
        border-radius: 12px;
        border: 1px #828aa0 solid;
        padding: 1px 25px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        font-weight: 600;
        font-size: 14px;
        font-family: ${({ theme }) => theme.font.family.primary};
        color: #828aa0;
        cursor: pointer;
    }
`;

export const SearchItem = styled.div`
    border-radius: 12px;
    cursor: pointer;
    border: 1px #828aa0 solid;
    padding: 1px 25px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
        height: 100%;
        width: 100%;
        input {
            display: block;
            height: 100%;
            border: none;
            background: none;
            outline: none;
            font-weight: 600;
            font-size: 14px;
            font-family: ${({ theme }) => theme.font.family.primary};
            color: #333;

            &::placeholder {
                color: #828aa0;
            }
            &:-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #828aa0;
            }
            &::-ms-input-placeholder {
                /* Microsoft Edge */
                color: #828aa0;
            }
        }
    }
`;

export const StyledOption = styled.option`
    position: relative;

    div {
        display: none;
        position: absolute;
        top: 0;
        left: 100%;
        flex-direction: column;
        gap: 8px;
        div:not(:last-child) {
            border-bottom: 1px solid #333;
        }
    }
`;

export const TabBtn = styled.button`
    padding: 5px 16px;
    border: 1px #828aa0 solid;
    border-radius: 12px;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: #828aa0;
    &:hover {
        cursor: pointer;
        color: #5887ff;
        border-color: #5887ff;
    }
`;
export const TabBtnShort = styled(TabBtn)`
    font-size: 5px;
    padding: 0px 8px;
`;
export const DownloadBtn = styled(TabBtn)`
    height: 36px;
    border: 1px #9e9e9e solid;
    border-radius: 12px;
    font-size: 12px;
    background: #2a3358;
    color: white;
    display: flex;
    align-items: center;
`;

export const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 21px;
    > div:last-child {
        cursor: pointer;
    }
`;

export const ImageNameContainer = styled.div`
    display flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 15px;

    div:last-child{
        text-align: left;
    }
`;

export const Table = styled.table`
    display: block;
    position: relative;
    border-collapse: collapse;
    font-family: sans-serif;
    margin-top: 30px;
    color: #828aa0;
`;

export const TableBody = styled.tbody`
    width: 100%;
    display: block;

    > tr {
        min-height: 110px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        padding-inline: 35px;
        background: white;
        border-radius: 8px;
        > td {
            color: black;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            overflow: hidden;
            color: #767676;
            font-weight: 500;
            font-size: 16px;
            font-family: ${({ theme }) => theme.font.family.primary};
        }

        > td:first-child {
            width: 23%;
            justify-content: flex-start;
        }
        > td:not(:first-child) {
            width: 15%;
        }
        > td:last-child {
            width: 2%;
            svg {
                cursor: pointer;
            }
        }

        &:hover {
            background: #f2f6ff !important;
        }
    }
`;

export const Status = styled(P)<IStatus>`
    font-size: 12px;
    background: ${({ status }) => backgrounds[status]};
    color: ${({ status }) => colors[status]};
    padding: 8px 0;
    min-width: 130px;
    text-align: center;
    border-radius: 8px;
    font-weight: 500;
`;

export const Detail = styled(P)<IStatus>`
    font-size: 16px;
    color: ${({ status }) => colors[status]};
    padding: 8px 0;
    min-width: 130px;
    text-align: center;
    border-radius: 8px;
    font-weight: 500;
`;

export const SelectionCounter = styled(P)`
    font-size: 14px;
    font-family: ${({ theme }) => theme.font.family.primary};
    color: #333;
    font-weight: 500;
`;

export const TableHeader = styled.thead`
    display: block;
    min-height: 50px;
    position: sticky;
    top: 72px;
    background: #f5f5f8;
    z-index: 999;
    > tr {
        display: flex;
        position: relative;
        align-items: center;
        padding-inline: 35px;
        > th {
            color: #a1a1a1;
            padding: 12px;
            text-transform: uppercase;
            font-size: 12px;
            font-family: ${({ theme }) => theme.font.family.primary};
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            cursor: pointer;

            p {
                position: relative;
                .order-icon {
                    position: absolute;
                    right: -25px;
                    top: 50%;
                    transform: translateY(-60%);

                    svg {
                        stroke: #a1a1a1;
                        path {
                            fill: #a1a1a1 !important;
                        }
                    }
                }

                &::selection {
                    background: none;
                }
            }
        }
        > th:first-child {
            width: 23%;
        }

        > th:not(:first-child) {
            width: 15%;
        }

        > th:last-child {
            width: 2%;
        }
    }
`;
export const ProfileImgContainer = styled.div`
    min-width: 51px;
    height: 51px;
    cursor: pointer;
    border-radius: 50%;
    position: relative;
`;
export const ProfileImg = styled.img`
    width: 51px;
    object-fit: cover;
    height: 51px;
    border-radius: 50%;
`;
export const EyeImg = styled.img`
    width: 20px;
    object-fit: cover;
    margin-left: 5px;
`;
export const RingBell = styled.img`
    width: 32px;
    padding: 2px;
    object-fit: cover;
    cursor: pointer;

    &.active {
        box-shadow: 0px 1px 5px #a4c2f7;
        border-radius: 3px;
        background: #49d2c98f;
    }
;`
const StatusDefult = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    width: 267px;
    height: 36px;
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
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

//
export const PrimeDatailStatus = styled.span`
    color: #5887ff;
`;
export const ActiveDatailStatus = styled.span`
    color: #41b461;
`;
export const IdleDatailStatus = styled.span`
    color: #ffb648;
`;
export const InactiveDatailStatus = styled.span`
    color: #de654b;
`;

export const CheckboxContainer = styled.div`
    padding: 4px;
    border-right: 1px #767676 solid;
`;

export const CheckboxInputAll = styled.input`
    margin-right: 4px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px #767676 solid;
`;

export const CheckboxInput = styled.input`
    cursor: pointer;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px #767676 solid;
    margin-right: 10px;
`;
