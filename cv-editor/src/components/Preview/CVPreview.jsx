import React from 'react';
import '../../styles/cv-print.css';
import { Mail, Globe, GraduationCap, Plus, Trash2, Printer, ArrowUp, ArrowDown } from 'lucide-react';
import { EditableText } from '../UI/EditableText';

export const CVPreview = ({ data, setData, config }) => {
    // Helper to update state
    const updateData = (section, newValue) => {
        setData(prev => ({ ...prev, [section]: newValue }));
    };

    const updatePersonal = (field, value) => {
        setData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }));
    };

    const updateAddress = (field, value) => {
        setData(prev => ({
            ...prev,
            personal: { ...prev.personal, address: { ...prev.personal.address, [field]: value } }
        }));
    };

    // Array helpers
    const updateItem = (section, index, field, value) => {
        const list = [...data[section]];
        list[index] = { ...list[index], [field]: value };
        updateData(section, list);
    };

    const addItem = (section, template) => {
        const list = [...data[section]];
        updateData(section, [template, ...list]);
    };

    const moveItem = (section, index, direction) => {
        const list = [...data[section]];
        if (direction === 'up' && index > 0) {
            [list[index], list[index - 1]] = [list[index - 1], list[index]];
        } else if (direction === 'down' && index < list.length - 1) {
            [list[index], list[index + 1]] = [list[index + 1], list[index]];
        }
        updateData(section, list);
    };

    const removeItem = (section, index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const list = [...data[section]];
            list.splice(index, 1);
            updateData(section, list);
        }
    };

    // Special case for Education Details (Nested)
    const updateEduDetail = (eduIndex, detailIndex, field, value) => {
        const list = [...data.education];
        list[eduIndex].details[detailIndex][field] = value;
        updateData('education', list);
    };

    // Helper component for action buttons
    const ActionOverlay = ({ section, index, isFirst, isLast }) => (
        <div className="action-overlay no-print">
            <div className="action-col" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button onClick={() => removeItem(section, index)} title="Delete"><Trash2 size={14} /></button>
                {!isFirst && <button onClick={() => moveItem(section, index, 'up')} title="Move Up"><ArrowUp size={14} /></button>}
                {!isLast && <button onClick={() => moveItem(section, index, 'down')} title="Move Down"><ArrowDown size={14} /></button>}
            </div>
        </div>
    );

    return (
        <div className={`cv-root header-${config.headerAlign} divider-${config.divider}`}>

            {/* Floating Action Buttons for Print/Save */}
            <div className="no-print floating-actions">
                <button className="btn-fab" onClick={() => window.print()} title="Save as PDF">
                    <Printer size={24} />
                </button>
            </div>

            <div className="cv-paper">
                <h2 className="bio-title">Curriculum Vitae</h2>

                <div className="name">
                    <h1>
                        <EditableText
                            value={data.personal.name}
                            onSave={(val) => updatePersonal('name', val)}
                            placeholder="Your Name"
                        />
                    </h1>
                    <div className="institute">
                        <EditableText
                            value={data.personal.institute}
                            onSave={(val) => updatePersonal('institute', val)}
                            placeholder="Institute Name"
                        />
                    </div>

                    <div className="contact">
                        <div>
                            <GraduationCap size={16} />
                            <EditableText
                                value={data.personal.scholarLink}
                                onSave={(val) => updatePersonal('scholarLink', val)}
                                placeholder="Google Scholar"
                                html={true}
                            />
                        </div>
                        <div>
                            <Mail size={16} />
                            <EditableText
                                value={data.personal.email}
                                onSave={(val) => updatePersonal('email', val)}
                                placeholder="Email Address"
                            />
                        </div>
                        <div>
                            <Globe size={16} />
                            <EditableText
                                value={data.personal.website}
                                onSave={(val) => updatePersonal('website', val)}
                                placeholder="Website URL"
                                html={true}
                            />
                        </div>
                    </div>
                </div>

                <section className="summary">
                    <h2>Summary</h2>
                    <p className="summry-text">
                        <EditableText
                            value={data.summary}
                            onSave={(val) => updateData('summary', val)}
                            multiline={true}
                            html={true}
                        />
                    </p>
                </section>

                <section className="personal">
                    <p><span className="bold">Permanent address:</span>
                        <EditableText value={data.personal.address.permanent} onSave={(v) => updateAddress('permanent', v)} />
                    </p>
                    <p><span className="bold">Date of birth:</span>
                        <EditableText value={data.personal.address.dob} onSave={(v) => updateAddress('dob', v)} />
                    </p>
                    <p><span className="bold">Institution’s address:</span>
                        <EditableText value={data.personal.address.official} onSave={(v) => updateAddress('official', v)} />
                    </p>
                </section>

                <section className="education relative-section">
                    <h2>Research Experience</h2>
                    {data.experience.map((exp, idx) => (
                        <div className="wrapper group relative" key={exp.id || idx}>
                            <ActionOverlay section="experience" index={idx} isFirst={idx === 0} isLast={idx === data.experience.length - 1} />
                            <div className="left">
                                <EditableText value={exp.period} onSave={(v) => updateItem('experience', idx, 'period', v)} />
                            </div>
                            <div className="right">
                                <div className="degree">
                                    <EditableText value={exp.role} onSave={(v) => updateItem('experience', idx, 'role', v)} />
                                </div>
                                <div className="place">
                                    <EditableText value={exp.institution} onSave={(v) => updateItem('experience', idx, 'institution', v)} />
                                </div>
                                <div className="percentage">
                                    <EditableText value={exp.supervisor} onSave={(v) => updateItem('experience', idx, 'supervisor', v)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="add-btn-container no-print">
                        <button onClick={() => addItem('experience', { id: Date.now(), period: 'Date', role: 'Role', institution: 'Inst', supervisor: 'Sup' })}>
                            <Plus size={14} /> Add Experience
                        </button>
                    </div>
                </section>

                <section className="education relative-section">
                    <h2>Education</h2>
                    {data.education.map((edu, idx) => (
                        <div className="wrapper group relative" key={edu.id || idx}>
                            <ActionOverlay section="education" index={idx} isFirst={idx === 0} isLast={idx === data.education.length - 1} />
                            <div className="left">
                                <EditableText value={edu.period} onSave={(v) => updateItem('education', idx, 'period', v)} />
                            </div>
                            <div className="right">
                                <div className="degree">
                                    <EditableText value={edu.degree} onSave={(v) => updateItem('education', idx, 'degree', v)} />
                                </div>
                                <div className="place">
                                    <EditableText value={edu.institution} onSave={(v) => updateItem('education', idx, 'institution', v)} />
                                </div>
                                {edu.details && edu.details.map((detail, dIdx) => (
                                    <div className="percentage" key={dIdx}>
                                        <span className="bold">
                                            <EditableText value={detail.label} onSave={(v) => updateEduDetail(idx, dIdx, 'label', v)} />:
                                        </span>{' '}
                                        <EditableText value={detail.value} onSave={(v) => updateEduDetail(idx, dIdx, 'value', v)} html={detail.isHtml} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="add-btn-container no-print">
                        <button onClick={() => addItem('education', { id: Date.now(), period: 'Year', degree: 'Degree', institution: 'Inst', details: [] })}>
                            <Plus size={14} /> Add Education
                        </button>
                    </div>
                </section>

                <section className="education relative-section">
                    <h2>Skills</h2>
                    {data.skills.map((skill, idx) => (
                        <div className="wrapper group relative" key={idx}>
                            <ActionOverlay section="skills" index={idx} isFirst={idx === 0} isLast={idx === data.skills.length - 1} />
                            <div className="left">
                                <EditableText value={skill.category} onSave={(v) => updateItem('skills', idx, 'category', v)} />
                            </div>
                            <div className="right">
                                <div className="place">
                                    <EditableText value={skill.items} onSave={(v) => updateItem('skills', idx, 'items', v)} multiline />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="add-btn-container no-print">
                        <button onClick={() => addItem('skills', { category: 'Category', items: 'Items' })}>
                            <Plus size={14} /> Add Skill
                        </button>
                    </div>
                </section>

                <section className="awards relative-section">
                    <h2>Awards</h2>
                    {data.awards.map((award, idx) => (
                        <div className="wrapper group relative" key={idx}>
                            <ActionOverlay section="awards" index={idx} isFirst={idx === 0} isLast={idx === data.awards.length - 1} />
                            <div className="left">
                                <EditableText value={award.date} onSave={(v) => updateItem('awards', idx, 'date', v)} />
                            </div>
                            <div className="right">
                                <div className="place">
                                    <EditableText value={award.description} onSave={(v) => updateItem('awards', idx, 'description', v)} multiline />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="add-btn-container no-print">
                        <button onClick={() => addItem('awards', { date: 'Date', description: 'Description' })}>
                            <Plus size={14} /> Add Award
                        </button>
                    </div>
                </section>

                <section className="publications relative-section">
                    <h2>Publications</h2>
                    {data.publications.map((pub, idx) => (
                        <div className="publication group relative" key={pub.id || idx}>
                            <ActionOverlay section="publications" index={idx} isFirst={idx === 0} isLast={idx === data.publications.length - 1} />
                            <div className="flex-pub">
                                <EditableText value={pub.content} onSave={(v) => updateItem('publications', idx, 'content', v)} html={true} />
                            </div>
                        </div>
                    ))}
                    <div className="add-btn-container no-print">
                        <button onClick={() => addItem('publications', { id: Date.now(), content: 'New Publication', link: '#' })}>
                            <Plus size={14} /> Add Publication
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};
