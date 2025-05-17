
import { Loader } from "lucide-react";

export const PayloadLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading security payloads...</p>
      <p className="text-xs text-muted-foreground mt-2">Processing payload data from repository</p>
    </div>
  );
};
