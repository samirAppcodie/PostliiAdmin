import React, { useState } from 'react';
import Categories from '../pages/CategoryList';
import TemplateList from '../pages/TemplateList';

const TemplateByCategory = () => {
  const [categoryId, setCategoryId] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h2>View Templates by Category</h2>
      <Categories setCategoryId={setCategoryId} />
      {categoryId && <TemplateList categoryId={categoryId} />}
    </div>
  );
};

export default TemplateByCategory;
