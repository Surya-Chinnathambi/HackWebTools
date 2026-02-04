import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check, ArrowLeftRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EncoderDecoder = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Output copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSwap = () => {
        setInput(output);
        setOutput(input);
    };

    // Base64 Encoding/Decoding
    const base64Encode = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid input for Base64 encoding",
                variant: "destructive",
            });
        }
    };

    const base64Decode = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid Base64 string",
                variant: "destructive",
            });
        }
    };

    // URL Encoding/Decoding
    const urlEncode = () => {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
    };

    const urlDecode = () => {
        try {
            const decoded = decodeURIComponent(input);
            setOutput(decoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid URL encoded string",
                variant: "destructive",
            });
        }
    };

    // HTML Entity Encoding/Decoding
    const htmlEncode = () => {
        const element = document.createElement("div");
        element.textContent = input;
        setOutput(element.innerHTML);
    };

    const htmlDecode = () => {
        const element = document.createElement("div");
        element.innerHTML = input;
        setOutput(element.textContent || "");
    };

    // Hex Encoding/Decoding
    const hexEncode = () => {
        const hex = Array.from(input)
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("");
        setOutput(hex);
    };

    const hexDecode = () => {
        try {
            const decoded = input
                .match(/.{1,2}/g)
                ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
                .join("") || "";
            setOutput(decoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid hex string",
                variant: "destructive",
            });
        }
    };

    // Unicode Encoding
    const unicodeEncode = () => {
        const encoded = Array.from(input)
            .map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"))
            .join("");
        setOutput(encoded);
    };

    const unicodeDecodeFunc = () => {
        try {
            const decoded = input.replace(/\\u([\d\w]{4})/gi, (match, grp) =>
                String.fromCharCode(parseInt(grp, 16))
            );
            setOutput(decoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid unicode string",
                variant: "destructive",
            });
        }
    };

    // Binary Encoding/Decoding
    const binaryEncode = () => {
        const binary = Array.from(input)
            .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
        setOutput(binary);
    };

    const binaryDecode = () => {
        try {
            const decoded = input
                .split(" ")
                .map((bin) => String.fromCharCode(parseInt(bin, 2)))
                .join("");
            setOutput(decoded);
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid binary string",
                variant: "destructive",
            });
        }
    };

    // ROT13
    const rot13 = () => {
        const result = input.replace(/[a-zA-Z]/g, (char) => {
            const start = char <= "Z" ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
        setOutput(result);
    };

    // Hash Functions
    const generateHash = async (algorithm: string) => {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
            setOutput(hashHex);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to generate ${algorithm} hash`,
                variant: "destructive",
            });
        }
    };

    // JWT Decoder
    const decodeJWT = () => {
        try {
            const parts = input.split(".");
            if (parts.length !== 3) {
                throw new Error("Invalid JWT format");
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            setOutput(JSON.stringify({ header, payload }, null, 2));
        } catch (error) {
            toast({
                title: "Error",
                description: "Invalid JWT token",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Encoder/Decoder Hub</h1>
                <p className="text-muted-foreground">
                    Comprehensive encoding, decoding, and hashing utilities for penetration testing
                </p>
            </div>

            <Tabs defaultValue="base64" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto">
                    <TabsTrigger value="base64">Base64</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="html">HTML Entity</TabsTrigger>
                    <TabsTrigger value="hex">Hex</TabsTrigger>
                    <TabsTrigger value="unicode">Unicode</TabsTrigger>
                    <TabsTrigger value="binary">Binary</TabsTrigger>
                    <TabsTrigger value="rot13">ROT13</TabsTrigger>
                    <TabsTrigger value="hash">Hash</TabsTrigger>
                    <TabsTrigger value="jwt">JWT</TabsTrigger>
                </TabsList>

                {/* Base64 Tab */}
                <TabsContent value="base64">
                    <Card>
                        <CardHeader>
                            <CardTitle>Base64 Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Encode or decode text using Base64 encoding - commonly used for data transmission
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={base64Encode}>Encode</Button>
                                <Button onClick={base64Decode} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* URL Tab */}
                <TabsContent value="url">
                    <Card>
                        <CardHeader>
                            <CardTitle>URL Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Encode or decode URL parameters and query strings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter URL or text to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={urlEncode}>Encode</Button>
                                <Button onClick={urlDecode} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* HTML Entity Tab */}
                <TabsContent value="html">
                    <Card>
                        <CardHeader>
                            <CardTitle>HTML Entity Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Convert special characters to HTML entities and vice versa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={htmlEncode}>Encode</Button>
                                <Button onClick={htmlDecode} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hex Tab */}
                <TabsContent value="hex">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hex Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Convert text to hexadecimal and back - useful for binary data representation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text or hex to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={hexEncode}>Encode</Button>
                                <Button onClick={hexDecode} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Unicode Tab */}
                <TabsContent value="unicode">
                    <Card>
                        <CardHeader>
                            <CardTitle>Unicode Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Convert text to Unicode escape sequences - useful for WAF bypass
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text or unicode to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={unicodeEncode}>Encode</Button>
                                <Button onClick={unicodeDecodeFunc} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Binary Tab */}
                <TabsContent value="binary">
                    <Card>
                        <CardHeader>
                            <CardTitle>Binary Encoder/Decoder</CardTitle>
                            <CardDescription>
                                Convert text to binary representation and back
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text or binary to encode/decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={binaryEncode}>Encode</Button>
                                <Button onClick={binaryDecode} variant="secondary">
                                    Decode
                                </Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROT13 Tab */}
                <TabsContent value="rot13">
                    <Card>
                        <CardHeader>
                            <CardTitle>ROT13 Cipher</CardTitle>
                            <CardDescription>
                                Simple letter substitution cipher that replaces a letter with the 13th letter after it
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text to cipher/decipher..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={rot13}>ROT13</Button>
                                <Button onClick={handleSwap} variant="outline">
                                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                                    Swap
                                </Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hash Tab */}
                <TabsContent value="hash">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hash Generator</CardTitle>
                            <CardDescription>
                                Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">Input</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter text to hash..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={() => generateHash("SHA-1")}>SHA-1</Button>
                                <Button onClick={() => generateHash("SHA-256")}>SHA-256</Button>
                                <Button onClick={() => generateHash("SHA-384")}>SHA-384</Button>
                                <Button onClick={() => generateHash("SHA-512")}>SHA-512</Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[120px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* JWT Tab */}
                <TabsContent value="jwt">
                    <Card>
                        <CardHeader>
                            <CardTitle>JWT Decoder</CardTitle>
                            <CardDescription>
                                Decode and inspect JSON Web Tokens (JWT) - does not verify signature
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="input">JWT Token</Label>
                                <Textarea
                                    id="input"
                                    placeholder="Enter JWT token to decode..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-[120px] font-mono"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button onClick={decodeJWT}>Decode JWT</Button>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label htmlFor="output">Decoded Output</Label>
                                    <Button onClick={handleCopy} size="sm" variant="ghost">
                                        {copied ? (
                                            <Check className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Copy className="w-4 h-4 mr-2" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                                <Textarea
                                    id="output"
                                    value={output}
                                    readOnly
                                    className="min-h-[200px] font-mono bg-muted"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EncoderDecoder;
