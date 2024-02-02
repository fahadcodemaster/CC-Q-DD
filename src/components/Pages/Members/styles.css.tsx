import styled from 'styled-components';
import { H2, P } from '../../Common/styles.css';
import defaultProfileImg from '../../../assets/default-user-avatar.png';
import { BorderAll } from '@material-ui/icons';
interface PipelineItem {
    catagory?: string;
}
const getColor = (list: string | undefined, type?: string | undefined) => {
    switch (list) {
        case 'LEADERS':
            return type === 'c' ? '#9A5369' : '#F6EAF2';
        case 'CHAMPIONS':
            return type === 'c' ? '#536F9A' : '#E8EFF8';
        case 'APPLICANTS':
            return type === 'c' ? '#AE6E32' : '#FBE9E0';
        case 'CANDIDATES':
            return type === 'c' ? '#536F9A' : '#E8EFF8';
        case 'PROSPECTS':
            return type === 'c' ? '#6E539A' : '#EEEAF6';
        case 'FLOATERS':
            return type === 'c' ? '#6A9A53' : '#ECF6EA';
    }
};

const getTagColor = (tag: string) => {
    switch (tag) {
        case 'APPROVED':
            return { font: '#4AAD7E', bg: '#dbefe5' };
        case 'WITHDREW':
            return { font: '#49516D', bg: '#dbdce2' };
        case 'DECLINED':
            return { font: '#D56164', bg: '#f7dfe0' };
        case 'EMPLOYEE':
            return { font: '#0084D6', bg: '#cce6f7' };
        case 'ALUMNI':
            return { font: '#49D2C9', bg: '#dbf6f4' };
        case 'DESIGNEE':
            return { font: '#49D2C9', bg: '#dbf6f4' };
    }
};

interface IMemberCategoryTitle {
    status: string;
    topStatus?: string;
}

interface IMemberHeader {
    isOpen: boolean;
}

const colors: any = {
    Matched: '#6E539A',
    Applied: '#536F9A',
    Queue: '#6A9A53',
    DORMANT: '#AE6E32',
    floaters: '#9A5369',
};

const backgrounds: any = {
    Matched: '#EEEAF6',
    Applied: '#E8EFF8',
    Queue: '#ECF6EA',
    DORMANT: '#FBE9E0',
    floaters: '#F6EAF2',
};

const backgroundShades: any = {
    Matched: '#b7a9cd',
    Applied: '#a9b7cd',
    Queue: '#b5cda9',
};

const licenseColors: any = {
    purple: '#B660C7',
    green: '#49D2C9',
    blue: '#0084D6',
    red: '#F37A7C',
    yellow: '#FDBD41',
    gray: '#B3B3B3',
};

export const CohortContainer = styled(P)`
    font-size: 12px;
    font-weight: 500;
    padding: 1px 15px;
    text-align: center;
    border-radius: 8px;
    background: #f0f0f0;
    margin: 5px 0;
    color: #333;
`;

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

export const Container = styled.div`
    height: 100%;
    width: 100%;
    padding: 20px;
    background: ${({ theme }) => theme.backgroundColor.bgPrimary};
`;

export const MemberGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 0 auto;
    margin-top: 30px;
    gap: 25px;
