import React, { useState, useRef } from 'react';
import '../styles/Settings.css';

const CATEGORY_OPTIONS = [
  'General', 'Security', 'Notifications', 'Appearance'
];

const mockSettings = [
  {
    _id: '1',
    settingName: 'Company Name',
    value: 'HRMS Inc.',
    description: 'The name of your company',
    category: 'General'
  },
  {
    _id: '2',
    settingName: 'Two-Factor Authentication',
    value: 'Enabled',
    description: 'Enable two-factor authentication for enhanced security',
    category: 'Security'
  }
];

const Settings = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    settingName: '',
    value: '',
    description: '',
    category: 'General'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const formRef = useRef();

  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.settingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || setting.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const isFormValid = () => {
    return (
      formData.settingName &&
      formData.value &&
      formData.description &&
      formData.category
    );
  };

  return (
    <div className="settings-page">
      
      <div className="settings-table-container">
        <table className="settings-table">
          <thead>
            <tr>
              <th>Setting Name</th>
              <th>Value</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSettings.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center' }}>No settings found.</td></tr>
            ) : (
              filteredSettings.map((setting) => (
                <tr key={setting._id}>
                  <td>{setting.settingName}</td>
                  <td>{setting.value}</td>
                  <td>{setting.description}</td>
                  <td>
                    <div className="action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setActionMenuOpen(setting._id === actionMenuOpen ? null : setting._id);
                        }}
                      >
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </button>
                      {actionMenuOpen === setting._id && (
                        <div className="action-dropdown-menu">
                          <div className="action-dropdown-item">Edit</div>
                          <div className="action-dropdown-item delete">Delete</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container" ref={formRef}>
            <div className="modal-header">
              <span>{editId ? 'Edit Setting' : 'Add Setting'}</span>
              <button className="modal-close" onClick={() => { setShowForm(false); setEditId(null); }}>×</button>
            </div>
            <form className="modal-form">
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Setting Name<span>*</span></label>
                  <input
                    type="text"
                    name="settingName"
                    placeholder="Setting Name"
                    value={formData.settingName}
                    onChange={e => setFormData({ ...formData, settingName: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Value<span>*</span></label>
                  <input
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Description<span>*</span></label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-form-group">
                  <label>Category<span>*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="modal-save-btn"
                disabled={!isFormValid()}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 