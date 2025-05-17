
interface PayloadFooterProps {
  count: number;
}

export const PayloadFooter = ({ count }: PayloadFooterProps) => {
  return (
    <div className="mt-8 text-center text-sm text-muted-foreground">
      Showing {count} payloads from the{' '}
      <a 
        href="https://github.com/Surya-Chinnathambi/HackWebTools/blob/master/public/assets/payloads" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Surya-Chinnathambi
      </a>{' '}
      GitHub repository (locally hosted)
    </div>
  );
};
