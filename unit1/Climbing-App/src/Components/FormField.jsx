import React from "react";

function FormField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
  children,
}) {
  const fieldName = name ?? id;

  return (
    <>
      <label htmlFor={id}>{label}</label>
      {children ? (
        <select
          id={id}
          name={fieldName}
          value={value}
          onChange={onChange}
          required={required}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={fieldName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
      <br />
    </>
  );
}

export default FormField;
