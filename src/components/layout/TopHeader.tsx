import { Home, User } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface TopHeaderProps {
  currentPage?: string;
}

export const TopHeader = ({ currentPage = 'Календарь' }: TopHeaderProps) => {
  return (
    <header className="flex items-center justify-between h-10 px-4 mb-4 bg-card rounded-xl border border-border">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">
              {currentPage}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-foreground font-medium">Гость</span>
          <span className="text-muted-foreground text-xs">Участник</span>
        </div>
        <div className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
