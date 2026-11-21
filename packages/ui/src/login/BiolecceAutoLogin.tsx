// Biolecce: entra direto no Biolecce Flash com a chave embutida no build,
// sem a tela de login do Z.ai. Sem chave no build, cai na WelcomeScreen original.
import { useEffect, useRef, useState } from "react";
import { useServices } from "@/hooks/useServices.js";
import { useZCodeStore } from "@/store/StoreProvider.js";
import { WelcomeScreen, type LoginCompleteReason } from "@/WelcomeScreen.js";
import { buildLoginApiKeyDefaultModelPreferenceFromSelection } from "./LoginApiKeyForm.helpers.js";

const BIOLECCE_TEMPLATE_ID = "deepseek";
const BIOLECCE_API_KEY: string = (import.meta.env.VITE_BIOLECCE_API_KEY as string | undefined) ?? "";

export function BiolecceAutoLogin({
  onComplete,
}: {
  onComplete: (reason: LoginCompleteReason) => void | Promise<void>;
}) {
  const { modelSelectionService, providerSettingsService } = useServices();
  const markApiKeyLoginSuccess = useZCodeStore((state) => state.markApiKeyLoginSuccess);
  const [fallback, setFallback] = useState(BIOLECCE_API_KEY.trim().length === 0);
  const started = useRef(false);

  useEffect(() => {
    if (fallback || started.current) return;
    started.current = true;
    void (async () => {
      try {
        const view = await providerSettingsService.getView();
        const existing = view.providers.find((p) => p.templateId === BIOLECCE_TEMPLATE_ID);
        let providerId = existing?.providerId;
        if (!providerId) {
          const template = view.providerTemplates.find((t) => t.templateId === BIOLECCE_TEMPLATE_ID);
          if (!template) throw new Error("template Biolecce Flash ausente");
          const created = await providerSettingsService.createPersonalProvider({
            templateId: BIOLECCE_TEMPLATE_ID,
            initialConfig: { access: { type: "api-key", apiKey: BIOLECCE_API_KEY.trim() } },
          } as Parameters<typeof providerSettingsService.createPersonalProvider>[0]);
          providerId = created.providerId;
        }
        markApiKeyLoginSuccess(
          buildLoginApiKeyDefaultModelPreferenceFromSelection(
            await modelSelectionService.getView(),
            providerId,
          ),
        );
        await onComplete("apiKey");
      } catch (error) {
        console.error("[BiolecceAutoLogin] falhou, abrindo login padrão", error);
        setFallback(true);
      }
    })();
  }, [fallback, markApiKeyLoginSuccess, modelSelectionService, onComplete, providerSettingsService]);

  if (fallback) return <WelcomeScreen onComplete={onComplete} />;
  return <div className="flex h-full w-full items-center justify-center text-ui-base">Biolecce Code</div>;
}
