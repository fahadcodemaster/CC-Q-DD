import styled from 'styled-components';
import { Button, UL } from '../Common/styles.css';

export const HeaderContainer = styled.div<{ isClient: boolean }>`
    width: 100%;
    min-height: 65px;
    background: ${({ isClient }) => (isClient ? '#3A82D0' : '#2C3152')};
    padding: 16px 35px;
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1000;
`;

export const LogoContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg {
        font-size: 38px;
    }
`;

export const Menu = styled(UL)`
    display: flex;
    list-style: none;
    height: 100%;
    align-items: center;
    flex-direction: row-reverse;
    justify-content: center;

    select {
        padding: 8px 12px;
        border: 1px #828aa0 solid;
        border-radius: 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        color: #828aa0;
        margin-top: 4px;
        cursor: pointer;
    }
`;

export const ThemeButton = styled(Button)`
    margin-right: 10px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 14px;
    background: white;
    padding: 8px 12px;
    color: #252733;
    font-weight: 500;
`;

export const ToggleViewButton = styled(Button)`
    margin: 0 10px;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 14px;
    background: none;
    border: 2px white solid;
    padding: 8px 12px;
    font-weight: 500;
`;

export const PublishUpdatesButton = styled.button`
    background: none;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: white;
    text-align: left;
    font-family: Mulish,sans-serif;
    &:hover {
        background: gray;
    }
`;
export const DownloadData = styled.button`
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: white;
    text-align: left;
    width: 100%;
    font-family: Mulish,sans-serif;
    &:hover {
        background: gray;
    }
`;

export const ButtonDropdown = styled.div`
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
    position: relative;
    width: 35px;
    height: 35px;
    font-family: Mulish,sans-serif;
    font-size: 22px;

    background: #49d2c9;
    border: 2px white solid;
    font-weight: bolder;
    border-radius: 50%;
    text-align: left;

    svg {
        width: 30px;
        height: 20px;
        margin-top: 5px;
        cursor: pointer;
        color: white;
    }
`;

export const ButtonDropdownContent = styled.div`
    padding: 10px 0;
    background: #49516d;
    position: absolute;
    top: 42px;
    right: -60px;
    font-family: Inter,sans-serif;
    z-index: 333;
    border-radius: 8px;
    color: #f5f5f7;
    cursor: pointer;
    width: 150px;
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