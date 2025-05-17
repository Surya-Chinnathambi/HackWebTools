
import PayloadCard from "@/components/PayloadCard";
import { Payload } from "@/types/payload";

interface PayloadCardViewProps {
  payloads: Payload[];
}

export const PayloadCardView = ({ payloads }: PayloadCardViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {payloads.map((payload, index) => (
        <PayloadCard key={payload.id} payload={payload} index={index} />
      ))}
    </div>
  );
};
