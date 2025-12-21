import { Home, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const TopBar = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between animate-fade-in">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">Сообщество</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Гость</p>
          <p className="text-xs text-muted-foreground">Участник сообщества</p>
        </div>
        <Avatar className="h-10 w-10 ring-2 ring-border hover:ring-primary transition-all cursor-pointer">
          <AvatarFallback className="bg-secondary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
