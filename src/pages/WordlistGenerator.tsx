import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Download, Plus, Shuffle, FileText, Copy, Check, Zap, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

const WordlistGenerator = () => {
    const [baseWords, setBaseWords] = useState("");
    const [customWords, setCustomWords] = useState("");
    const [generatedWordlist, setGeneratedWordlist] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [realtimeEnabled, setRealtimeEnabled] = useState(true);
    const [minLength, setMinLength] = useState(3);
    const [maxLength, setMaxLength] = useState(20);

    // Mutation options
    const [mutations, setMutations] = useState({
        uppercase: true,
        lowercase: true,
        capitalize: true,
        leetspeak: true,
        numbers: true,
        specialChars: true,
        reverse: false,
        duplicate: false,
        randomCase: false,
        prefixNumbers: true,
        suffixNumbers: true,
        yearVariations: true,
    });

    // OSINT-based generation
    const [osintData, setOsintData] = useState({
        companyName: "",
        location: "",
        year: "",
        keywords: "",
    });

    // Common password patterns
    const commonPatterns = [
        "password", "admin", "root", "user", "test", "demo", "welcome", "login",
        "pass", "default", "guest", "master", "super", "system", "manager",
    ];

    const numberSuffixes = ["1", "12", "123", "1234", "12345", "123456", "!", "@", "#", "0", "00", "000"];
    const yearSuffixes = ["20", "21", "22", "23", "24", "25", "26", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
    const commonSuffixes = ["!", "@", "#", "$", "%", "^", "&", "*", "!!", "123!", "@123", "#123"];
    const separators = ["", "_", "-", ".", "@", "#"];

    // Enhanced Leet speak conversions with multiple variations
    const leetMap: { [key: string]: string[] } = {
        a: ["4", "@", "^", "/-\\"],
        e: ["3", "€", "&"],
        i: ["1", "!", "|", "l"],
        o: ["0", "()", "[]"],
        s: ["5", "$", "z"],
        t: ["7", "+", "†"],
        l: ["1", "|", "!"],
        g: ["9", "&"],
        b: ["8", "|3", "ß"],
        c: ["(", "<", "{"],
        d: ["|)", "|>"],
        h: ["#", "|-|"],
        k: ["|<", "|{"],
        n: ["|\\|", "/\\/"],
        u: ["|_|", "(_)"],
        v: ["\\/"],
        w: ["\\/\\/", "\\|/"],
        x: ["><", ")("],
        z: ["2", "7_"],
    };

    // Comprehensive word mutation function
    const applyLeetSpeak = (word: string): string[] => {
        const variations: string[] = [];
        let current = word.toLowerCase();

        // Single character replacements
        Object.keys(leetMap).forEach((char) => {
            if (current.includes(char)) {
                leetMap[char].forEach((replacement) => {
                    variations.push(current.replace(new RegExp(char, "g"), replacement));
                    // Also try replacing just first occurrence
                    variations.push(current.replace(char, replacement));
                });
            }
        });

        // Multiple character replacements (combinations)
        let multiLeet = current;
        Object.keys(leetMap).forEach((char) => {
            if (multiLeet.includes(char)) {
                multiLeet = multiLeet.replace(new RegExp(char, "g"), leetMap[char][0]);
            }
        });
        if (multiLeet !== current) variations.push(multiLeet);

        return [...new Set(variations)];
    };

    const applyRandomCase = (word: string): string[] => {
        const variations: string[] = [];
        const len = word.length;

        // Generate some random case variations (limit to prevent explosion)
        for (let i = 0; i < Math.min(10, Math.pow(2, len) / 2); i++) {
            let variation = "";
            for (let j = 0; j < len; j++) {
                variation += Math.random() > 0.5 ? word[j].toUpperCase() : word[j].toLowerCase();
            }
            variations.push(variation);
        }

        return [...new Set(variations)];
    };

    const generateMutations = (word: string): string[] => {
        const results: Set<string> = new Set([word]);
        const trimmed = word.trim();

        if (!trimmed || trimmed.length < minLength || trimmed.length > maxLength) return [];

        // Basic case mutations
        if (mutations.uppercase) results.add(trimmed.toUpperCase());
        if (mutations.lowercase) results.add(trimmed.toLowerCase());
        if (mutations.capitalize) {
            results.add(trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase());
            results.add(trimmed.toUpperCase().charAt(0) + trimmed.slice(1).toLowerCase());
        }
        if (mutations.reverse) results.add(trimmed.split("").reverse().join(""));
        if (mutations.duplicate) {
            results.add(trimmed + trimmed);
            results.add(trimmed + trimmed.toUpperCase());
        }

        // Random case variations
        if (mutations.randomCase) {
            applyRandomCase(trimmed).forEach(v => results.add(v));
        }

        // Leet speak
        if (mutations.leetspeak) {
            applyLeetSpeak(trimmed).forEach(v => results.add(v));
            // Also leet speak on capitalized version
            applyLeetSpeak(trimmed.charAt(0).toUpperCase() + trimmed.slice(1)).forEach(v => results.add(v));
        }

        // Number additions
        if (mutations.numbers || mutations.prefixNumbers || mutations.suffixNumbers) {
            const baseResults = Array.from(results);
            baseResults.forEach(base => {
                numberSuffixes.forEach((suffix) => {
                    if (mutations.suffixNumbers || mutations.numbers) {
                        results.add(base + suffix);
                    }
                    if (mutations.prefixNumbers || mutations.numbers) {
                        results.add(suffix + base);
                    }
                });
            });
        }

        // Year variations
        if (mutations.yearVariations) {
            const baseResults = Array.from(results);
            baseResults.forEach(base => {
                yearSuffixes.forEach((year) => {
                    results.add(base + year);
                    results.add(year + base);
                });
            });
        }

        // Special characters
        if (mutations.specialChars) {
            const baseResults = Array.from(results);
            baseResults.forEach(base => {
                commonSuffixes.forEach((suffix) => {
                    results.add(base + suffix);
                });
                ["!", "@", "#", "$", "%", "^", "&", "*"].forEach((char) => {
                    results.add(char + base);
                });
            });
        }

        return Array.from(results).filter(w => w.length >= minLength && w.length <= maxLength);
    };

    // Real-time generation using useMemo
    const realtimeWordlist = useMemo(() => {
        if (!realtimeEnabled || !baseWords.trim()) return [];

        const words = baseWords.split(/[\n,]/).filter((w) => w.trim().length > 0);
        if (words.length === 0) return [];

        let wordlist: string[] = [];
        words.forEach((word) => {
            wordlist.push(...generateMutations(word.trim()));
        });

        return [...new Set(wordlist)].slice(0, 10000); // Limit for performance
    }, [baseWords, mutations, minLength, maxLength, realtimeEnabled]);

    // Update generated wordlist when real-time changes
    useEffect(() => {
        if (realtimeEnabled && baseWords.trim()) {
            setGeneratedWordlist(realtimeWordlist);
        }
    }, [realtimeWordlist, realtimeEnabled, baseWords]);

    const generateBasicWordlist = () => {
        setIsGenerating(true);
        const words = baseWords.split(/[\n,]/).filter((w) => w.trim().length > 0);
        if (words.length === 0) {
            toast({
                title: "Error",
                description: "Please enter some base words",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        setTimeout(() => {
            let wordlist: string[] = [];
            words.forEach((word) => {
                const trimmed = word.trim();
                wordlist.push(...generateMutations(trimmed));
            });

            const uniqueList = [...new Set(wordlist)];
            setGeneratedWordlist(uniqueList);
            setIsGenerating(false);
            toast({
                title: "Success",
                description: `Generated ${uniqueList.length} unique words with all mutations`
            });
        }, 100);
    };

    const generateOSINTWordlist = () => {
        const { companyName, location, year, keywords } = osintData;
        if (!companyName && !location && !year && !keywords) {
            toast({
                title: "Error",
                description: "Please enter at least one OSINT parameter",
                variant: "destructive",
            });
            return;
        }

        let wordlist: string[] = [];
        const baseTerms = [companyName, location, year, ...keywords.split(",")].filter((t) => t.trim().length > 0);

        // Generate combinations
        baseTerms.forEach((term) => {
            const trimmed = term.trim();
            wordlist.push(...generateMutations(trimmed));

            // Add with years
            yearSuffixes.forEach((y) => {
                wordlist.push(trimmed + y);
                wordlist.push(y + trimmed);
            });

            // Combine with location/company
            if (companyName && trimmed !== companyName) {
                wordlist.push(companyName + trimmed);
                wordlist.push(trimmed + companyName);
            }

            if (location && trimmed !== location) {
                wordlist.push(location + trimmed);
                wordlist.push(trimmed + location);
            }
        });

        // Add common patterns with company name
        if (companyName) {
            commonPatterns.forEach((pattern) => {
                wordlist.push(companyName + pattern);
                wordlist.push(pattern + companyName);
            });
        }

        setGeneratedWordlist([...new Set(wordlist)]);
        toast({ description: `Generated ${wordlist.length} unique OSINT-based words` });
    };

    const generateCommonPasswordList = () => {
        let wordlist: string[] = [];

        commonPatterns.forEach((pattern) => {
            wordlist.push(...generateMutations(pattern));

            yearSuffixes.forEach((year) => {
                wordlist.push(pattern + year);
                wordlist.push(year + pattern);
            });

            numberSuffixes.forEach((num) => {
                wordlist.push(pattern + num);
            });
        });

        // Add common weak passwords
        const weakPasswords = [
            "password123",
            "admin123",
            "letmein",
            "qwerty",
            "123456",
            "password1",
            "welcome123",
            "admin@123",
            "root@123",
        ];

        wordlist.push(...weakPasswords);

        setGeneratedWordlist([...new Set(wordlist)]);
        toast({ description: `Generated ${wordlist.length} common password variations` });
    };

    const combineWordlists = () => {
        const baseList = baseWords.split(/[\n,]/).filter((w) => w.trim().length > 0);
        const customList = customWords.split(/[\n,]/).filter((w) => w.trim().length > 0);

        if (baseList.length === 0 || customList.length === 0) {
            toast({
                title: "Error",
                description: "Please enter words in both base and custom fields",
                variant: "destructive",
            });
            return;
        }

        let wordlist: string[] = [];

        // Create all possible combinations with different separators
        baseList.forEach((base) => {
            customList.forEach((custom) => {
                const trimmedBase = base.trim();
                const trimmedCustom = custom.trim();

                separators.forEach(sep => {
                    // Base + Custom
                    wordlist.push(trimmedBase + sep + trimmedCustom);
                    // Custom + Base
                    wordlist.push(trimmedCustom + sep + trimmedBase);

                    // Also try with case variations
                    wordlist.push(trimmedBase.toUpperCase() + sep + trimmedCustom);
                    wordlist.push(trimmedBase + sep + trimmedCustom.toUpperCase());
                    wordlist.push(trimmedBase.charAt(0).toUpperCase() + trimmedBase.slice(1) + sep + trimmedCustom);
                });
            });
        });

        const uniqueList = [...new Set(wordlist)].filter(w => w.length >= minLength && w.length <= maxLength);
        setGeneratedWordlist(uniqueList);
        toast({
            title: "Success",
            description: `Generated ${uniqueList.length} unique combinations`
        });
    };

    const downloadWordlist = () => {
        if (generatedWordlist.length === 0) {
            toast({
                title: "Error",
                description: "No wordlist to download",
                variant: "destructive",
            });
            return;
        }

        const content = generatedWordlist.join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `wordlist_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ description: "Wordlist downloaded successfully!" });
    };

    const copyWordlist = () => {
        const content = generatedWordlist.join("\n");
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast({ description: "Wordlist copied to clipboard" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-red-600" />
                            Wordlist Generator
                        </h1>
                        <p className="text-muted-foreground">
                            Generate custom wordlists with real-time mutations, combinations, and OSINT-based variations
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className={`h-5 w-5 ${realtimeEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                            <Label htmlFor="realtime" className="cursor-pointer">Real-time Generation</Label>
                            <Switch
                                id="realtime"
                                checked={realtimeEnabled}
                                onCheckedChange={setRealtimeEnabled}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Length Controls */}
            <Card className="mb-6 bg-gradient-to-r from-red-600/10 to-orange-600/10 border-red-600/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-red-600" />
                        Word Length Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Minimum Length: {minLength}</Label>
                            </div>
                            <Slider
                                value={[minLength]}
                                onValueChange={(value) => setMinLength(value[0])}
                                min={1}
                                max={15}
                                step={1}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Maximum Length: {maxLength}</Label>
                            </div>
                            <Slider
                                value={[maxLength]}
                                onValueChange={(value) => setMaxLength(value[0])}
                                min={5}
                                max={50}
                                step={1}
                                className="w-full"
                            />
                        </div>
                    </div>
                    {realtimeEnabled && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Real-time generation active - wordlist updates as you type
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="osint">OSINT-Based</TabsTrigger>
                    <TabsTrigger value="common">Common Passwords</TabsTrigger>
                    <TabsTrigger value="combine">Combine</TabsTrigger>
                </TabsList>

                {/* Basic Generator */}
                <TabsContent value="basic">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Wordlist Generator</CardTitle>
                                <CardDescription>Generate variations from base words</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="base-words">Base Words (one per line or comma-separated)</Label>
                                    <Textarea
                                        id="base-words"
                                        placeholder="admin&#10;password&#10;company&#10;test"
                                        value={baseWords}
                                        onChange={(e) => setBaseWords(e.target.value)}
                                        rows={8}
                                        className="font-mono"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label>Mutation Options (Real-time)</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.uppercase}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, uppercase: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Uppercase (ABC)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.lowercase}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, lowercase: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Lowercase (abc)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.capitalize}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, capitalize: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Capitalize (Abc)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.randomCase}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, randomCase: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Random Case (aBc)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.leetspeak}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, leetspeak: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Leet Speak (p@ssw0rd)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.numbers}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, numbers: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Numbers (123, 1234)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.yearVariations}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, yearVariations: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Years (2024, 2025)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.specialChars}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, specialChars: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Special (!@#$%)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.reverse}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, reverse: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Reverse (cba)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.duplicate}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, duplicate: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Duplicate (abcabc)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.prefixNumbers}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, prefixNumbers: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Prefix Numbers</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={mutations.suffixNumbers}
                                                onCheckedChange={(checked) => setMutations({ ...mutations, suffixNumbers: checked })}
                                            />
                                            <Label className="cursor-pointer text-sm">Suffix Numbers</Label>
                                        </div>
                                    </div>
                                </div>

                                {!realtimeEnabled && (
                                    <Button onClick={generateBasicWordlist} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-lg" disabled={isGenerating}>
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Shuffle className="w-4 h-4 mr-2" />
                                                Generate Complete Wordlist
                                            </>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <WordlistPreview
                            wordlist={generatedWordlist}
                            onDownload={downloadWordlist}
                            onCopy={copyWordlist}
                            copied={copied}
                        />
                    </div>
                </TabsContent>

                {/* OSINT-Based Generator */}
                <TabsContent value="osint">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>OSINT-Based Wordlist</CardTitle>
                                <CardDescription>Generate wordlists from OSINT data</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="company">Company Name</Label>
                                    <Input
                                        id="company"
                                        placeholder="TechCorp"
                                        value={osintData.companyName}
                                        onChange={(e) => setOsintData({ ...osintData, companyName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">Location/City</Label>
                                    <Input
                                        id="location"
                                        placeholder="NewYork"
                                        value={osintData.location}
                                        onChange={(e) => setOsintData({ ...osintData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="year">Year/Date</Label>
                                    <Input
                                        id="year"
                                        placeholder="2024"
                                        value={osintData.year}
                                        onChange={(e) => setOsintData({ ...osintData, year: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="keywords">Additional Keywords (comma-separated)</Label>
                                    <Textarea
                                        id="keywords"
                                        placeholder="project, team, department"
                                        value={osintData.keywords}
                                        onChange={(e) => setOsintData({ ...osintData, keywords: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <Button onClick={generateOSINTWordlist} className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate OSINT Wordlist
                                </Button>
                            </CardContent>
                        </Card>

                        <WordlistPreview
                            wordlist={generatedWordlist}
                            onDownload={downloadWordlist}
                            onCopy={copyWordlist}
                            copied={copied}
                        />
                    </div>
                </TabsContent>

                {/* Common Passwords */}
                <TabsContent value="common">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Common Password Patterns</CardTitle>
                                <CardDescription>Generate list of commonly used password patterns</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <h4 className="font-semibold text-sm">Includes patterns like:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {commonPatterns.slice(0, 6).map((pattern) => (
                                            <Badge key={pattern} variant="secondary">
                                                {pattern}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        With variations: numbers, special chars, years, leet speak
                                    </p>
                                </div>

                                <Button onClick={generateCommonPasswordList} className="w-full">
                                    <Shuffle className="w-4 h-4 mr-2" />
                                    Generate Common Patterns
                                </Button>

                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm">
                                    <p className="font-semibold mb-2">⚠️ Usage Warning</p>
                                    <p className="text-xs">
                                        These are common weak passwords. Use only for authorized security testing and password auditing.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <WordlistPreview
                            wordlist={generatedWordlist}
                            onDownload={downloadWordlist}
                            onCopy={copyWordlist}
                            copied={copied}
                        />
                    </div>
                </TabsContent>

                {/* Combination Generator */}
                <TabsContent value="combine">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Combine Wordlists</CardTitle>
                                <CardDescription>Create combinations from two word lists</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="base-combine">Base Words</Label>
                                    <Textarea
                                        id="base-combine"
                                        placeholder="user&#10;admin&#10;root"
                                        value={baseWords}
                                        onChange={(e) => setBaseWords(e.target.value)}
                                        rows={5}
                                        className="font-mono"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="custom-combine">Words to Combine With</Label>
                                    <Textarea
                                        id="custom-combine"
                                        placeholder="123&#10;2024&#10;pass"
                                        value={customWords}
                                        onChange={(e) => setCustomWords(e.target.value)}
                                        rows={5}
                                        className="font-mono"
                                    />
                                </div>

                                <div className="bg-muted p-3 rounded-lg text-xs">
                                    <p>Combinations: word1word2, word2word1, word1_word2, word1-word2</p>
                                </div>

                                <Button onClick={combineWordlists} className="w-full bg-gradient-to-r from-red-600 to-orange-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate Combinations
                                </Button>
                            </CardContent>
                        </Card>

                        <WordlistPreview
                            wordlist={generatedWordlist}
                            onDownload={downloadWordlist}
                            onCopy={copyWordlist}
                            copied={copied}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Wordlist Preview Component
const WordlistPreview = ({
    wordlist,
    onDownload,
    onCopy,
    copied,
}: {
    wordlist: string[];
    onDownload: () => void;
    onCopy: () => void;
    copied: boolean;
}) => {
    const totalCount = wordlist.length;
    const displayCount = Math.min(totalCount, 500);
    const hiddenCount = totalCount - displayCount;

    return (
        <Card className="h-fit">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Generated Wordlist
                            {totalCount > 0 && (
                                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                                    {totalCount.toLocaleString()} entries
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {totalCount === 0 ? "Enter words and configure mutations" : `Showing first ${displayCount} of ${totalCount.toLocaleString()} entries`}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={onCopy} disabled={totalCount === 0}>
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" onClick={onDownload} disabled={totalCount === 0} className="bg-gradient-to-r from-red-600 to-orange-600">
                            <Download className="w-4 h-4 mr-1" />
                            TXT
                        </Button>
                    </div>
                </div>
                {totalCount > 0 && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{((displayCount / totalCount) * 100).toFixed(0)}% displayed</span>
                        </div>
                        <Progress value={(displayCount / totalCount) * 100} className="h-2" />
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {totalCount === 0 ? (
                    <div className="text-center py-12 text-muted-foreground space-y-3">
                        <Sparkles className="h-12 w-12 mx-auto text-red-600 opacity-50" />
                        <p>No wordlist generated yet.</p>
                        <p className="text-xs">Enter base words and enable mutations to see real-time results</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-muted rounded-lg p-4 max-h-[600px] overflow-y-auto border-2">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                {wordlist.slice(0, displayCount).join("\n")}
                                {hiddenCount > 0 && `\n\n... and ${hiddenCount.toLocaleString()} more entries (scroll or download full list)`}
                            </pre>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-green-600/10 border border-green-600/20 rounded-lg text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-semibold">
                                All {totalCount.toLocaleString()} unique possibilities generated
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WordlistGenerator;
