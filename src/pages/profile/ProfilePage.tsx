import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileBlocks from "@/components/ProfileBlocks";

const Index = () => {
  return (
    <div className="flex h-screen w-screen p-6 gap-6 bg-background">
      {/* Left Sidebar */}
      <ProfileSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Profile Header */}
        <ProfileHeader />

        {/* Content Blocks */}
        <ProfileBlocks />
      </main>
    </div>
  );
};

export default Index;
