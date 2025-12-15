import React, { useEffect, useState } from "react";
import Scripts from "../../shared/utils/clientScripts.ts";
import { ContractorsSearchData } from "../../shared/types.ts";
import IncomingEmail from "./IncomingEmail.tsx";
import Loader from "../../../UIKit/Loader/Loader.tsx";

/** Обёртка модального окна с контроллером видимости */
export default function IncomingEmailWrapper() {
  // Данные поиска контрагентов с одинаковым email
  const [contractorsSearchData, setContractorsSearchData] =
    useState<ContractorsSearchData>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const onInitHandler = async () => {
      await Scripts.OnInit();

      const currentURL = new URL(window.location.href);
      const email = currentURL.searchParams.get("email") || undefined;
      const insuredId = currentURL.searchParams.get("insuredId") || undefined;
      
      const interactionId =
      currentURL.searchParams.get("interactionId") || undefined;
      
      const globalContractorId =
      currentURL.searchParams.get("contractorId") || undefined;

      const policyId = currentURL.searchParams.get("policyId") || await Scripts.getContractorPolicyId(globalContractorId) || undefined;

      const data: ContractorsSearchData = {};
      if (email) data.email = email;
      if (insuredId) data.globalInsuredId = insuredId;
      if (policyId) data.globalPolicyId = policyId;
      if (interactionId) data.interactionId = interactionId;

      if (globalContractorId) data.globalContractorId = globalContractorId;

      setContractorsSearchData(data);
      setIsLoading(false);
    }

    onInitHandler();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <IncomingEmail contractorsSearchData={contractorsSearchData} />
  );
}
