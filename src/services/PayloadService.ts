
import { Payload, PayloadCategory, PayloadSeverity } from "@/types/payload";
import { mockPayloads, mockPayloadCategories } from "@/data/mockPayloads";

// Helper function to ensure severity is a valid PayloadSeverity type
function validateSeverity(severity: string): PayloadSeverity {
  const validSeverities: PayloadSeverity[] = ["low", "medium", "high", "critical"];
  if (validSeverities.includes(severity as PayloadSeverity)) {
    return severity as PayloadSeverity;
  }
  // Default to medium if invalid
  return "medium";
}

// Mapping of file names to categories
const categoryMapping: Record<string, string> = {
  'SQL.txt': 'SQL Injection',
  'all_attacks.txt': 'All Attacks',
  'allsqli.txt': 'SQL Injection',
  'blindsqli.txt': 'Blind SQL Injection',
  'xss.txt': 'Cross-Site Scripting',
  'api.txt': 'API Exploits',
  'cgi-bin.txt': 'CGI Exploits',
  'apac.txt': 'Apache Exploits',
  'aspx.txt': 'ASP.NET Exploits',
  'bambda.txt': 'Lambda Exploits',
  // Add more mappings as needed
};

// Function to determine severity based on content and filename
function determineSeverity(content: string, filename: string): PayloadSeverity {
  const contentLower = content.toLowerCase();
  const filenameLower = filename.toLowerCase();
  
  if (
    contentLower.includes("critical") || 
    filenameLower.includes("critical") ||
    contentLower.includes("rce") || 
    filenameLower.includes("rce") ||
    contentLower.includes("remote code execution")
  ) {
    return "critical";
  } else if (
    contentLower.includes("high") || 
    filenameLower.includes("high") ||
    contentLower.includes("injection") ||
    contentLower.includes("bypass authentication")
  ) {
    return "high";
  } else if (
    contentLower.includes("low") || 
    filenameLower.includes("low") ||
    contentLower.includes("minor")
  ) {
    return "low";
  }
  
  return "medium";
}

// Function to extract tags from content and filename
function extractTags(content: string, filename: string, category: string): string[] {
  const contentLower = content.toLowerCase();
  const tags: string[] = [];
  
  // Add category as a tag
  tags.push(category.toLowerCase().replace(/\s+/g, '-'));
  
  // Add additional tags based on content
  if (contentLower.includes("xss")) tags.push("xss");
  if (contentLower.includes("sql")) tags.push("sql");
  if (contentLower.includes("injection")) tags.push("injection");
  if (contentLower.includes("bypass")) tags.push("bypass");
  if (contentLower.includes("authentication")) tags.push("authentication");
  if (contentLower.includes("traversal")) tags.push("traversal");
  
  // Add filename-based tags
  const baseFilename = filename.replace(/\.txt$/i, '').toLowerCase();
  if (!tags.includes(baseFilename) && baseFilename.length < 20) {
    tags.push(baseFilename);
  }
  
  // Ensure we have at least one additional tag
  if (tags.length === 1) {
    tags.push("security");
    tags.push("testing");
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

// Function to get a list of available local payload files
async function getLocalPayloadFiles(): Promise<string[]> {
  try {
    const response = await fetch('/assets/payloads/index.json');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch payloads index, falling back to predefined list');
      // Return a known list of files that should be available
      return [
        'SQL.txt', 'all_attacks.txt', 'allsqli.txt', 'blindsqli.txt',
        'cgi-bin.txt', 'api.txt', 'apac.txt', 'aspx.txt', 'bambda.txt'
      ];
    }
  } catch (error) {
    console.error('Error loading payloads index:', error);
    // Fallback list
    return [
      'SQL.txt', 'all_attacks.txt', 'allsqli.txt', 'blindsqli.txt',
      'cgi-bin.txt', 'api.txt', 'apac.txt', 'aspx.txt', 'bambda.txt'
    ];
  }
}

// Function to load a payload file content from assets
async function loadPayloadContent(filename: string): Promise<string> {
  try {
    const response = await fetch(`/assets/payloads/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load payload file: ${filename}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading payload file ${filename}:`, error);
    return `Error loading payload: ${filename}`;
  }
}

export const fetchPayloads = async (): Promise<Payload[]> => {
  try {
    const files = await getLocalPayloadFiles();
    
    const payloads: Payload[] = await Promise.all(
      files.map(async (filename) => {
        const content = await loadPayloadContent(filename);
        
        // Extract a reasonable payload name from the filename
        const name = filename
          .replace(/\.txt$/i, '')
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Determine category from mapping or default
        const category = categoryMapping[filename] || 'General Payloads';
        
        // Generate a random ID for the payload
        const id = Math.random().toString(36).substring(2, 15);
        
        // Determine severity
        const severity = determineSeverity(content, filename);
        
        // Extract tags
        const tags = extractTags(content, filename, category);
        
        return {
          id,
          name,
          content,
          description: `${name} payload for security testing.`,
          category,
          categoryId: category.toLowerCase().replace(/\s+/g, '-'),
          path: `assets/payloads/${filename}`,
          severity,
          tags
        };
      })
    );
    
    return payloads;
  } catch (error) {
    console.error("Failed to fetch local payloads, falling back to mock data:", error);
    
    // Fallback to mock data if local fetch fails
    const validatedPayloads = mockPayloads.map(payload => ({
      ...payload,
      severity: validateSeverity(payload.severity)
    }));
    
    return validatedPayloads;
  }
};

export const fetchPayloadCategories = async (): Promise<PayloadCategory[]> => {
  try {
    const payloads = await fetchPayloads();
    
    // Group payloads by category
    const categoriesMap = new Map<string, PayloadCategory>();
    
    payloads.forEach(payload => {
      const categoryId = payload.categoryId;
      
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: payload.category,
          count: 1,
          description: `Collection of ${payload.category} payloads for security testing`
        });
      } else {
        const category = categoriesMap.get(categoryId)!;
        category.count += 1;
      }
    });
    
    return Array.from(categoriesMap.values());
  } catch (error) {
    console.error("Failed to generate categories from payloads, falling back to mock data:", error);
    return mockPayloadCategories;
  }
};

export const fetchPayloadsByCategory = async (categoryId: string): Promise<Payload[]> => {
  try {
    const allPayloads = await fetchPayloads();
    return allPayloads.filter(payload => payload.categoryId === categoryId);
  } catch (error) {
    console.error("Failed to filter payloads by category, falling back to mock data:", error);
    
    const filteredPayloads = mockPayloads
      .filter(payload => payload.categoryId === categoryId)
      .map(payload => ({
        ...payload,
        severity: validateSeverity(payload.severity)
      }));
      
    return filteredPayloads;
  }
};
