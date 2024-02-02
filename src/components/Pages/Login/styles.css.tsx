import styled from 'styled-components';
import {Field, Form} from 'formik'

/*
   NOTE: Login does not receive props from Theme Provider because it is outside of the App
*/

interface IFormInput{
   error: boolean;
}

export const Container = styled.div`
 min-height: 100vh;
 width: 100%;
 padding: 44px;
 background: #2662A3;
 position: relative;
 overflow: hidden;
 display: flex;
 flex-direction: column;

 .bars{
    position: absolute;
    bottom: 0;
 }

 .bar-1{
   left: 63%;
   bottom: -80px;
 }

 .bar-2{
   left: calc(63% + 72px);
   bottom: -130px;
 }

 .bar-3{
   left: calc(63% + 144px);
   bottom: -100px;
 }

 .bar-4{
   left: calc(63% + 216px);
 }

 .bar-5{
   left: calc(63% + 288px);
   bottom: -80px;
 }

 .shape-1{
    position: absolute;
    top: 0;
    right: 0;
    max-height: 853px;
    z-index: 0;
 }
 .shape-2{
   position: absolute;
   bottom: 0;
   left: 0px;
   z-index: 0;

}

.shape-3{
   position: absolute;
   bottom: 0;
   left: 0;
   z-index: 0;
}
`

export const HeaderContainer = styled.div`
   width: 100%;
   z-index: 10;
`

export const FormsContainer = styled.div`
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   flex:1;
`

export const LoginContent = styled.div`
    width: 480px;
    z-index: 10;
 > form {
    display: flex;
    flex-direction: column;

 }
`

export const Header = styled.div`
   text-align: center;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-bottom: 100px;
   gap: 39px;

   h2{
      font-family: ${({theme}) => theme.font.family.secondary};
      font-size: 36px;
      font-weight: 400;
      color: #FFFFFF;
   }

   p{
      font-family: ${({theme}) => theme.font.family.secondary};
      font-size: 24px;
      font-weight: 400;
      color: #FFFFFF;
      letter-spacing: 0.2px;
     
      svg{
         height: 28px;
         width: 114px;
      }
   }
`

export const Description = styled.p`
   font-family: ${({theme}) => theme.font.family.secondary};
   color: #fff;
   font-size: 18px;
   font-weight: 400;
   margin: 24px 0;
   line-height: 1.25;
`

export const Paragraph = styled.p`
   font-family: helvetica;
   font-size: .8rem;
   margin: 5px 0;
`

export const StyledForm = styled(Form)`

`

export const StyledField = styled(Field)<IFormInput>`
   border: 1.5px ${({error}) => error ? "#e74c3c" : "#97ACC3"} solid;
   border-radius: 8px;
   padding: 15px 28px;
   
   background: none;
   margin-bottom: 12px;
   font-family: ${({theme}) => theme.font.family.secondary};
   font-size: 18px;
   font-weight: 400;
   outline: none;
   color: white;

   transition: .4s all ease-in-out;

   &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: ${({error}) => error ? "#e74c3c" : "#97ACC3"};
      opacity: 1; /* Firefox */
   }

   &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: ${({error}) => error ? "#e74c3c" : "#97ACC3"};
   }

   &::-ms-input-placeholder { /* Microsoft Edge */
      color: ${({error}) => error ? "#e74c3c" : "#97ACC3"};
   }

   &:focus{
      border-color: #FFF;
      transition: .4s all ease-in-out;
   }

`

export const FormErrorWhitespace = styled.div`
`
export const FormErrorDetails = styled.div`
   font-family: helvetica;
   font-size: .8rem;
   color: firebrick;
   margin: 3px 0;
   line-height: 1.2;
`

export const Submit = styled.button`
   margin-top: 10px;
   margin-bottom: 12px;
   background: #FFFFFF;
   border-radius: 8px;
   padding: 18px 0;
   text-transform: uppercase;
   outline: none;
   cursor: pointer;

   color: #3A82D0;
   font-weight: 500;
   font-family: ${({theme}) => theme.font.family.secondary};
   font-size: 18px;
   border: 2px #FFFFFF solid; 

   transition: .4s all ease-in-out;


   &:hover{
      background: transparent;
      color: #ffffff;
      transition: .4s all ease-in-out;
   }
`;

export const Sublink = styled.div`
   text-align: right;
   > a {
      color: #fff;
      font-family: ${({theme}) => theme.font.family.secondary};
      font-size: 18px;
      font-weight: 400;
      &:hover{
         cursor: pointer;
         text-decoration: underline;
      }
   }
`;