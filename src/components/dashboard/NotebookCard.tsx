import BlockHeader from "./BlockHeader";

const NotebookCard = () => {
  return (
    <div className="h-full bg-card border border-border rounded-[0.75rem] p-6 flex flex-col animate-fade-in-delay-3">
      <BlockHeader title="Конспектариум" to="/folder" />
      
      <div className="flex-1 bg-secondary/50 rounded-xl flex items-center justify-center">
        <span className="text-muted-foreground/50 text-sm">Нажми чтобы создать</span>
      </div>
    </div>
  );
};

export default NotebookCard;
