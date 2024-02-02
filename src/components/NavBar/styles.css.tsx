import styled from 'styled-components'
import { Button } from '../Common/styles.css'

export const Container = styled.div`
    height: 50px;
    background: #3A82D0;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    z-index: 5;
    border-radius: 12px;
`;

export const ThemeButton = styled(Button)`
    margin-right: 10px;
    font-family:${({theme}) => theme.font.family.secondary};
    font-size: 14px;
    background: white;
    padding: 8px 12px;
    color:#252733;
    font-weight: 500;
`;

export const ToggleViewButton = styled(Button)`
    margin: 0 10px;
    font-family:${({theme}) => theme.font.family.secondary};
    font-size: 14px;
    background: none;
    border: 2px white solid;
    padding: 8px 12px;
    font-weight: 500;
`;