
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToolById } from "@/utils/toolsData";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ToolDetail = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  
  const tool = toolId ? getToolById(toolId) : undefined;

  useEffect(() => {
    if (!tool) {
      // If tool doesn't exist, redirect to tools page
      navigate("/tools", { replace: true });
    }
  }, [tool, navigate]);

  if (!tool) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Navigation */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-bold text-3xl border-none">{tool.name}</h1>
              {tool.githubUrl && (
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  <Github size={20} />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
            </div>
            <p className="text-muted-foreground">{tool.description}</p>
            
            <div className="flex items-center gap-2 mt-3">
              <Link
                to={`/tools?category=${tool.categoryId}`}
                className="text-sm text-primary hover:underline"
              >
                {tool.category}
              </Link>
              {tool.tags && tool.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {tool.githubUrl && (
            <Button asChild variant="outline" size="sm">
              <a
                href={tool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div className="flex flex-col gap-8">
          {/* Documentation */}
          {tool.documentation && (
            <section>
              <h2 className="text-2xl font-bold">Documentation</h2>
              <p>{tool.documentation}</p>
            </section>
          )}
          
          {/* Installation */}
          {tool.installation && (
            <section>
              <h2 className="text-2xl font-bold">Installation</h2>
              <CodeBlock 
                code={tool.installation} 
                title="Installation Command"
              />
            </section>
          )}
          
          {/* Usage */}
          {tool.usage && (
            <section>
              <h2 className="text-2xl font-bold">Usage</h2>
              <p>{tool.usage}</p>
            </section>
          )}
          
          {/* Examples */}
          {tool.examples && tool.examples.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Examples</h2>
              <div className="space-y-6">
                {tool.examples.map((example, index) => (
                  <CodeBlock
                    key={index}
                    code={example.code}
                    title={example.title}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-lg border p-4 bg-card">
            <h3 className="font-medium text-lg mb-3">Quick Links</h3>
            <nav className="flex flex-col space-y-1">
              <Link
                to={`/tools?category=${tool.categoryId}`}
                className="text-sm text-primary hover:underline py-1"
              >
                More {tool.category} Tools
              </Link>
              {tool.githubUrl && (
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline py-1 flex items-center"
                >
                  GitHub Repository
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
