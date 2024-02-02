import styled from 'styled-components';
import { Button, H2, P } from '../Common/styles.css';

interface IFilterItem {
    isActive?: boolean;
}

export const DashboardHeaderContainer = styled.div`
    width: 100%;
    background: none;
    display: flex;
    justify-content: space-between;
`;

export const DashboardButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const DashboadHeaderFilters = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const MembersFiltersContainer = styled.div`
    display: flex;
`;

export const Title = styled(H2)`
    margin-right: 65px;
    font-size: 24px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-weight: 700;
    font-size: 24px;
`;

export const ActionsContainer = styled.div`
    display: flex;
    gap: 27px;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    position: relative;
    svg {
        cursor: pointer;
    }
    span {
        position: absolute;
        top: 5px;
        right: -10px;
        background: red;
        color: white;
        border-radius: 50%;
        font-family: Mulish,sans-serif;
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
        width: 20px;
        text-align: center;
    }
`;

export const FiltersContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
`;

export const FilterItem = styled.button<IFilterItem>`
    position: relative;
    font-size: ${({ theme }) => theme.font.size.m};
    color: #828aa0;
    padding: 1px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: ${({ isActive }) => (isActive ? '1px #5887FF solid' : '1px #828AA0 solid')};
    background: ${({ isActive }) => (isActive ? '#EEF3FF' : 'none')};
    color: ${({ isActive }) => (isActive ? '#5887FF' : '#828AA0')};
    cursor: pointer;

    transition: border-color 0.4s ease-in-out;

    &:hover {
        border-color: #5887ff;
        transition: border-color 0.4s ease-in-out;
        p {
            color: #5887ff;
            transition: color 0.4s ease-in-out;

            svg {
                stroke: #5887ff;
            }
        }
    }
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
    border-color: #2a3358;
    padding: 8px 22px;

    svg {
        margin-left: 8px;
    }
`;

export const DashboardHeaderButtonsContainer = styled.div`
    display: flex;
`;
