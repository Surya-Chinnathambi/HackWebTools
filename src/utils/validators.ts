// Common validation functions
export const validators = {
    required: (value: string) => {
        return value.trim() === "" ? "This field is required" : undefined;
    },

    ip: (value: string) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

        if (!value.trim()) return "IP address is required";

        if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
            return "Please enter a valid IP address";
        }

        // Additional IPv4 validation
        if (ipv4Regex.test(value)) {
            const octets = value.split(".").map(Number);
            if (octets.some(octet => octet < 0 || octet > 255)) {
                return "IP address octets must be between 0 and 255";
            }
        }

        return undefined;
    },

    domain: (value: string) => {
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

        if (!value.trim()) return "Domain is required";

        if (!domainRegex.test(value)) {
            return "Please enter a valid domain name";
        }

        return undefined;
    },

    url: (value: string) => {
        try {
            new URL(value);
            return undefined;
        } catch {
            return "Please enter a valid URL";
        }
    },

    port: (value: string) => {
        const port = parseInt(value, 10);

        if (!value.trim()) return "Port number is required";

        if (isNaN(port)) {
            return "Port must be a number";
        }

        if (port < 1 || port > 65535) {
            return "Port must be between 1 and 65535";
        }

        return undefined;
    },

    portRange: (value: string) => {
        const rangeRegex = /^(\d+)-(\d+)$/;
        const match = value.match(rangeRegex);

        if (!value.trim()) return "Port range is required";

        if (!match) {
            return "Format: start-end (e.g., 1-1000)";
        }

        const [, start, end] = match;
        const startPort = parseInt(start, 10);
        const endPort = parseInt(end, 10);

        if (startPort < 1 || endPort > 65535) {
            return "Ports must be between 1 and 65535";
        }

        if (startPort >= endPort) {
            return "Start port must be less than end port";
        }

        return undefined;
    },

    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value.trim()) return "Email is required";

        if (!emailRegex.test(value)) {
            return "Please enter a valid email address";
        }

        return undefined;
    },

    minLength: (min: number) => (value: string) => {
        if (value.length < min) {
            return `Must be at least ${min} characters`;
        }
        return undefined;
    },

    maxLength: (max: number) => (value: string) => {
        if (value.length > max) {
            return `Must be no more than ${max} characters`;
        }
        return undefined;
    },

    pattern: (regex: RegExp, message: string) => (value: string) => {
        if (!regex.test(value)) {
            return message;
        }
        return undefined;
    },

    combine: (...validators: Array<(value: string) => string | undefined>) => {
        return (value: string) => {
            for (const validator of validators) {
                const error = validator(value);
                if (error) return error;
            }
            return undefined;
        };
    },
};

export default validators;
