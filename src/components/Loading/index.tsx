import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
const LoadingBase = () => {
  return (
    <div className="text-center p-2">
      <Icon
        path={mdiLoading}
        size={1}
        className="inline animate-spin text-gray-700"
      />
    </div>
  );
};

export const Loading = React.memo(LoadingBase);
