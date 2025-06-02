import React from "react";

interface FormStepProps {
  title: string;
  description?: string;
  isOptional?: boolean;
  children: React.ReactNode;
}

export function FormStep({ title, description, isOptional = false, children }: FormStepProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {isOptional && (
            <span className="text-sm text-blue-100/70 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              Opcjonalnie
            </span>
          )}
        </div>
        {description && <p className="text-blue-100/80">{description}</p>}
      </div>
      <div className="text-white">{children}</div>
    </div>
  );
}
