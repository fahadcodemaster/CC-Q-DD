import styled from 'styled-components'
import { Button } from '../../Common/styles.css'

export const Container = styled.div`
    select{
        margin-right: 10px;
        margin-left: 10px;
        padding: 8px 12px;
        border: none;
        font-family:${({theme}) => theme.font.family.secondary};
        font-size: 14px;
        outline: none;
        border-radius:7px;
        background: white;
        cursor: pointer;
    }
`;
