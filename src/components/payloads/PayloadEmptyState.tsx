
interface PayloadEmptyStateProps {
  clearFilters: () => void;
}

export const PayloadEmptyState = ({ clearFilters }: PayloadEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">No payloads found matching your filters.</p>
      <button
        onClick={clearFilters}
        className="mt-4 text-primary underline hover:text-primary/80"
      >
        Clear all filters
      </button>
    </div>
  );
};
