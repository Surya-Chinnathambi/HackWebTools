
export const formatPayloadContent = (content: string): string => {
  // Trim extra whitespace and normalize line endings
  return content.trim().replace(/\r\n/g, '\n');
};

export const extractDescriptionFromContent = (content: string, name: string): string => {
  // Try to find a description at the beginning of the content
  const firstLines = content.split('\n').slice(0, 5).join(' ');
  
  if (firstLines.toLowerCase().includes('description') || 
      firstLines.toLowerCase().includes('info') ||
      firstLines.toLowerCase().includes('about')) {
    return firstLines.substring(0, 150) + '...';
  }
  
  // Fall back to a generic description
  return `${name} payload for security testing and penetration testing purposes.`;
};

export const categorizePayload = (filePath: string, content: string): string => {
  const path = filePath.toLowerCase();
  const text = content.toLowerCase();
  
  if (path.includes('xss') || text.includes('script') && text.includes('alert')) {
    return 'Cross-Site Scripting (XSS)';
  }
  
  if (path.includes('sql') || text.includes('select') && text.includes('from')) {
    return 'SQL Injection';
  }
  
  if (path.includes('command') || text.includes('exec') || text.includes('system(')) {
    return 'Command Injection';
  }
  
  if (path.includes('csrf')) {
    return 'Cross-Site Request Forgery (CSRF)';
  }
  
  if (path.includes('traversal') || path.includes('lfi') || text.includes('../')) {
    return 'Directory Traversal';
  }
  
  if (path.includes('xxe') || text.includes('<!entity') || text.includes('<!DOCTYPE')) {
    return 'XML External Entity (XXE)';
  }
  
  if (path.includes('ssrf')) {
    return 'Server-Side Request Forgery (SSRF)';
  }
  
  // Default category if no specific match
  return 'General Payload';
};
