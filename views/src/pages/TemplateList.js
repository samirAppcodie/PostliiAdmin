import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [groupedTemplates, setGroupedTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryPages, setCategoryPages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templatesPerPage = 8;
  const navigate = useNavigate();

  const fetchTemplates = async (keepCategory = null) => {
    try {
      const res = await fetch(`https://admin.postlii.com/api/templates`);
      const data = await res.json();
      setTemplates(data);

      const grouped = data.reduce((acc, t) => {
        const cat = (t.categoryName || 'Uncategorized').toUpperCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
      }, {});
      setGroupedTemplates(grouped);

      const pages = Object.keys(grouped).reduce((p, cat) => ({ ...p, [cat]: 1 }), {});
      setCategoryPages(pages);
      setSelectedCategory(keepCategory && grouped[keepCategory] ? keepCategory : Object.keys(grouped)[0] || '');
      setSelectedTemplates({});
      setSelectAll(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSelectTemplate = (id) => setSelectedTemplates(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSelectAll = () => {
    const allSelected = !selectAll;
    const currentTemplates = (groupedTemplates[selectedCategory] || []);
    setSelectedTemplates(allSelected ? Object.fromEntries(currentTemplates.map(t => [t._id, true])) : {});
    setSelectAll(allSelected);
  };

  const handleDelete = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm(`Are you sure you want to delete ${ids.length} template(s)?`)) return;

    setLoading(true);
    try {
      await Promise.all(ids.map(id =>
        fetch(`https://admin.postlii.com/api/templates/${id}`, { method: 'DELETE' })
      ));
      toast.success(`${ids.length} template(s) deleted!`);
      fetchTemplates(selectedCategory);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredTemplates = () => {
    const search = searchText.toLowerCase().trim();
    if (!search) return groupedTemplates;
    const filtered = {};
    Object.keys(groupedTemplates).forEach(cat => {
      const catMatches = cat.toLowerCase().includes(search);
      const matched = groupedTemplates[cat].filter(t => t.name.toLowerCase().includes(search));
      if (catMatches || matched.length) filtered[cat] = catMatches ? groupedTemplates[cat] : matched;
    });
    return filtered;
  };

  return (
    <div style={{ padding: '1rem', background: ' linear-gradient(180deg, #1E1E2F, #4B4F7A)', minHeight: '100vh', color: '#fff' }}>
      <ToastContainer />
      <h2>🎨 Template List</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/add-template')}>+ Add Template</button>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.keys(filteredTemplates()).map(cat => (
          <button
            key={cat}
            style={{ background: selectedCategory === cat ? '#4B4F7A' : '#ccc', color: selectedCategory === cat ? '#fff' : '#000' }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} /> Select All
            </label>
            {Object.values(selectedTemplates).some(Boolean) && (
              <button onClick={() => handleDelete(Object.keys(selectedTemplates).filter(id => selectedTemplates[id]))}>
                Delete Selected ({Object.values(selectedTemplates).filter(Boolean).length})
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {(() => {
              const allTemplates = filteredTemplates()[selectedCategory] || [];
              const page = categoryPages[selectedCategory] || 1;
              const start = (page - 1) * templatesPerPage;
              return allTemplates.slice(start, start + templatesPerPage).map(t => (
                <div key={t._id} style={{ width: '250px', border: '1px solid #444', borderRadius: '6px', position: 'relative' }}>
                  <input
                    type="checkbox"
                    checked={!!selectedTemplates[t._id]}
                    onChange={() => handleSelectTemplate(t._id)}
                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                  />
                  <img src={`https://admin.postlii.com/${t.image}`} alt={t.name} style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setPreviewTemplate(t)} />
                  <div style={{ padding: '0.5rem' }}>
                    <h5>{t.name}</h5>
                    <button onClick={() => handleDelete([t._id])} style={{ background: '#DC2626', color: '#fff' }}>Delete</button>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Pagination */}
          {(() => {
            const total = filteredTemplates()[selectedCategory]?.length || 0;
            const totalPages = Math.ceil(total / templatesPerPage);
            const page = categoryPages[selectedCategory] || 1;
            if (totalPages <= 1) return null;
            return (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '4px' }}>
                <button disabled={page === 1} onClick={() => setCategoryPages(prev => ({ ...prev, [selectedCategory]: page - 1 }))}>Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} style={{ fontWeight: page === i + 1 ? 'bold' : 'normal' }} onClick={() => setCategoryPages(prev => ({ ...prev, [selectedCategory]: i + 1 }))}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setCategoryPages(prev => ({ ...prev, [selectedCategory]: page + 1 }))}>Next</button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h3>{previewTemplate.name}</h3>
            <img src={`https://admin.postlii.com/${previewTemplate.image}`} alt={previewTemplate.name} style={{ maxWidth: '500px', maxHeight: '400px' }} />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => setPreviewTemplate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
