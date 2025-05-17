
interface PayloadErrorProps {
  error: string;
}

export const PayloadError = ({ error }: PayloadErrorProps) => {
  return (
    <div className="p-4 mb-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="text-red-600 underline mt-2 hover:text-red-800"
      >
        Refresh page
      </button>
    </div>
  );
};
