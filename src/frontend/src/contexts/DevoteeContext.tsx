import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Devotee {
  id: string;
  name: string;
}

interface DevoteeContextType {
  currentDevotee: Devotee | null;
  devotees: Devotee[];
  addDevotee: (name: string) => void;
  selectDevotee: (id: string) => void;
}

const DevoteeContext = createContext<DevoteeContextType | undefined>(undefined);

export function DevoteeProvider({ children }: { children: ReactNode }) {
  const [devotees, setDevotees] = useState<Devotee[]>(() => {
    const saved = localStorage.getItem("anantjap_devotees");
    if (saved) {
      return JSON.parse(saved);
    }
    const defaultDevotee = { id: "default", name: "Default Devotee" };
    return [defaultDevotee];
  });

  const [currentDevotee, setCurrentDevotee] = useState<Devotee | null>(() => {
    const savedId = localStorage.getItem("anantjap_current_devotee");
    if (savedId) {
      return devotees.find((d) => d.id === savedId) || devotees[0];
    }
    return devotees[0];
  });

  useEffect(() => {
    localStorage.setItem("anantjap_devotees", JSON.stringify(devotees));
  }, [devotees]);

  useEffect(() => {
    if (currentDevotee) {
      localStorage.setItem("anantjap_current_devotee", currentDevotee.id);
    }
  }, [currentDevotee]);

  const addDevotee = (name: string) => {
    const newDevotee: Devotee = {
      id: `devotee_${Date.now()}`,
      name,
    };
    setDevotees([...devotees, newDevotee]);
    setCurrentDevotee(newDevotee);
  };

  const selectDevotee = (id: string) => {
    const devotee = devotees.find((d) => d.id === id);
    if (devotee) {
      setCurrentDevotee(devotee);
    }
  };

  return (
    <DevoteeContext.Provider
      value={{ currentDevotee, devotees, addDevotee, selectDevotee }}
    >
      {children}
    </DevoteeContext.Provider>
  );
}

export function useDevotee() {
  const context = useContext(DevoteeContext);
  if (!context) {
    throw new Error("useDevotee must be used within DevoteeProvider");
  }
  return context;
}
