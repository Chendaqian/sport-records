import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import useSiteMetadata from '@/hooks/useSiteMetadata';
import styles from './style.module.css';

const Layout = ({ children }: React.PropsWithChildren) => {
  const { siteTitle, description } = useSiteMetadata();

  return (
    <>
      <Helmet bodyAttributes={{ class: styles.body }}>
        <html lang="en" />
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="running" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Helmet>
      <Header />
      <div className="pt-4 pr-4 pl-4 lg:flex lg:pt-4 lg:pr-4 lg:pl-4">
        {children}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
