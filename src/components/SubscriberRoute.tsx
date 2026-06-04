// TODO: re-enable subscription gating before launch.
// During development all feature pages are open. To restore gating,
// uncomment the original logic below.
import { ReactNode } from "react";

const SubscriberRoute = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SubscriberRoute;
