import { useState } from "react";
import { PhoneFrame } from "@/components/jumbo/PhoneFrame";
import { StatusBar } from "@/components/jumbo/StatusBar";
import { BottomNav, type TabId } from "@/components/jumbo/BottomNav";
import { HomeScreen } from "@/components/jumbo/HomeScreen";
import { NewsScreen } from "@/components/jumbo/NewsScreen";
import { WalletScreen } from "@/components/jumbo/WalletScreen";
import { GameScreen } from "@/components/jumbo/GameScreen";
import { ProfileScreen } from "@/components/jumbo/ProfileScreen";

const Index = () => {
  const [tab, setTab] = useState<TabId>("home");
  const name = "Anna";

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full bg-background">
        <StatusBar dark={tab === "profile"} />
        <div className="flex-1 min-h-0">
          {tab === "home" && <HomeScreen name={name} />}
          {tab === "news" && <NewsScreen />}
          {tab === "wallet" && <WalletScreen name={name} />}
          {tab === "game" && <GameScreen />}
          {tab === "profile" && <ProfileScreen name={name} />}
        </div>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </PhoneFrame>
  );
};

export default Index;
