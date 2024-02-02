import styled from 'styled-components'

export const P = styled.p`
    font-family: ${({ theme }) => theme.font.family.primary};
    font-weight: ${({ theme }) => theme.font.weight.light};;
    font-style: ${({ theme }) => theme.font.style.normal};;
    color: ${({ theme }) => theme.color.text.normal};
    font-size: ${({ theme }) => theme.font.size.m};
    line-height: 2; 
`;

export const H1 = styled.h1`
    font-family: ${({ theme }) => theme.font.family.primary};
    font-weight: bold;
    font-style: normal;
    color: ${({ theme }) => theme.color.text.normal};
    font-size:${({ theme }) => theme.font.size.l};
    font-weight: bold;
    margin: 20px 0;
`;

export const H2 = styled.h2`
    font-family: ${({ theme }) => theme.font.family.primary};
    color: ${({ theme }) => theme.color.text.normal};
    font-size:${({ theme }) => theme.font.size.ml};
    font-weight: bold;
    margin: 20px 0;
`;

export const UL = styled.ul`
    list-style-type: circle;
    margin-left: 20px;
`;

export const LI = styled.li`
    font-family: ${({ theme }) => theme.font.family.primary};
    font-weight: ${({ theme }) => theme.font.weight.normal};
    font-style: ${({ theme }) => theme.font.style.normal};
    color: ${({ theme }) => theme.color.text.normal};
    font-size:${({ theme }) => theme.font.size.m};
    line-height: 1;
    margin: 5px 0;
`;

export const Button = styled.button`
    font-family: ${({ theme }) => theme.font.family.primary};
    background-color: ${({ theme }) => theme.backgroundColor.highlight};
    border: 1px solid ${({ theme }) => theme.backgroundColor.secondary};
    border-radius: 7px;
    color: ${({ theme }) => theme.backgroundColor.secondary};
    font-weight: ${({ theme }) => theme.font.weight.light};
    &:hover{
        cursor: pointer;    
    }
`;

export const FormErrorWhitespace = styled.div`
    height: 20px;
`;

export const FormErrorDetails = styled.div`
    height: 20px;
`;