import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
 ${reset}
 
   @font-face {
      font-family: 'Montserrat';
      src: url('fonts/Montserrat-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
   }
   
   @font-face {
      font-family: 'Montserrat';
      src: url('fonts/Montserrat-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Montserrat';
      src: url('fonts/Montserrat-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Montserrat';
      src: url('fonts/Montserrat-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Montserrat';
      src: url('fonts/Montserrat-Black.ttf') format('truetype');
      font-weight: bolder;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Mulish';
      src: url('fonts/Mulish/static/Mulish-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
   }
   
   @font-face {
      font-family: 'Mulish';
      src: url('fonts/Mulish/static/Mulish-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Mulish';
      src: url('fonts/Mulish/static/Mulish-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Mulish';
      src: url('fonts/Mulish/static/Mulish-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
   }

   @font-face {
      font-family: 'Mulish';
      src: url('fonts/Mulish/static/Montserrat-Black.ttf') format('truetype');
      font-weight: bolder;
      font-style: normal;
      font-display: swap;
   }

 div#root {
    height: 100vh;
 }
 *{
   box-sizing: border-box;
 }
 .add-new-member-form .MuiFormControl-marginNormal {
   margin-top: 0;
    margin-bottom: 0;
 }
 .swal-footer {
   text-align: center;
   }

 .MuiTooltip-popper .MuiTooltip-tooltip {
   text-align: center;
   padding: 5px 10px;
   margin-top: 3px;
   font-family: "Mulish", sans-serif;
   font-size: 16px;
   font-weight: 400;
   border: 1px #E7D0F1 solid;
   background: #FFFFFF;
   border-radius: 4px;
   color: black;
 }
`;
