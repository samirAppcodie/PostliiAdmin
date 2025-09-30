
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // for navigation

// const TemplateList = () => {
//   const [templates, setTemplates] = useState([]);
//   const [groupedTemplates, setGroupedTemplates] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [searchText, setSearchText] = useState('');

//   const fetchTemplates = async () => {
//   try {
//     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
//     if (!res.ok) throw new Error('Failed to load templates');
//     const data = await res.json();

//     const grouped = data.reduce((acc, template) => {
//       const categoryName = (template.categoryName || 'Uncategorized').toUpperCase();
//       if (!acc[categoryName]) acc[categoryName] = [];
//       acc[categoryName].push(template);
//       return acc;
//     }, {});

//     setTemplates(data);
//     setGroupedTemplates(grouped);
//   } catch (error) {
//     console.error('Error fetching templates:', error);
//   }
// };

// useEffect(() => {
//   fetchTemplates();
// }, []);




  
//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm('Are you sure you want to delete this template?');
//   if (!confirmDelete) return;

//   setLoading(true); // Start loader only after confirmation

//   try {
//     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates/${id}`, {
//       method: 'DELETE',
//     });

//     if (!res.ok) throw new Error('Failed to delete template');

//     await fetchTemplates(); // Refresh the template list
//   } catch (error) {
//     console.error('Error deleting template:', error);
//   } finally {
//     setLoading(false); // Always stop loader
//   }
// };

//   const getFilteredTemplates = () => {
//   if (!searchText.trim()) return groupedTemplates;

//   const filtered = {};

//   Object.keys(groupedTemplates).forEach((category) => {
//     const matched = groupedTemplates[category].filter((template) =>
//       template.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//     if (matched.length > 0) {
//       filtered[category] = matched;
//     }
//   });

//   return filtered;
// };


// return (
//   <div className="p-4" >
//         <div className="add-member-container d-flex justify-content-between align-items-center mb-2">
//     <button onClick={() => navigate('/add-template')} style={{ 
//        background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',// Solid background color
//     color: '#fff',
//     border: 'none',
//     padding: '10px 20px',
//     fontWeight: '600',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '16px',
//     boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//     transition: 'all 0.3s ease' }}>
//       + Add Template
//     </button>

//     <div className="search-container position-relative">
//     <i className="fa fa-search search-icon" />
//     <input
//       type="text"
//       placeholder="Search by Template Name..."
//       value={searchText}
//       onChange={(e) => setSearchText(e.target.value)}
//       className="form-control search-input ps-5"
//     />
//   </div>
//   </div>

    

//     <h2 style={{ paddingTop: '30px',color:'black' }}>Template List</h2>

//     {loading && <p style={{ color: 'white' }}>Loading...</p>}

//     {Object.keys(getFilteredTemplates()).map((category) => (

//       <div key={category} className="mb-4" style={{ paddingTop: '50px' }}>
//         <h4 style={{fontWeight:'bold'}}>{category.toUpperCase()}</h4>
//         <div className="d-flex flex-wrap gap-3">
//           {getFilteredTemplates()[category].map((template) => (

//             <div key={template._id} className="card" style={{ width: '360px', border: '1px solid #ddd' }}>
//               <img
//                 src={`${process.env.REACT_APP_API_URL}/${template.image}`}
//                 alt={template.name}
//                 className="card-img-top"
//                 style={{ height: '250px', objectFit: 'cover' }}
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{template.name}</h5>
//                 <button
//                   onClick={() => handleDelete(template._id)}
//                   style={{
//                     backgroundColor: '#DC2626',
//                     color: '#fff',
//                     border: 'none',
//                     padding: '0.4rem 0.7rem',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     marginTop: '10px',
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
// );

// };

// export default TemplateList;






// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const TemplateList = () => {
//   const [templates, setTemplates] = useState([]);
//   const [groupedTemplates, setGroupedTemplates] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [categoryPages, setCategoryPages] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const templatesPerPage = 8;
//   const navigate = useNavigate();

//   const fetchTemplates = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
//       const data = await res.json();
//       setTemplates(data);

