import styled from 'styled-components';
import { Button } from '../Common/styles.css';

export const AppContainer = styled.div`
    color: ${({ theme }) => theme.color};
    background-color: ${({ theme }) => theme.backgroundColor.primary};
    height: 100vh;
    width: 100vw;
    overflow: auto;
`;

export const LoadingText = styled.h3`
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 25px;
    font-family: ${({ theme }) => theme.font.family.primary};
`;

export const AppContent = styled.div`
    color: ${({ theme }) => theme.color};
    display: flex;
    margin-left: 220px;
`;

export const TopBarWhiteSpace = styled.div`
    height: 50px;
`;

export const SideBarWhiteSpace = styled.div`
    min-width: 50px;
    height: 50px;
`;

export const LoadingEle = styled.div`
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index: 15;
    background: whitesmoke;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > span {
        font-size: 25px;
        font-family: sans-serif;
    }
`;
