
interface PayloadFooterProps {
  count: number;
}

export const PayloadFooter = ({ count }: PayloadFooterProps) => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      Showing {count} payloads from the{' '}
      <a 
        href="https://github.com/aw-junaid/Hacking-Tools/tree/master/Payloads/Payloads%20TXT" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        aw-junaid/Hacking-Tools
      </a>{' '}
      GitHub repository (locally hosted)
    </div>
  );
};
