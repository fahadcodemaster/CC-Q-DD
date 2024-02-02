import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, H2, P } from '../../Common/styles.css';

export const Container = styled.div`
  height: 100%;
  width: 100%;
`

export const GroupContainer = styled.div`
  height: 100%;
	width: 100%;
	padding: 20px;
	background: ${({ theme }) => theme.backgroundColor.bgPrimary};
`
export const BackButton = styled(Link)`
	font-weight: 700;
	gap: 12px;
	text-decoration: none;
	font-size: 24px;
	font-family: ${({ theme }) => theme.font.family.secondary};
	color: #2C3152;
	margin-bottom: 45px;
`

export const AddNewButton = styled(Button)`
    background: #2a3358;
    font-family: ${({ theme }) => theme.font.family.secondary};
    font-size: 14px;
    font-weight: 600;
    color: white;
    border-color: #2a3358;
    padding: 8px 22px;
    margin-bottom: 10px;

    svg {
        margin-left: 8px;
    }
`;

export const EditButton= styled(Button)`
    padding: 9.5px 17.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: ${({theme}) => theme.font.family.primary};
    color: #FFFFFF;
    gap: 12px;
    border: none;
    outline: none;
    background: #3A82D0;
    cursor: pointer;
    border-radius: 4px;
`
export const RemoveButton= styled(Button)`
    padding: 9.5px 17.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    font-family: ${({theme}) => theme.font.family.primary};
    color: #FFFFFF;
    gap: 12px;
    border: none;
    outline: none;
    background: #d56164;
    cursor: pointer;
    border-radius: 4px;
`