//       const grouped = data.reduce((acc, template) => {
//         const categoryName = (template.categoryName || 'Uncategorized').toUpperCase();
//         if (!acc[categoryName]) acc[categoryName] = [];
//         acc[categoryName].push(template);
//         return acc;
//       }, {});
//       setGroupedTemplates(grouped);

//       const initialPages = {};
//       Object.keys(grouped).forEach(cat => {
//         initialPages[cat] = 1;
//       });
//       setCategoryPages(initialPages);
//       setSelectedCategory(Object.keys(grouped)[0] || '');
//     } catch (error) {
//       console.error('Failed to fetch templates', error);
//     }
//   };

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this template?');
//     if (!confirmDelete) return;

//     setLoading(true);

//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates/${id}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error('Failed to delete template');

//       await fetchTemplates(); // Refresh after deletion
//        toast.success('Template deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting template:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//  const getFilteredTemplates = () => {
//   const search = searchText.toLowerCase().trim();

//   if (!search) return groupedTemplates;

//   const filtered = {};

//   Object.keys(groupedTemplates).forEach((category) => {
//     const categoryMatches = category.toLowerCase().includes(search);

//     const matchedTemplates = groupedTemplates[category].filter((template) =>
//       template.name.toLowerCase().includes(search)
//     );

//     if (categoryMatches || matchedTemplates.length > 0) {
//       filtered[category] = categoryMatches
//         ? groupedTemplates[category] // show all if category matches
//         : matchedTemplates; // else only matched templates
//     }
//   });

//   return filtered;
// };


//   return (
//     <div className="p-4">
//         <h2
//   style={{
//     // paddingTop: '10px',
//     paddingBottom: '10px',
//     color: '#333',
//     fontSize: '28px',
//     fontWeight: '700',
//   }}
// >
//   🎨  Template List
// </h2>
//       <ToastContainer position="top-right" autoClose={2500} />
      

//       <div className="add-member-container d-flex justify-content-between align-items-center mb-2">
//         <button
//           onClick={() => navigate('/add-template')}
//           style={{
//             background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
//             color: '#fff',
//             border: 'none',
//             padding: '10px 20px',
//             fontWeight: '600',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontSize: '16px',
//             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//             transition: 'all 0.3s ease',
//           }}
//         >
//           + Add Template
//         </button>

       

//         <div className="search-container position-relative">
//           <i className="fa fa-search search-icon" />
//           <input
//             type="text"
//             placeholder="Search by Template Name  and Category ........."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             className="form-control search-input ps-5"
//           />
//         </div>
//       </div>

//      {/* <h2
//   style={{
//     paddingTop: '20px',
//     paddingBottom: '20px',
//     color: '#333',
//     fontSize: '26px',
//     fontWeight: '600',
//   }}
// >
//   🎨  Template List
// </h2> */}



//       {loading && <p style={{ color: 'white' }}>Loading...</p>}

//       {/* Category Tabs */}
//       <div className="mb-4 d-flex gap-2 flex-wrap">
//      {Object.keys(getFilteredTemplates()).map((cat) => {
//   const isSelected = selectedCategory === cat;

//   return (
//     <button
//       key={cat}
//       onClick={() => setSelectedCategory(cat)}
//       style={{
//         background: isSelected ? 'linear-gradient(180deg, #5f7cdb, #589ebe)' : '#f5f5f5',
//         color: isSelected ? '#fff' : '#000',
//         border: '1px solid #ccc',
//         padding: '8px 16px',
//         borderRadius: '6px',
//         fontWeight: '500',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease',
//       }}
//       // onMouseEnter={(e) => {
//       //   e.target.style.background = 'linear-gradient(180deg, #5f7cdb, #589ebe)';
//       //   e.target.style.color = 'white';
//       // }}
//       onMouseLeave={(e) => {
//         if (isSelected) {
//           e.target.style.background = 'linear-gradient(180deg, #5f7cdb, #589ebe)';
//           e.target.style.color = '#ffffff';
//         } else {
//           e.target.style.background = '#f5f5f5';
//           e.target.style.color = '#000000';
//         }
//       }}
//     >
//       {cat}
//     </button>
//   );
// })}

