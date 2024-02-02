import baseStyled, { ThemedStyledInterface } from 'styled-components';
import './fonts.css'

const colors = {
    grey: "#ebecf0",
    lightGrey: "#f5f5f8",
    lighterGrey: "#F7F5F9",
    darkGrey: "#343a40",
    ccBlue: "#0084d6",
    textNormal: "#333333",
    textLight: "#696E6F",
    darkBlue: "#001233",
    trueBlue: "#0466C8",
    night: "#212529",
    offWhite: "#f8f9fa",
}

const common = {
    font: {
        size: {
            s: '.5rem',
            m: '.8rem',
            ml: '1rem',
            l: '1.5rem',
            xl: '2rem'
        },
        family: {
            primary: 'Inter, sans-serif',
            secondary: 'Mulish, sans-serif'
        },
        weight: {
            light: 300,
            normal: 'normal',
            semiBold: 500,
            bold: 'bold',
            bolder: 'bolder',
        },
        style: {
            normal: 'normal',
            italic: 'italic',
        }
    },
    form: {
        error: 'red',
    },
    shadowReference: {
        card: '0 1px 0 rgba(9,30,66,.25)',
        sidebar: {
            light: `3px 2px 9px -5px ${colors.darkGrey}`,
            dark: `3px 2px 9px -5px ${colors.lightGrey}`,
        }
    }
}

const light = {
    color: {
        text: {
            light: colors.textLight,
            normal: colors.textNormal
        }
    },
    backgroundColor: {
        primary: colors.lightGrey,
        secondary: "white",
        tertiary: 'whitesmoke',
        bgPrimary : colors.lighterGrey,
        highlight: colors.ccBlue
    },
    sideBar: {
        boxShadow: common.shadowReference.sidebar.light
    },
    ...common
}

const dark = {
    color: {
        text: {
            light: colors.lightGrey,
            normal: colors.offWhite
        }
    },
    backgroundColor: {
        primary: colors.night,
        secondary: colors.darkGrey,
        tertiary: colors.textNormal,
        highlight: "#0077b6"
    },
    sideBar: {
        boxShadow: common.shadowReference.sidebar.dark
    },
    ...common
}

export const themes = {
    light: { ...light },
    dark: { ...dark }
};

export type Themes = typeof themes;
export const styled = baseStyled as ThemedStyledInterface<Themes>;