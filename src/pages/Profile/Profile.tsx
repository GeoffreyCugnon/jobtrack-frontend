import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { User } from "@phosphor-icons/react";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";

import { ProfileIdentity } from "../../components/Profile/ProfileIdentity";
import { ProfileContact } from "../../components/Profile/Contact/ProfileContact";
import { ProfileSkills } from "../../components/Profile/Skill/ProfileSkills";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { getUserDisplay } from "../../utils/user-display";
import { UserApi } from "../../api/user.api";
import { queryKeys } from "../../api/query-keys";

export function Profile() {
  const navigate = useNavigate();
  const display = getUserDisplay(useAuthStore((state) => state.user));

  const { data: skills = [] } = useQuery({
    queryKey: queryKeys.skills.mine,
    queryFn: () => UserApi.getSkills(),
  });

  // Persiste le nouvel avatar en base et met à jour le store -> il se propage
  // partout (SideMenu, bannière du Dashboard, etc.).
  const saveAvatar = async (dataUrl: string) => {
    try {
      const updated = await UserApi.updateAvatar(dataUrl);
      useAuthStore.getState().setUser(updated);
      useToastStore
        .getState()
        .addToast("Photo de profil mise à jour", "success");
    } catch (error) {
      useToastStore
        .getState()
        .addToast("Échec de la mise à jour de la photo", "error");
      throw error;
    }
  };

  const saveBanner = async (dataUrl: string) => {
    try {
      const updated = await UserApi.updateBanner(dataUrl);
      useAuthStore.getState().setUser(updated);
      useToastStore.getState().addToast("Bannière mise à jour", "success");
    } catch (error) {
      useToastStore
        .getState()
        .addToast("Échec de la mise à jour de la bannière", "error");
      throw error;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Mon profil"
          description="Vos informations visibles par les recruteurs"
          icon={User}
        />

        <div className="-mx-4 sm:mx-0 mt-3">
          <ProfileIdentity
            user={display}
            onEdit={() => navigate("/profile/edit")}
            onAvatarChange={saveAvatar}
            onBannerChange={saveBanner}
          />
          <ProfileContact
            user={display}
            onAdd={() => navigate("/profile/contact/edit")}
          />
          <ProfileSkills
            skills={skills}
            onAdd={() => navigate("/profile/skills/edit")}
          />
        </div>
      </PageContainer>
    </div>
  );
}
