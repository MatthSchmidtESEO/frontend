import React, { useState } from 'react';
import formContent from '../schema/form_schema.json';
import '../styles/form.css';

const Form = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        Manager: '',
        date: '',
        Sig: '',
        projectName: '',
        description: '',
        radioRole: '',
        checkboxes: {},
        radioQuestions: {}
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioQuestionChange = (questionKey, value) => {
        setFormData(prev => ({
            ...prev,
            radioQuestions: {
                ...prev.radioQuestions,
                [questionKey]: value
            }
        }));
    };

    const handleCheckboxChange = (section, id) => {
        setFormData(prev => ({
            ...prev,
            checkboxes: {
                ...prev.checkboxes,
                [section]: {
                    ...prev.checkboxes[section],
                    [id]: !prev.checkboxes?.[section]?.[id]
                }
            }
        }));
    };

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        formContent.fields.forEach(field => {
            if (!formData[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        formContent.fieldDescriptions.forEach(fieldDescriptions => {
            if (!formData[fieldDescriptions.name]?.trim()) {
                newErrors[fieldDescriptions.name] = `${fieldDescriptions.label} is required`;
            }
        });

        if (!formData.radioRole) {
            newErrors.radioRole = 'Please select a role';
        }

        formContent.checkboxes.forEach(section => {
            const isChecked = Object.values(formData.checkboxes[section.id] || {}).some(Boolean);
            if (!isChecked) {
                newErrors[section.id] = `Please select at least one option in ${section.label}`;
            }
        });

        Object.entries(formContent.radioQuestions).forEach(([key, question]) => {
            if (!formData.radioQuestions[key]) {
                newErrors.radioQuestions = `Please answer the question: ${question}`;
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        console.log('Form submitted successfully:', formData);
        alert(JSON.stringify(formData, null, 2));
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h1>{formContent.title}</h1>

            <h2>User Information</h2>
            {formContent.fields.map(field => (
                <div key={field.name}>
                    <label key={field.name}>
                        {field.label}
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={errors[field.name] ? 'input-error' : ''}
                        />
                    </label>
                    {errors[field.name] && <span className="error-text">{errors[field.name]}</span>}
                </div>
            ))}
            {formContent.fieldDescriptions.map(fieldDescriptions => (
                <div key={fieldDescriptions.name}>
                    <label key={fieldDescriptions.name}>
                        {fieldDescriptions.label}
                        <textarea
                            type={fieldDescriptions.type}
                            name={fieldDescriptions.name}
                            value={formData[fieldDescriptions.name]}
                            onChange={handleChange}
                            placeholder={fieldDescriptions.placeholder}
                            className={errors[fieldDescriptions.name] ? 'input-error' : ''}
                        />
                    </label>
                    {errors[fieldDescriptions.name] && <span className="error-text">{errors[fieldDescriptions.name]}</span>}
                </div>
            ))}

            <h2>Role</h2>
            {formContent.roles.map(role => (
                <label key={role.value}>
                    <input
                        type="radio"
                        name="radioRole"
                        value={role.value}
                        checked={formData.radioRole === role.value}
                        onChange={handleChange}
                    />
                    {role.label}
                </label>
            ))}
            {errors.radioRole && <span className="error-text">{errors.radioRole}</span>}

            <h2>Checkbox Sections</h2>
            {formContent.checkboxes.map(section => (
                <div key={section.id}>
                    <h3>{section.label}</h3>
                    {section.options.map(option => {
                        const id = `${section.id}-${option.id}`;
                        return (
                            <div key={option.id}>
                                <input
                                    id={id}
                                    type="checkbox"
                                    checked={formData.checkboxes?.[section.id]?.[option.id] || false}
                                    onChange={() => handleCheckboxChange(section.id, option.id)}
                                />
                                <label htmlFor={id}>{option.label}</label>
                            </div>
                        );
                    })}
                    {errors[section.id] && <span className="error-text">{errors[section.id]}</span>}
                </div>
            ))}

            <h2>Radio Questions</h2>
            {Object.entries(formContent.radioQuestions).map(([key, question]) => (
                <div key={key} className="radio-container">
                    <p>{question}</p>
                    <label>
                        <input
                            type="radio"
                            name={key}
                            value="yes"
                            checked={formData.radioQuestions[key] === 'yes'}
                            onChange={() => handleRadioQuestionChange(key, 'yes')}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={key}
                            value="no"
                            checked={formData.radioQuestions[key] === 'no'}
                            onChange={() => handleRadioQuestionChange(key, 'no')}
                        />
                        No
                    </label>
                    {errors.radioQuestions && <span className="error-text">{errors.radioQuestions}</span>}
                </div>
            ))}

            <input className="submit-button" type="submit" value="Submit" />
        </form>
    );
};

export default Form;