//       </div>

//       {/* Template Cards for Selected Category */}
//       {selectedCategory && (
//         <div className="mb-5">
//           {/* <h4 style={{ fontWeight: 'bold' }}>{selectedCategory.toUpperCase()}</h4> */}

//           <div className="d-flex flex-wrap gap-3">
//             {(() => {
//               const allTemplates = getFilteredTemplates()[selectedCategory] || [];
//               const currentPage = categoryPages[selectedCategory] || 1;
//               const startIndex = (currentPage - 1) * templatesPerPage;
//               const currentTemplates = allTemplates.slice(startIndex, startIndex + templatesPerPage);

//               return currentTemplates.map((template) => (
//                 <div
//                   key={template._id}
//                   className="card"
//                   style={{ width: '360px', border: '1px solid #ddd' }}
//                 >
//                   <img
//                     src={`${process.env.REACT_APP_API_URL}/${template.image}`}
//                     alt={template.name}
//                     className="card-img-top"
//                     style={{ height: '250px', objectFit: 'cover' }}
//                   />
//                   <div className="card-body">
//                     <h5 className="card-title">{template.name}</h5>
//                     <button
//                       onClick={() => handleDelete(template._id)}
//                       style={{
//                         backgroundColor: '#DC2626',
//                         color: '#fff',
//                         border: 'none',
//                         padding: '0.4rem 0.7rem',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         marginTop: '10px',
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ));
//             })()}
//           </div>

//           {/* Pagination */}
//           {(() => {
//             const totalTemplates = getFilteredTemplates()[selectedCategory]?.length || 0;
//             const totalPages = Math.ceil(totalTemplates / templatesPerPage);
//             const currentPage = categoryPages[selectedCategory] || 1;

//             return totalPages > 1 ? (
//               <div className="pagination">
//                 <button
//                   // className="btn btn-outline-secondary"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setCategoryPages((prev) => ({
//                       ...prev,
//                       [selectedCategory]: currentPage - 1,
//                     }))
//                   }
//                 >
//                   &laquo; Prev
//                 </button>

//                 {[...Array(totalPages)].map((_, idx) => (
//                   <button
//                     key={idx + 1}
//                     className={`btn ${currentPage === idx + 1 ? "active" : ""}`}
//                     onClick={() =>
//                       setCategoryPages((prev) => ({
//                         ...prev,
//                         [selectedCategory]: idx + 1,
//                       }))
//                     }
//                   >
//                     {idx + 1}
//                   </button>
//                 ))}

