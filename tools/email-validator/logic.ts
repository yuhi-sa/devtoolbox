export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  localPart: string;
  domain: string;
  tld: string;
  errors: string[];
}

export function validateEmail(email: string): EmailValidationResult {
  const errors: string[] = [];
  const trimmed = email.trim();

  if (!trimmed) {
    return {
      email: trimmed,
      isValid: false,
      localPart: "",
      domain: "",
      tld: "",
      errors: ["Email is empty"],
    };
  }

  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1) {
    return {
      email: trimmed,
      isValid: false,
      localPart: trimmed,
      domain: "",
      tld: "",
      errors: ["Missing @ symbol"],
    };
  }

  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  // Local part validation
  if (!localPart) {
    errors.push("Local part is empty");
  } else if (localPart.length > 64) {
    errors.push("Local part exceeds 64 characters");
  } else if (localPart.startsWith(".") || localPart.endsWith(".")) {
    errors.push("Local part cannot start or end with a dot");
  } else if (localPart.includes("..")) {
    errors.push("Local part cannot contain consecutive dots");
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
    errors.push("Local part contains invalid characters");
  }

  // Domain validation
  if (!domain) {
    errors.push("Domain is empty");
  } else if (domain.length > 253) {
    errors.push("Domain exceeds 253 characters");
  } else if (domain.startsWith("-") || domain.endsWith("-")) {
    errors.push("Domain cannot start or end with a hyphen");
  } else if (domain.startsWith(".") || domain.endsWith(".")) {
    errors.push("Domain cannot start or end with a dot");
  } else if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
    errors.push("Domain contains invalid characters");
  } else {
    const domainParts = domain.split(".");
    if (domainParts.length < 2) {
      errors.push("Domain must have at least two parts");
    }
    for (const part of domainParts) {
      if (part.length === 0) {
        errors.push("Domain contains empty label");
        break;
      }
      if (part.length > 63) {
        errors.push("Domain label exceeds 63 characters");
        break;
      }
    }
  }

  // TLD extraction
  const domainParts = domain.split(".");
  const tld = domainParts.length >= 2 ? domainParts[domainParts.length - 1] : "";

  if (tld && tld.length < 2) {
    errors.push("TLD must be at least 2 characters");
  }
  if (tld && /^\d+$/.test(tld)) {
    errors.push("TLD cannot be all numbers");
  }

  return {
    email: trimmed,
    isValid: errors.length === 0,
    localPart,
    domain,
    tld,
    errors,
  };
}

export function validateEmails(emails: string[]): EmailValidationResult[] {
  return emails.filter((e) => e.trim()).map((e) => validateEmail(e));
}
