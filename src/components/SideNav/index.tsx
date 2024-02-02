import React, { useState } from 'react';
import { Container, NavigationContent, NavigationItems, LogoContainer, NavigationItem } from './styles.css';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as Dashboard } from '../../assets/dashboard.svg';
import { ReactComponent as Pipeline } from '../../assets/pipeline.svg';
import { ReactComponent as Engagement } from '../../assets/engagement.svg';
import { ReactComponent as Ringbell } from '../../assets/ringbell-mini.svg';

import config from '../../config';
interface Props extends React.HTMLProps<HTMLElement> {
    companyData: FixMe;
    active: string;
    setActive(active: string): void;
    companyLogo: string;
    viewMode: number;
}

function SideNav(props: Props) {
    console.log('here1', props.companyData);

    const cc_token: any = localStorage.getItem('cc_token');
    let _cc_token = null;
    if (cc_token !== null) {
        _cc_token = JSON.parse(cc_token);
    }

    const navigation = [
        {
            slug: 'dashboard',
            title: 'Dashboard',
            icon: <Dashboard />,
        },
        {
            slug: 'engagement',
            title: 'Queue',
            icon: <Engagement />,
        },
        {
            slug: 'pipeline',
            title: 'Tracker',
            icon: <Pipeline />,
        },
        {
            slug: 'notifications',
            title: 'Company',
            icon: <Ringbell />,
        },
    ];

    const handleActive = (e: any) => {
        e.preventDefault();
        props.setActive(e.currentTarget.id);
    };

    return (
        <Container>
            <NavigationContent>
                <LogoContainer>
                    {(_cc_token !== null && _cc_token.type == 'Internal' && props.viewMode == 0) ? 
                    (
                        <a target="_blank" href={config.cc_admin_url + `/organizations/` + props.companyData.org_key}>
                            <img src={props.companyLogo} alt="company-logo" />
                        </a>
                    ) : (
                        <img src={props.companyLogo} alt="company-logo" />
                    )}
                </LogoContainer>

                <NavigationItems>
                    {navigation.map((item, index) => (
                        <NavigationItem
                            key={index}
                            id={item.slug}
                            isActive={props.active === item.slug}
                            onClick={handleActive}
                        >
                            <Link
                                to={
                                    item.slug === 'dashboard'
                                        ? '/'
                                        : `/${item.slug}/${
                                              props.companyData !== undefined ? props.companyData.org_key : null
                                          }`
                                }
                                onClick={() => console.log(props.companyData)}
                            >
                                {item.icon} {item.title}
                            </Link>
                        </NavigationItem>
                    ))}
                </NavigationItems>
            </NavigationContent>
        </Container>
    );
}

export default SideNav;
