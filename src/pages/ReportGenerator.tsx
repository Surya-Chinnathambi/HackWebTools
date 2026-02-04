import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calculator, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Finding {
    id: string;
    title: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    description: string;
    impact: string;
    remediation: string;
    cvss: number;
}

const ReportGenerator = () => {
    const [projectName, setProjectName] = useState("");
    const [clientName, setClientName] = useState("");
    const [testerName, setTesterName] = useState("");
    const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [currentFinding, setCurrentFinding] = useState<Partial<Finding>>({
        severity: "medium",
    });

    // CVSS Calculator State
    const [cvssVector, setCvssVector] = useState({
        attackVector: "N",
        attackComplexity: "L",
        privilegesRequired: "N",
        userInteraction: "N",
        scope: "U",
        confidentiality: "H",
        integrity: "H",
        availability: "H",
    });

    const calculateCVSS = () => {
        // Simplified CVSS v3.1 calculation
        const { attackVector, attackComplexity, privilegesRequired, userInteraction, scope, confidentiality, integrity, availability } = cvssVector;

        // Base metrics weights
        const weights = {
            attackVector: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
            attackComplexity: { L: 0.77, H: 0.44 },
            privilegesRequired: { N: 0.85, L: scope === "C" ? 0.68 : 0.62, H: scope === "C" ? 0.5 : 0.27 },
            userInteraction: { N: 0.85, R: 0.62 },
            confidentiality: { H: 0.56, L: 0.22, N: 0 },
            integrity: { H: 0.56, L: 0.22, N: 0 },
            availability: { H: 0.56, L: 0.22, N: 0 },
        };

        const exploitability =
            8.22 *
            weights.attackVector[attackVector as keyof typeof weights.attackVector] *
            weights.attackComplexity[attackComplexity as keyof typeof weights.attackComplexity] *
            weights.privilegesRequired[privilegesRequired as keyof typeof weights.privilegesRequired] *
            weights.userInteraction[userInteraction as keyof typeof weights.userInteraction];

        const impact =
            1 -
            (1 - weights.confidentiality[confidentiality as keyof typeof weights.confidentiality]) *
            (1 - weights.integrity[integrity as keyof typeof weights.integrity]) *
            (1 - weights.availability[availability as keyof typeof weights.availability]);

        let baseScore;
        if (impact <= 0) {
            baseScore = 0;
        } else if (scope === "U") {
            baseScore = Math.min(exploitability + impact, 10);
        } else {
            baseScore = Math.min(1.08 * (exploitability + impact), 10);
        }

        return Math.round(baseScore * 10) / 10;
    };

    const getCVSSString = () => {
        return `CVSS:3.1/AV:${cvssVector.attackVector}/AC:${cvssVector.attackComplexity}/PR:${cvssVector.privilegesRequired}/UI:${cvssVector.userInteraction}/S:${cvssVector.scope}/C:${cvssVector.confidentiality}/I:${cvssVector.integrity}/A:${cvssVector.availability}`;
    };

    const addFinding = () => {
        if (!currentFinding.title || !currentFinding.description) {
            toast({
                title: "Error",
                description: "Please fill in title and description",
                variant: "destructive",
            });
            return;
        }

        const cvssScore = calculateCVSS();
        const newFinding: Finding = {
            id: Date.now().toString(),
            title: currentFinding.title || "",
            severity: currentFinding.severity as Finding["severity"],
            description: currentFinding.description || "",
            impact: currentFinding.impact || "",
            remediation: currentFinding.remediation || "",
            cvss: cvssScore,
        };

        setFindings([...findings, newFinding]);
        setCurrentFinding({ severity: "medium" });
        toast({ description: "Finding added successfully" });
    };

    const removeFinding = (id: string) => {
        setFindings(findings.filter((f) => f.id !== id));
        toast({ description: "Finding removed" });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "high":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "medium":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "low":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const generateHTMLReport = () => {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penetration Testing Report - ${projectName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.1em; opacity: 0.9; }
        .section { margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .section h2 { color: #667eea; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .info-card { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
        .info-card label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
        .finding { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .finding.critical { border-left-color: #dc2626; }
        .finding.high { border-left-color: #ea580c; }
        .finding.medium { border-left-color: #eab308; }
        .finding.low { border-left-color: #16a34a; }
        .finding.info { border-left-color: #3b82f6; }
        .finding h3 { color: #333; margin-bottom: 10px; font-size: 1.4em; }
        .severity-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; margin: 10px 0; }
        .severity-badge.critical { background: #dc2626; color: white; }
        .severity-badge.high { background: #ea580c; color: white; }
        .severity-badge.medium { background: #eab308; color: white; }
        .severity-badge.low { background: #16a34a; color: white; }
        .severity-badge.info { background: #3b82f6; color: white; }
        .cvss-score { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 5px; font-weight: bold; margin-left: 10px; }
        .finding-section { margin: 15px 0; }
        .finding-section h4 { color: #667eea; margin-bottom: 8px; font-size: 1.1em; }
        .finding-section p { color: #666; line-height: 1.8; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-card .number { font-size: 2.5em; font-weight: bold; color: #667eea; }
        .summary-card .label { color: #666; margin-top: 5px; }
        .footer { text-align: center; padding: 30px; color: #666; border-top: 2px solid #e5e5e5; margin-top: 40px; }
        @media print { body { background: white; } .container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Penetration Testing Report</h1>
            <p>${projectName}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div class="info-grid">
                <div class="info-card">
                    <label>Client Name</label>
                    <div>${clientName || "N/A"}</div>
                </div>
                <div class="info-card">
                    <label>Penetration Tester</label>
                    <div>${testerName || "N/A"}</div>
                </div>
                <div class="info-card">
                    <label>Test Date</label>
                    <div>${testDate}</div>
                </div>
                <div class="info-card">
                    <label>Total Findings</label>
                    <div>${findings.length}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Findings Summary</h2>
            <div class="summary">
                <div class="summary-card">
                    <div class="number" style="color: #dc2626;">${findings.filter((f) => f.severity === "critical").length}</div>
                    <div class="label">Critical</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #ea580c;">${findings.filter((f) => f.severity === "high").length}</div>
                    <div class="label">High</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #eab308;">${findings.filter((f) => f.severity === "medium").length}</div>
                    <div class="label">Medium</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #16a34a;">${findings.filter((f) => f.severity === "low").length}</div>
                    <div class="label">Low</div>
                </div>
                <div class="summary-card">
                    <div class="number" style="color: #3b82f6;">${findings.filter((f) => f.severity === "info").length}</div>
                    <div class="label">Info</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Detailed Findings</h2>
            ${findings
                .map(
                    (finding) => `
                <div class="finding ${finding.severity}">
                    <h3>${finding.title}</h3>
                    <span class="severity-badge ${finding.severity}">${finding.severity}</span>
                    <span class="cvss-score">CVSS: ${finding.cvss}</span>
                    
                    <div class="finding-section">
                        <h4>Description</h4>
                        <p>${finding.description || "No description provided"}</p>
                    </div>
                    
                    <div class="finding-section">
                        <h4>Impact</h4>
                        <p>${finding.impact || "No impact analysis provided"}</p>
                    </div>
                    
                    <div class="finding-section">
                        <h4>Remediation</h4>
                        <p>${finding.remediation || "No remediation steps provided"}</p>
                    </div>
                </div>
            `
                )
                .join("")}
        </div>

        <div class="footer">
            <p><strong>Generated by HackWebTools Report Generator</strong></p>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p style="margin-top: 10px; color: #999;">This report is confidential and intended for authorized personnel only.</p>
        </div>
    </div>
</body>
</html>
    `;

        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${projectName.replace(/\s+/g, "_")}_Report_${Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ description: "HTML report downloaded successfully!" });
    };

    const generateMarkdownReport = () => {
        const markdown = `# Penetration Testing Report: ${projectName}

## Executive Summary

**Client:** ${clientName || "N/A"}  
**Penetration Tester:** ${testerName || "N/A"}  
**Test Date:** ${testDate}  
**Total Findings:** ${findings.length}

---

## Findings Summary

| Severity | Count |
|----------|-------|
| Critical | ${findings.filter((f) => f.severity === "critical").length} |
| High     | ${findings.filter((f) => f.severity === "high").length} |
| Medium   | ${findings.filter((f) => f.severity === "medium").length} |
| Low      | ${findings.filter((f) => f.severity === "low").length} |
| Info     | ${findings.filter((f) => f.severity === "info").length} |

---

## Detailed Findings

${findings
                .map(
                    (finding, index) => `
### ${index + 1}. ${finding.title}

**Severity:** ${finding.severity.toUpperCase()}  
**CVSS Score:** ${finding.cvss}

#### Description
${finding.description || "No description provided"}

#### Impact
${finding.impact || "No impact analysis provided"}

#### Remediation
${finding.remediation || "No remediation steps provided"}

---
`
                )
                .join("\n")}

## Report Metadata

- **Generated By:** HackWebTools Report Generator
- **Generated On:** ${new Date().toLocaleString()}
- **Report Type:** Penetration Testing Assessment

---

*This report is confidential and intended for authorized personnel only.*
`;

        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${projectName.replace(/\s+/g, "_")}_Report.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ description: "Markdown report downloaded successfully!" });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                    <FileText className="w-8 h-8" />
                    Report Generator
                </h1>
                <p className="text-muted-foreground">
                    Create professional penetration testing reports with CVSS scoring
                </p>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">Project Info</TabsTrigger>
                    <TabsTrigger value="findings">Findings</TabsTrigger>
                    <TabsTrigger value="cvss">CVSS Calculator</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                {/* Project Info Tab */}
                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                            <CardDescription>Enter basic information about the penetration test</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="projectName">Project Name *</Label>
                                    <Input
                                        id="projectName"
                                        placeholder="Web Application Penetration Test"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="clientName">Client Name</Label>
                                    <Input
                                        id="clientName"
                                        placeholder="Acme Corporation"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="testerName">Penetration Tester</Label>
                                    <Input
                                        id="testerName"
                                        placeholder="Your Name"
                                        value={testerName}
                                        onChange={(e) => setTesterName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="testDate">Test Date</Label>
                                    <Input
                                        id="testDate"
                                        type="date"
                                        value={testDate}
                                        onChange={(e) => setTestDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-4">Current Findings Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <div className="text-3xl font-bold text-red-500">
                                            {findings.filter((f) => f.severity === "critical").length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Critical</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                                        <div className="text-3xl font-bold text-orange-500">
                                            {findings.filter((f) => f.severity === "high").length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">High</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                        <div className="text-3xl font-bold text-yellow-500">
                                            {findings.filter((f) => f.severity === "medium").length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Medium</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="text-3xl font-bold text-green-500">
                                            {findings.filter((f) => f.severity === "low").length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Low</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                        <div className="text-3xl font-bold text-blue-500">
                                            {findings.filter((f) => f.severity === "info").length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Info</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Findings Tab */}
                <TabsContent value="findings">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Finding</CardTitle>
                                <CardDescription>Document a security finding</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Finding Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="SQL Injection in Login Form"
                                        value={currentFinding.title || ""}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="severity">Severity</Label>
                                    <Select
                                        value={currentFinding.severity}
                                        onValueChange={(value) => setCurrentFinding({ ...currentFinding, severity: value as Finding["severity"] })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="critical">Critical</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="info">Info</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Detailed description of the vulnerability..."
                                        value={currentFinding.description || ""}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="impact">Impact</Label>
                                    <Textarea
                                        id="impact"
                                        placeholder="What is the potential impact of this vulnerability?"
                                        value={currentFinding.impact || ""}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, impact: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="remediation">Remediation</Label>
                                    <Textarea
                                        id="remediation"
                                        placeholder="How can this vulnerability be fixed?"
                                        value={currentFinding.remediation || ""}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, remediation: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <Button onClick={addFinding} className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Finding
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Findings List ({findings.length})</CardTitle>
                                <CardDescription>Review and manage documented findings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {findings.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">
                                        No findings added yet. Add your first finding using the form.
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {findings.map((finding) => (
                                            <div key={finding.id} className="border rounded-lg p-4 bg-muted/50">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{finding.title}</h4>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Badge className={getSeverityColor(finding.severity)}>
                                                                {finding.severity}
                                                            </Badge>
                                                            <Badge variant="outline">CVSS: {finding.cvss}</Badge>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeFinding(finding.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                    {finding.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CVSS Calculator Tab */}
                <TabsContent value="cvss">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="w-5 h-5" />
                                CVSS v3.1 Score Calculator
                            </CardTitle>
                            <CardDescription>
                                Calculate Common Vulnerability Scoring System scores
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Attack Vector (AV)</Label>
                                    <Select value={cvssVector.attackVector} onValueChange={(v) => setCvssVector({ ...cvssVector, attackVector: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="N">Network (N)</SelectItem>
                                            <SelectItem value="A">Adjacent (A)</SelectItem>
                                            <SelectItem value="L">Local (L)</SelectItem>
                                            <SelectItem value="P">Physical (P)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Attack Complexity (AC)</Label>
                                    <Select value={cvssVector.attackComplexity} onValueChange={(v) => setCvssVector({ ...cvssVector, attackComplexity: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="H">High (H)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Privileges Required (PR)</Label>
                                    <Select value={cvssVector.privilegesRequired} onValueChange={(v) => setCvssVector({ ...cvssVector, privilegesRequired: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="N">None (N)</SelectItem>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="H">High (H)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>User Interaction (UI)</Label>
                                    <Select value={cvssVector.userInteraction} onValueChange={(v) => setCvssVector({ ...cvssVector, userInteraction: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="N">None (N)</SelectItem>
                                            <SelectItem value="R">Required (R)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Scope (S)</Label>
                                    <Select value={cvssVector.scope} onValueChange={(v) => setCvssVector({ ...cvssVector, scope: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="U">Unchanged (U)</SelectItem>
                                            <SelectItem value="C">Changed (C)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Confidentiality Impact (C)</Label>
                                    <Select value={cvssVector.confidentiality} onValueChange={(v) => setCvssVector({ ...cvssVector, confidentiality: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H">High (H)</SelectItem>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="N">None (N)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Integrity Impact (I)</Label>
                                    <Select value={cvssVector.integrity} onValueChange={(v) => setCvssVector({ ...cvssVector, integrity: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H">High (H)</SelectItem>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="N">None (N)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Availability Impact (A)</Label>
                                    <Select value={cvssVector.availability} onValueChange={(v) => setCvssVector({ ...cvssVector, availability: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="H">High (H)</SelectItem>
                                            <SelectItem value="L">Low (L)</SelectItem>
                                            <SelectItem value="N">None (N)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                                <div className="text-sm text-muted-foreground mb-2">CVSS v3.1 Score</div>
                                <div className="text-6xl font-bold text-primary mb-2">{calculateCVSS()}</div>
                                <div className="text-sm font-mono text-muted-foreground bg-background/50 p-2 rounded">
                                    {getCVSSString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Export Tab */}
                <TabsContent value="export">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Report</CardTitle>
                            <CardDescription>
                                Generate and download your penetration testing report
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Project:</span>
                                    <span className="font-semibold">{projectName || "Not set"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Findings:</span>
                                    <span className="font-semibold">{findings.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Report Date:</span>
                                    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={generateHTMLReport}
                                    disabled={!projectName || findings.length === 0}
                                    className="h-auto py-4"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    <div className="text-left">
                                        <div className="font-semibold">Export as HTML</div>
                                        <div className="text-xs opacity-80">Professional styled report</div>
                                    </div>
                                </Button>

                                <Button
                                    onClick={generateMarkdownReport}
                                    disabled={!projectName || findings.length === 0}
                                    variant="outline"
                                    className="h-auto py-4"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    <div className="text-left">
                                        <div className="font-semibold">Export as Markdown</div>
                                        <div className="text-xs opacity-80">Plain text format</div>
                                    </div>
                                </Button>
                            </div>

                            {(!projectName || findings.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center">
                                    Please add project information and at least one finding to export a report.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ReportGenerator;
