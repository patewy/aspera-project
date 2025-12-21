const ProfileBlocks = () => {
  return (
    <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-[0.75rem] p-6 card-hover cursor-pointer animate-fade-in"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default ProfileBlocks;
