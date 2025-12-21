import { Link } from "react-router-dom";

interface BlockHeaderProps {
  title: string;
  to: string;
}

const BlockHeader = ({ title, to }: BlockHeaderProps) => {
  return (
    <div className="flex-shrink-0 mb-3">
      <Link 
        to={to} 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
      </Link>
    </div>
  );
};

export default BlockHeader;
