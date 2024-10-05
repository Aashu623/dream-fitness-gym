// app/components/InputField.tsx
import React from "react";

interface InputFieldProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    options?: string[]; // for select options
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    options,
}) => {
    return (
        <div className="space-y-2">
            <label className="block text-white font-medium">{label}</label>
            {type === "select" ? (
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
                    value={value}
                    onChange={onChange}
                    required={required}
                >
                    {options?.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-white outline-none focus:ring-2 focus:ring-orange-500"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
};

export default InputField;
