import React from 'react';
import SchemeCard from './SchemeCard';
import { useTranslation } from 'react-i18next';

const SchemeList = ({ schemes = [] }) => {
  const { t } = useTranslation();

  if (!schemes || schemes.length === 0) {
    return (
      <div className="text-center p-4 opacity-70">
        {t('chat.noSchemes')}
      </div>
    );
  }

  return (
    <div className="scheme-list">
      {schemes.map((scheme, index) => (
        <SchemeCard key={scheme.id || index} scheme={scheme} />
      ))}
    </div>
  );
};

export default SchemeList;
