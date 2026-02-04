import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Star, Trash2, AlertCircle } from "lucide-react";
import { usePayloadHistory } from "@/hooks/usePayloadHistory";
import PayloadCard from "@/components/PayloadCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PayloadHistory = () => {
    const { history, favorites, clearHistory, removeFromHistory, getFavoritePayloads } = usePayloadHistory();
    const [activeTab, setActiveTab] = useState("history");

    const favoritePayloads = getFavoritePayloads();

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Payload History & Favorites</h1>
                <p className="text-muted-foreground">
                    Track your recently used payloads and save favorites for quick access
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        History ({history.length})
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Favorites ({favorites.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Payloads</CardTitle>
                                    <CardDescription>
                                        Your last {history.length} accessed payloads
                                    </CardDescription>
                                </div>
                                {history.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Clear History
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete all your payload history. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={clearHistory}>
                                                    Clear History
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No history yet. Copy or download a payload to see it here.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((item, index) => (
                                        <div key={item.payload.id + item.timestamp} className="relative">
                                            <div className="absolute top-2 right-2 z-10">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeFromHistory(item.payload.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <div className="text-xs text-muted-foreground mb-2">
                                                {new Date(item.timestamp).toLocaleString()}
                                            </div>
                                            <PayloadCard payload={item.payload} index={index} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="favorites" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Payloads</CardTitle>
                            <CardDescription>
                                Payloads you've marked as favorites for quick access
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {favoritePayloads.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No favorites yet. Click the star icon on any payload to add it to favorites.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {favoritePayloads.map((payload, index) => (
                                        <PayloadCard key={payload.id} payload={payload} index={index} />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PayloadHistory;
