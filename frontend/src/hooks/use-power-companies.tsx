import { getPowerCompanies, type PowerCompany } from '@/api/power-companies';
import { useEffect, useState } from 'react';

export const usePowerCompanies = () => {
  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);

  const [selectedPowerCompanyId, setSelectedPowerCompanyId] = useState<
    string | null
  >(null);

  const [isLoadingPowerCompanies, setIsLoadingPowerCompanies] =
    useState<boolean>(true);

  const [powerCompanyError, setPowerCompanyError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadPowerCompanies = async () => {
      try {
        const companies = await getPowerCompanies(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setPowerCompanies(companies);
        setSelectedPowerCompanyId(companies[0]?.id ?? null);
        setPowerCompanyError(null);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        if (!controller.signal.aborted) {
          setPowerCompanies([]);
          setSelectedPowerCompanyId(null);
          setPowerCompanyError(
            error instanceof Error
              ? error.message
              : 'Unable to load power companies',
          );
        }
      } finally {
        setIsLoadingPowerCompanies(false);
      }
    };

    void loadPowerCompanies();

    return () => {
      controller.abort();
    };
  }, []);

  const selectPowerCompany = (companyId: string | null) => {
    setSelectedPowerCompanyId(companyId);
  };

  const companyOptions = powerCompanies.map((company) => ({
    value: company.id,
    label: `${company.longName} (${company.shortName})`,
  }));

  return {
    powerCompanies,
    selectedPowerCompanyId,
    isLoadingPowerCompanies,
    powerCompanyError,
    selectPowerCompany,
    companyOptions,
  };
};
