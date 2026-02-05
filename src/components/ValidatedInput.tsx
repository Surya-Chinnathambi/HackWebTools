import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    success?: string;
    validate?: (value: string) => string | undefined;
    required?: boolean;
}

export const ValidatedInput = ({
    label,
    error: externalError,
    success,
    validate,
    required,
    className,
    onChange,
    ...props
}: ValidatedInputProps) => {
    const [internalError, setInternalError] = useState<string | undefined>();
    const [touched, setTouched] = useState(false);

    const error = externalError || internalError;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(true);
        if (validate) {
            const validationError = validate(e.target.value);
            setInternalError(validationError);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (touched && validate) {
            const validationError = validate(e.target.value);
            setInternalError(validationError);
        }
        onChange?.(e);
    };

    return (
        <div className="space-y-sm">
            <Label htmlFor={props.id} className="flex items-center gap-xs">
                {label}
                {required && <span className="text-red-600">*</span>}
            </Label>
            <div className="relative">
                <Input
                    {...props}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                        className,
                        error && "border-red-600 focus-visible:ring-red-600",
                        success && !error && "border-green-600 focus-visible:ring-green-600"
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${props.id}-error` : undefined}
                />
                {touched && (
                    <div className="absolute right-md top-1/2 -translate-y-1/2 pointer-events-none">
                        {error && <AlertCircle className="h-4 w-4 text-red-600" />}
                        {success && !error && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                )}
            </div>
            {error && touched && (
                <p id={`${props.id}-error`} className="text-xs text-red-600 flex items-center gap-xs">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}
            {success && !error && touched && (
                <p className="text-xs text-green-600 flex items-center gap-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    {success}
                </p>
            )}
        </div>
    );
};

export default ValidatedInput;