`;
export const MemberCategoryList = styled.div``;

export const MemberCategoryTitle = styled.div<IMemberCategoryTitle>`
    display: flex;
    width: 100%;
    height: 80px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    position: relative;
    > div:first-child {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        border-radius: 12px;
        gap: 8px;
        background: ${({ status }) => backgrounds[status]};
        position: relative;
        cursor: pointer;
        > h1 {
            font-family: ${({ theme }) => theme.font.family.primary};
            color: ${({ status }) => colors[status]};
            font-size: 14px;
            border-radius: 12px;
            text-transform: capitalize;
        }

        > h2 {
            font-family: ${({ theme }) => theme.font.family.primary};
            color: ${({ status }) => colors[status]};
            background: ${({ status }) => backgrounds[status]};
            font-size: 14px;
            font-weight: 600;
            border-radius: 12px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`;

export const FilterIconContainer = styled.div`
    position: absolute;
    right: 24px;
    cursor: pointer;
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const MemberCategoryFilter = styled.div<IMemberCategoryTitle>`
    position: absolute !important;
    top: calc(100%);
    left: 0;
    right: 0;
    background: ${({ status }) => backgrounds[status]};
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 24px;
    border-radius: 8px;
    z-index: 500;
`;

export const FilterGroup = styled.div<IMemberCategoryTitle>`
    label {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
            color: ${({ status }) => colors[status]};
            font-family: ${({ theme }) => theme.font.family.primary};
            text-transform: capitalize;
        }
        input {
            margin-right: 8px;
        }
        input[type='checkbox'] {
            accent-color: ${({ status }) => colors[status]};
        }
    }
    .group-header {
        margin: 8px 0;
        padding: 8px 4px;
        width: 100%;
        label {
            span {
                font-size: 14px;
                font-weight: 600;
            }
        }
        background: ${({ status }) => backgroundShades[status]};
        border-radius: 4px;
    }
    .group-children {
        margin-left: 12px;
        label {
            span {
                font-size: 12px;
                font-weight: 400;
            }
        }

        label:not(:last-child) {
            margin-bottom: 4px;
        }
    }
`;

export const MemberCard = styled.div`
    box-shadow: ${({ theme }) => theme.shadowReference.card};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.backgroundColor.secondary};
    padding: 16px;
    position: relative;
    margin: 10px auto;
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
        -webkit-box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
        -moz-box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
        box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);

        .dorpdown-container {
            display: block;
        }
    }
`;

export const DropdownContainer = styled.div`
    position: absolute;
    top: 10px;
    right: 16px;
    display: none;
    cursor: pointer;
`;
export const MenuContainer = styled.div`
    height: 25px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: #d3d3d3 1px solid;
    transform: rotate(90deg);
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
    position: relative;
    align-items: center;
    div {
        height: 100%;
        width: 100%;
        position: relative;
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
    .loader {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        color: #828aa0;
    }
`;

export const Dropdown = styled.div<{ isMatched?: boolean }>`
    padding: 10px 0;
    background: #49516d;
    position: absolute;
    top: 40px;
    right: 0;
    font-family: ${({ theme }) => theme.font.family.primary};
    font-weight: 500;
    font-size: 12px;
    z-index: 333;
    border-radius: 8px;
    color: #f5f5f7;
    cursor: pointer;

    li {
        position: relative;
        font-size: 14px;
    }
    .line-breaker {
        border-bottom: 2px #7d8499 solid;
    }

    .category-menu {
        padding: 5px 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: space-between;

        transition: background 300ms ease-in-out;

        &:hover {
            background: #7d8499;
        }

        svg {
            fill: #f5f5f7;
            border: #f5f5f7;
            stroke: #f5f5f7;
        }

        .lock-icon {
            fill: #f5f5f7;
            position: absolute;
            right: -5px;
            top: 50%;
            transform: translateY(-50%) scale(0.35);
            svg {
                stroke: unset;
            }
        }
    }

    li .dropdown-menu {
        border-radius: 8px;
        width: 100%;
        position: absolute;
        top: calc(100%);
        z-index: 1000;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        background: #49516d;
        // overflow: hidden;
        li > span {
            padding: 5px 15px;
            display: block;
            font-family: 'Inter', sans-serif;

            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            .checkmark {
                fill: #f5f5f7;
                border: #f5f5f7;
                stroke: #f5f5f7;
                width: 12px;
                height: 12px;
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
            }

            .lock-icon {
                fill: #f5f5f7;
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%) scale(0.35);
            }

            transition: background 300ms ease-in-out;

            &:hover {
                background: #7d8499;
            }
        }
        li > span.active {
            background: gray;
        }
    }

    .dropdown-menu .dropdown-submenu {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 8px 0px;
        margin-left: 1px;
        display: none;
        position: absolute;
        left: ${({ isMatched }) => (isMatched ? 'calc(-100% + -2px)' : '100%')};
        top: 0;
        z-index: 1000;

        li {
            label {
                &:hover {
                    background: #7d8499;
                }
            }
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
        li.group-menu span{
            text-align: center;
            display: block;
            background: gray;
            padding-top: 7px;
            padding-bottom: 4px;
        }
        li.group-menu:first-child span {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
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
export const MemberCardTopLevel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 25px;
`;

export const MemberCardTopLevelInfos = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
`;
export const MemberTitle = styled(H2)`
    cursor: pointer;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: -0.3px;
    margin: 0;
    margin-bottom: 4px;
`;

export const MemberCompany = styled(P)`
    color: #767676;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -0.3px;
    margin: 0;
    margin-bottom: 4px;
`;

export const StyledCheckBoxContainer = styled.div<IMemberCategoryTitle>`
    position: relative;

    input {
        display: none;
        cursor: pointer;
    }

    .label-checkbox {
        position: relative;
        margin-right: 8px;
    }

    .label-checkbox:before {
        content: '';
        -webkit-appearance: none;
        background-color: transparent;
        width: 16px;
        height: 16px;
        border: 2px solid ${({ status }) => colors[status]};
        display: inline-block;
        position: relative;
        vertical-align: middle;
        cursor: pointer;
        border-radius: 4px;
    }

    input:checked + .label-checkbox:after {
        content: '';
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        background: ${({ status }) => colors[status]};
        border: 2px solid ${({ status }) => colors[status]};
        top: 0;
        left: 0;
        cursor: pointer;
        border-radius: 4px;
    }

    input:indeterminate + .label-checkbox:after {
        content: '';
        display: block;
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${({ status }) => colors[status]};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        border-radius: 4px;
    }
`;

export const CheckBoxHeaderContainer = styled.div<IMemberCategoryTitle>`
    position: absolute;
    left: 24px;

    input {
        display: none;
        cursor: pointer;
    }

    label {
        position: relative;
        margin-right: 8px;
    }

    label:before {
        content: '';
        -webkit-appearance: none;
        background-color: transparent;
        width: 16px;
        height: 16px;
        border: 2px solid ${({ status }) => colors[status]};
        display: inline-block;
        position: relative;
        vertical-align: middle;
        cursor: pointer;
        border-radius: 4px;
    }

    input:checked + label:after {
        content: '';
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        background: ${({ status }) => colors[status]};
        border: 2px solid ${({ status }) => colors[status]};
        top: 0;
        left: 0;
        cursor: pointer;
        border-radius: 4px;
    }

    input:indeterminate + label:after {
        content: '';
        display: block;
        position: absolute;
        width: 8px;
        height: 8px;
        background: ${({ status }) => colors[status]};
        top: calc(50% + 2px);
        left: 50%;
        vertical-align: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
        border-radius: 4px;
    }
`;

export const MemberDepartment = styled(P)`
    color: #676767;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -0.3px;
    margin: 0;
    line-height: 130%;
    text-align: center;
`;

export const MemberDetails = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    p {
        color: #767676;
        font-weight: 500;
        font-size: 12px;
        margin: 0;
        font-family: ${({ theme }) => theme.font.family.primary};
    }
`;

export const MemberCardBottomLevel = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const MemberNonprofit = styled.div`
    display: flex;
    align-items: center;
    flex: 1;

    p {
        display: flex;
        align-items: center;
        span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 200px;
        }
        color: #767676;
        font-weight: 500;
        font-size: 12px;
        margin: 0;
        font-family: ${({ theme }) => theme.font.family.primary};
        white-space: nowrap;
    }

    img {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        object-fit: cover;
    }

    margin-bottom: 10px;
`;

export const ImgContainer = styled.div`
    position: relative;
    border-radius: 50%;
    cursor: pointer;
    height: 48px;
    width: 48px;
`;

export const ProfileImg = styled.img`
    height: 48px;
    width: 48px;
    border-radius: 50%;
    object-fit: cover;
    // &:before {
    //     content: ' ';
    //     display: block;
    //     position: absolute;
    //     height: 50px;
    //     width: 50px;
    //     background-image: url(${defaultProfileImg});
    // }
`;

export const EyeImg = styled.img`
    width: 20px;
    object-fit: cover;
    margin-left: 5px;
`;

export const MemberHeaderPipeline = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 50px;
    transition: height 0.4 ease-in-out;
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

export const MemberHeader = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    > select {
        padding: 5px 16px;
        border: 1px #828aa0 solid;
        border-radius: 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: #828aa0;
    }
`;

export const MemberSubStatus = styled.div<IMemberCategoryTitle>`
    display: block;
    border-radius: 8px;
    padding: 8px;
    background-color: ${({ status }) => backgrounds[status]};
    text-algin: center;
    margin: 0 auto 12px auto;
    transition: box-shadow 0.3s ease-in-out;
    position: relative;
    color: inherit;
    > div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        h2 {
            margin: 0;
            padding: 0;
        }
        > h2:first-child {
            line-height: 1.2;
            margin: 5px;
            color: ${({ status }) => colors[status]};
            font-weight: 600;
            font-size: 12px;
            text-align: center;
        }

        > h2:last-child {
            line-height: 1.2;
            font-family: ${({ theme }) => theme.font.family.primary};
            color: white;
            background: ${({ status }) => colors[status]};
            font-size: 12px;
            font-weight: 600;
            border-radius: 12px;
            height: 22px;
            width: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    > .status {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    &:hover {
        cursor: pointer;
        -webkit-box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
        -moz-box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
        box-shadow: 0px 0px 5px 0px rgba(204, 204, 204, 1);
    }
`;

export const Status = styled(P)<IMemberCategoryTitle>`
    font-size: 12px;
    font-weight: 600;
    background: ${({ status, topStatus }) => getTagColor(status)?.bg || backgrounds[topStatus as string]};
    color: ${({ status, topStatus }) => getTagColor(status)?.font || colors[topStatus as string]};
    padding: 1px 15px;
    min-width: 85px;
    text-align: center;
    border-radius: 8px;
`;

export const OrganizationLink = styled(P)<IMemberCategoryTitle>`
    font-size: 12px;
    font-weight: 600;
    padding: 1px 15px;
    min-width: 85px;
    text-align: center;
    border-radius: 8px;
    background: ${({ status, topStatus }) => getTagColor(status)?.bg || backgrounds[topStatus as string]};
    color: ${({ status, topStatus }) => getTagColor(status)?.font || colors[topStatus as string]};
`;
