import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface FormStepProps {
  title: string;
  description?: string;
  isOptional?: boolean;
  children: React.ReactNode;
}

export function FormStep({ title, description, isOptional = false, children }: FormStepProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {isOptional && (
            <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">Opcjonalnie</span>
          )}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
