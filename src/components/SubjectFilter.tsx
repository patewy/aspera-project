import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface SubjectFilterProps {
  subjects: string[];
  selectedSubjects: string[];
  onSubjectToggle: (subject: string) => void;
}

export const SubjectFilter = ({ subjects, selectedSubjects, onSubjectToggle }: SubjectFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-border">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
        {subjects.map((subject) => (
          <DropdownMenuCheckboxItem
            key={subject}
            checked={selectedSubjects.includes(subject)}
            onCheckedChange={() => onSubjectToggle(subject)}
          >
            {subject}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
