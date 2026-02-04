
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToolById } from "@/utils/toolsData";
import { ArrowLeft, ExternalLink, Github, BookOpen, Terminal, AlertCircle, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-red-600" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{tool.documentation}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Features */}
          <Card className="border-2 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Key Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tool.name === "Nmap" && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">▸</span>
                      <span>Host discovery and network mapping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">▸</span>
                      <span>Port scanning and service version detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">▸</span>
                      <span>Operating system detection and fingerprinting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">▸</span>
                      <span>NSE scripting engine for vulnerability detection</span>
                    </li>
                  </>
                )}
                {tool.name !== "Nmap" && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">▸</span>
                    <span>Professional-grade security testing capabilities</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Installation */}
          {tool.installation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-red-600" />
                  Installation
                </CardTitle>
                <CardDescription>Quick setup guide for your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock
                  code={tool.installation}
                  title="Linux/Debian"
                />
                {tool.name === "Nmap" && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Alternative Installation Methods:</p>
                    <CodeBlock code="brew install nmap" title="macOS (Homebrew)" />
                    <CodeBlock code="winget install Nmap.Nmap" title="Windows (winget)" />
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        For Windows, download the installer from{" "}
                        <a href="https://nmap.org/download.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">
                          nmap.org/download.html
                        </a>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Usage */}
          {tool.usage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                  Usage Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{tool.usage}</p>
              </CardContent>
            </Card>
          )}

          {/* Examples */}
          {tool.examples && tool.examples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Practical Examples</CardTitle>
                <CardDescription>Common use cases and commands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tool.examples.map((example, index) => (
                    <CodeBlock
                      key={index}
                      code={example.code}
                      title={`${index + 1}. ${example.title}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Best Practices */}
          <Alert className="border-2 border-amber-500/50 bg-amber-950/20">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="space-y-2">
              <p className="font-semibold text-amber-600">Security & Legal Notice</p>
              <p className="text-sm">
                Always obtain proper authorization before conducting security assessments. Unauthorized scanning or penetration testing is illegal and unethical. Use these tools only on systems you own or have explicit permission to test.
              </p>
            </AlertDescription>
          </Alert>

          {/* Additional Resources */}
          {tool.name === "Nmap" && (
            <Card className="bg-gradient-to-br from-red-950/10 to-orange-950/10">
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="https://nmap.org/book/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Official Nmap Network Scanning Book
                    </a>
                  </li>
                  <li>
                    <a href="https://nmap.org/nsedoc/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      NSE Script Documentation
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/results?search_query=nmap+tutorial" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Video Tutorials on YouTube
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-3">
                <Link
                  to={`/tools?category=${tool.categoryId}`}
                  className="text-sm hover:text-red-600 transition-colors py-1 flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  More {tool.category} Tools
                </Link>
                {tool.githubUrl && (
                  <a
                    href={tool.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-red-600 transition-colors py-1 flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repository
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </a>
                )}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(tool.name + ' security tool tutorial')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-red-600 transition-colors py-1 flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Find Tutorials
                  <ExternalLink className="ml-auto h-3 w-3" />
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* Tool Stats/Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tool Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge variant="outline">{tool.category}</Badge>
              </div>
              {tool.tags && tool.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