//                 <button
//                   // className="btn btn-outline-secondary"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCategoryPages((prev) => ({
//                       ...prev,
//                       [selectedCategory]: currentPage + 1,
//                     }))
//                   }
//                 >
//                   Next &raquo;
//                 </button>
//               </div>
//             ) : null;
//           })()}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateList;




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
  const templatesPerPage = 8;
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates`);
      const data = await res.json();
      setTemplates(data);

      const grouped = data.reduce((acc, template) => {
        const categoryName = (template.categoryName || 'Uncategorized').toUpperCase();
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(template);
        return acc;
      }, {});
      setGroupedTemplates(grouped);

      const initialPages = {};
      Object.keys(grouped).forEach(cat => {
        initialPages[cat] = 1;
      });
      setCategoryPages(initialPages);
      setSelectedCategory(Object.keys(grouped)[0] || '');
    } catch (error) {
      console.error('Failed to fetch templates', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    toast(
      ({ closeToast }) => (
        <div style={{
               maxWidth: '720px',
  margin: '0 auto',
  backgroundColor: '#fff',
  padding: '27px 5px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
        }}>
          <p style={{ fontWeight: '500', color: '#333', marginBottom: '16px',textAlign:'center' }}>
            ⚠️ Are you sure you want to delete this template?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={async () => {
                closeToast();
                setLoading(true);
                try {
                  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/templates/${id}`, {
                    method: 'DELETE',
                  });
                  if (!res.ok) throw new Error('Failed to delete template');
                  await fetchTemplates();
                  toast.success('Template deleted successfully!');
                } catch (error) {
                  console.error('Error deleting template:', error);
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              style={{
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        icon:false,
         style: {
      background: 'transparent', // Optional: to blend seamlessly
      boxShadow: 'none',         // Optional
    },

      }
    );
  };

  const getFilteredTemplates = () => {
    const search = searchText.toLowerCase().trim();
    if (!search) return groupedTemplates;

    const filtered = {};
    Object.keys(groupedTemplates).forEach((category) => {
      const categoryMatches = category.toLowerCase().includes(search);
      const matchedTemplates = groupedTemplates[category].filter((template) =>
        template.name.toLowerCase().includes(search)
      );
      if (categoryMatches || matchedTemplates.length > 0) {
        filtered[category] = categoryMatches
          ? groupedTemplates[category]
          : matchedTemplates;
      }
    });
    return filtered;
  };

  return (
    <div className="p-4">
      <h2 style={{
        paddingBottom: '10px',
        color: '#333',
        fontSize: '28px',
        fontWeight: '700',
      }}>
        🎨 Template List
      </h2>

      <ToastContainer position="top-right" autoClose={2500} />

      <div className="add-member-container d-flex justify-content-between align-items-center mb-2">
        <button
          onClick={() => navigate('/add-template')}
          style={{
            background: 'linear-gradient(180deg, #5f7cdb, #589ebe)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          + Add Template
        </button>

        <div className="search-container position-relative">
          <i className="fa fa-search search-icon" />
          <input
            type="text"
            placeholder="Search by Template Name and Category ........."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="form-control search-input ps-5"
          />
        </div>
      </div>

      {loading && <p style={{ color: 'white' }}>Loading...</p>}

      <div className="mb-4 d-flex gap-2 flex-wrap">
        {Object.keys(getFilteredTemplates()).map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: isSelected ? 'linear-gradient(180deg, #5f7cdb, #589ebe)' : '#f5f5f5',
                color: isSelected ? '#fff' : '#000',
                border: '1px solid #ccc',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseLeave={(e) => {
                if (isSelected) {
                  e.target.style.background = 'linear-gradient(180deg, #5f7cdb, #589ebe)';
                  e.target.style.color = '#ffffff';
                } else {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.color = '#000000';
                }
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="mb-5">
          <div className="d-flex flex-wrap gap-3">
            {(() => {
              const allTemplates = getFilteredTemplates()[selectedCategory] || [];
              const currentPage = categoryPages[selectedCategory] || 1;
              const startIndex = (currentPage - 1) * templatesPerPage;
              const currentTemplates = allTemplates.slice(startIndex, startIndex + templatesPerPage);

              return currentTemplates.map((template) => (
                <div
                  key={template._id}
                  className="card"
                  style={{ width: '360px', border: '1px solid #ddd' }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${template.image}`}
                    alt={template.name}
                    className="card-img-top"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{template.name}</h5>
                    <button
                      onClick={() => handleDelete(template._id)}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>

          {/* Pagination */}
          {(() => {
            const totalTemplates = getFilteredTemplates()[selectedCategory]?.length || 0;
            const totalPages = Math.ceil(totalTemplates / templatesPerPage);
            const currentPage = categoryPages[selectedCategory] || 1;

            return totalPages > 1 ? (
              <div className="pagination mt-3 d-flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCategoryPages((prev) => ({
                      ...prev,
                      [selectedCategory]: currentPage - 1,
                    }))
                  }
                >
                  &laquo; Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    className={`btn ${currentPage === idx + 1 ? "active" : ""}`}
                    onClick={() =>
                      setCategoryPages((prev) => ({
                        ...prev,
                        [selectedCategory]: idx + 1,
                      }))
                    }
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCategoryPages((prev) => ({
                      ...prev,
                      [selectedCategory]: currentPage + 1,
                    }))
                  }
                >
                  Next &raquo;
                </button>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
